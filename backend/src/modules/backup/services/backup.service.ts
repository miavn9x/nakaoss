import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import archiver from 'archiver';
import * as path from 'path';
import * as fs from 'fs';
import { PassThrough } from 'stream';

@Injectable()
export class BackupService {
  /**
   * Tạo stream backup chứa:
   * 1. Dump database (mongodump) -> stream
   */
  private isBackingUp = false;

  getBackupStream(): { stream: PassThrough; filename: string } {
    if (this.isBackingUp) {
      throw new InternalServerErrorException(
        'Một bản backup cá nhân khác đang được thực hiện. Vui lòng đợi trong giây lát.',
      );
    }

    this.isBackingUp = true;
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Nén tối đa
    });

    const stream = new PassThrough();
    archive.pipe(stream);

    // 1. Dump MongoDB
    // Lấy MONGO_URI từ env
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new InternalServerErrorException('MONGO_URI not found');
    }

    const command = this.getToolCommand('mongodump');
    // REMOVE --gzip here to avoid double compression issues
    const dumpProcess = spawn(command, [`--uri=${mongoUri}`, '--archive']);

    dumpProcess.on('error', (err: unknown) => {
      console.error('Mongodump failed:', err);
      if (this.isSystemError(err) && err.code === 'ENOENT') {
        console.error('ERROR: mongodump command not found. Please install MongoDB Database Tools.');
      }
    });

    dumpProcess.stderr.on('data', (data: Buffer) => {
      console.error(`Mongodump stderr: ${data.toString()}`);
    });

    // Append luồng dump vào file 'mongo_dump.archive' trong zip
    archive.append(dumpProcess.stdout, { name: 'mongo_dump.archive' });

    // 2. Thêm folder Uploads
    // Đường dẫn gốc của project backend
    const uploadDir = path.join(process.cwd(), 'uploads');
    archive.directory(uploadDir, 'uploads');

    // Kết thúc archive (khi mongodump + đóng gói xong)
    archive.finalize().catch((err: unknown) => {
      console.error('Archiver finalize error:', err);
    });

    // Giải phóng Lock khi hoàn thành hoặc lỗi
    const resetLock = () => {
      this.isBackingUp = false;
    };
    archive.on('close', resetLock);
    archive.on('end', resetLock);
    archive.on('error', resetLock);
    stream.on('close', resetLock);
    stream.on('error', resetLock);

    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_full_${date}.zip`;

    return { stream, filename };
  }

  /**
   * Restore từ file zip (path)
   * Phục hồi DB và folder uploads
   */
  async restoreFromZip(zipPath: string): Promise<void> {
    const unzipper = await import('unzipper');

    // Mở luồng đọc file zip
    const zipStream = fs.createReadStream(zipPath).pipe(unzipper.Parse({ forceStream: true }));
    const targetDir = process.cwd();

    // Xóa thư mục uploads cũ trước khi extract
    const uploadsPath = path.join(targetDir, 'uploads');
    if (fs.existsSync(uploadsPath)) {
      await fs.promises.rm(uploadsPath, { recursive: true, force: true });
    }

    // Create temp directory if not exists
    const tempDir = path.join(targetDir, 'uploads', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    for await (const entryObj of zipStream) {
      // Ép kiểu thủ công để tránh lỗi ESLint unsafe
      const entry = entryObj as {
        path: string;
        type: 'Directory' | 'File';
        vars: { uncompressedSize?: number };
        autodrain: () => void;
        pipe: (dest: NodeJS.WritableStream) => void;
      };

      const fileName = entry.path;
      const type = entry.type;

      // --- PHÒNG CHỐNG ZIP SLIP ---
      // Chuẩn hóa đường dẫn để ngăn chặn ghi đè file ngoài thư mục đích (../)
      const sanitizedPath = path.join(targetDir, fileName);
      if (!sanitizedPath.startsWith(path.resolve(targetDir))) {
        console.warn(`[ZIP SLIP DETECTED] Blocked entry: ${fileName}`);
        entry.autodrain();
        continue;
      }

      // 1. Restore Database
      // Matches 'mongo_dump.archive' created in getBackupStream
      if (fileName === 'mongo_dump.archive' && type === 'File') {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
          entry.autodrain();
          throw new InternalServerErrorException('MONGO_URI missing');
        }

        // Extract dump file to disk first
        const dumpPath = path.join(tempDir, `restore_dump_${Date.now()}.archive`);
        console.log(`Extracting ${fileName} to ${dumpPath}...`);

        await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(dumpPath);
          entry.pipe(writeStream);
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        // Check file size
        const stats = fs.statSync(dumpPath);
        console.log(`Dump file extracted. Size: ${stats.size} bytes`);

        if (stats.size === 0) {
          console.warn('Dump file is empty. Skipping restore.');
          // cleanup
          if (fs.existsSync(dumpPath)) fs.unlinkSync(dumpPath);
          continue;
        }

        // --- STEP 1: DETECT SOURCE DATABASE via dry-run ---
        let sourceDb: string | null = null;
        try {
          sourceDb = await this.detectSourceDatabase(dumpPath);
          console.log('Detected source database:', sourceDb);
        } catch (e) {
          console.warn('Failed to detect source DB from archive:', e);
        }

        // --- STEP 2: BUILD RESTORE ARGS ---

        // Resolve target DB name and create a "clean" base URI (without DB)
        // This is crucial because if --uri includes the DB, mongorestore limits scope to that DB,
        // often ignoring --nsTo or causing conflicts.
        let targetDb = '';
        let baseUri = mongoUri;

        try {
          const uriObj = new URL(mongoUri);
          targetDb = uriObj.pathname.replace(/^\//, '');

          // Remove DB from URI to allow full access for restore/renaming
          uriObj.pathname = '/';
          baseUri = uriObj.toString();
        } catch {
          // ignore
        }

        const args = [`--uri=${baseUri}`, `--archive=${dumpPath}`, '--drop', '--verbose'];

        // Apply namespace mapping if we know both source and target
        if (sourceDb && targetDb) {
          console.log(`Mapping namespace: ${sourceDb}.* -> ${targetDb}.*`);
          args.push(`--nsFrom=${sourceDb}.*`);
          args.push(`--nsTo=${targetDb}.*`);
        } else if (!sourceDb && targetDb) {
          // Fallback: try global wildcard if source is unknown (might fail with "different asterisks" error if not careful,
          // but usually this is safer to SKIP if we failed detection, relying on default behavior or --nsInclude)
          console.warn(
            'Source DB unknown. Attempting standard restore (might be filtered if names dont match).',
          );
          // We could try --nsFrom=*.* --nsTo=targetDb.* BUT that caused errors step 978.
          // Better to just let it run. If it fails due to mismatch, at least we tried detecting.
        }

        console.log('Running mongorestore with args:', args);

        const command = this.getToolCommand('mongorestore');
        const restoreProcess = spawn(command, args);

        let stderrData = '';
        restoreProcess.stderr.on('data', (data: Buffer) => {
          stderrData += data.toString();
          console.error(`Mongorestore stderr: ${data.toString()}`);
        });

        // Wait for mongorestore to finish
        // Sử dụng Promise để đảm bảo restore xong Database mới tiếp tục
        await new Promise<void>((resolve, reject) => {
          restoreProcess.on('close', code => {
            // Clean up temp file
            if (fs.existsSync(dumpPath)) fs.unlinkSync(dumpPath);

            if (code === 0) resolve();
            else reject(new Error(`mongorestore failed with code ${code}. Details: ${stderrData}`));
          });

          restoreProcess.on('error', err => {
            console.error('Mongorestore spawn error:', err);
            if (fs.existsSync(dumpPath)) fs.unlinkSync(dumpPath);
            reject(err);
          });
        });
      }
      // 2. Restore Uploads
      else if (fileName.startsWith('uploads/') && type === 'File') {
        const fullPath = sanitizedPath;
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await new Promise<void>((resolve, reject) => {
          const writeStream = fs.createWriteStream(fullPath);
          entry.pipe(writeStream);
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
      } else {
        // Drain other files
        entry.autodrain();
      }
    }
  }

  /**
   * Run mongorestore via --dryRun to peek at archive contents
   * specifically looking for "archive prelude <db>.<collection>"
   */
  private detectSourceDatabase(archivePath: string): Promise<string | null> {
    return new Promise(resolve => {
      const command = this.getToolCommand('mongorestore');
      // --dryRun does not write to DB. --verbose prints "archive prelude db.coll"
      const child = spawn(command, [`--archive=${archivePath}`, '--dryRun', '--verbose']);

      let output = '';
      child.stderr.on('data', (d: Buffer) => {
        output += d.toString();
      });
      child.stdout.on('data', (d: Buffer) => {
        output += d.toString();
      });

      child.on('close', () => {
        // Regex to find "archive prelude <db>.<collection>"
        // Example: "archive prelude phatgiao.products"
        // Avoid useless escape character warning
        const match = output.match(/archive prelude\s+([^.]+)\./);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          console.warn(
            'DryRun output did not contain expected prelude info. Full output partial:',
            output.slice(0, 500),
          );
          resolve(null);
        }
      });

      child.on('error', e => {
        console.warn('Error during dryRun detection:', e);
        resolve(null);
      });
    });
  }

  private getToolCommand(tool: string): string {
    const toolsPath = process.env.MONGO_TOOLS_PATH;
    if (toolsPath) {
      // Remove quotes if present
      const cleanPath = toolsPath.replace(/^"|"$/g, '');
      const fullPath = path.join(cleanPath, tool);
      // On Windows, append .exe if not present
      const executable =
        process.platform === 'win32' && !fullPath.endsWith('.exe') ? `${fullPath}.exe` : fullPath;

      // Verify if file exists
      if (fs.existsSync(executable)) {
        return executable;
      } else {
        console.warn(`WARNING: Tool not found at ${executable}. Falling back to system PATH.`);
      }
    }
    return tool;
  }

  private isSystemError(err: unknown): err is NodeJS.ErrnoException {
    return typeof err === 'object' && err !== null && 'code' in err;
  }
}
