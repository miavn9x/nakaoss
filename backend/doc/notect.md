# Phân Tích Mã Nguồn Backend Project

Tài liệu này ghi lại chi tiết cấu trúc mã nguồn, các module xử lý bảo mật, tiện ích tái sử dụng và danh sách thư viện trong dự án.

## 1. Cấu Trúc Thư Mục Chính (`src`)

- **`common/`**: Chứa các mã nguồn dùng chung cho toàn bộ dự án (Utils, Guards, DTOs, Decorators...).
- **`modules/`**: Chứa các module tính năng (Auth, User, Backup, Mail, etc.).
- **`configs/`**: Cấu hình hệ thống.

### Các File Cấu Hình Khác (Root)

Ngoài thư mục `src`, dự án còn có một số file quan trọng ở thư mục gốc:

- **`google-tokens.json`** (⚠️ BẮT BUỘC): File chứa Token OAuth2 của Google.
  - **Trạng thái**: **Cần thiết cho tính năng Backup**.
  - **Chi tiết**: `src/modules/backup/services/google-drive.service.ts` đọc file này để lấy token upload file lên Google Drive. Nếu xóa, tính năng backup lên Drive sẽ lỗi (cần đăng nhập lại).
  - **Lưu ý**: File này chứa thông tin nhạy cảm (token), cần được bảo mật.

- **`tsconfig.build.json`** (⚠️ BẮT BUỘC): Cấu hình TypeScript cho việc Build Production.
  - **Trạng thái**: **Cần thiết để Build**.
  - **Chi tiết**: Lệnh `npm run build` sử dụng file này để loại bỏ các file test/spec khi biên dịch ra thư mục `dist`. Không được xóa.

---

## 2. Mã Hộ / Bảo Mật (Encryption & Security)

Các logic liên quan đến bảo mật, mã hóa mật khẩu và xác thực người dùng tập trung chủ yếu trong module `Auth`.

### 2.1. Xử Lý Mật Khẩu (Password Hashing)

- **File**: `src/modules/auth/repositories/auth.repository.ts`
- **Thư viện**: `argon2`
- **Cơ chế**:
  - **Đăng ký (`handleRegister`)**: Mật khẩu người dùng được mã hóa bằng thuật toán **Argon2** (`argon2.hash`) trước khi lưu vào database. Đây là chuẩn mã hóa mật khẩu hiện đại và an toàn hơn bcrypt.
  - **Đăng nhập (`handleLogin`)**: Mật khẩu người dùng nhập vào được so khớp với mã hash trong database bằng `argon2.verify`.

### 2.2. Xác Thực & Token (JWT)

- **File**: `src/common/jwt/services/jwt.service.ts`
- **Cơ chế**:
  - Wrap thư viện `@nestjs/jwt` để quản lý việc ký (sign) và xác thực (verify) token.
  - Tách biệt **Access Token** (hạn ngắn) và **Refresh Token** (hạn dài).
  - Thời gian hết hạn được cấu hình qua biến môi trường (`JWT_ACCESS_TOKEN_EXPIRES_IN`, `JWT_REFRESH_TOKEN_EXPIRES_IN`).

### 2.3. Quản Lý Phiên (Session Management)

- **File**: `src/modules/auth/repositories/auth.repository.ts` & `src/modules/auth/services/auth.service.ts`
- **Chi tiết**:
  - Thông tin phiên đăng nhập (User Agent, IP, Device, OS) được lưu trong bảng `AuthSession`.
  - **Giới hạn thiết bị**: Hệ thống tự động giới hạn tối đa **3 phiên đăng nhập đồng thời**. Nếu đăng nhập thiết bị thứ 4, phiên cũ nhất sẽ bị hủy (`isExpired = true`).
  - **Logout**: Đánh dấu phiên là hết hạn thay vì xóa cứng, giúp lưu vết lịch sử đăng nhập.

### 2.4. Chống Tấn Công (Rate Limiting & Captcha)

- **File**: `src/modules/auth/services/auth.service.ts` & `AuthThrottlerService`
- **Captcha**: Sử dụng `svg-captcha` để tạo mã xác nhận hình ảnh, lưu text vào Cache (Redis/Memory) với TTL 5 phút.
- **Brute-force Protection**: Tự động khóa tài khoản tạm thời nếu nhập sai mật khẩu hoặc Captcha quá nhiều lần (thông qua `AuthThrottlerService`).
- **Sudo Mode**: Yêu cầu xác thực OTP qua email cho các hành động nhạy cảm (như xóa dữ liệu, đổi mật khẩu quan trọng).

---

## 3. Mã Tái Sử Dụng (Reusable Code & Utils)

Các tiện ích được viết tách biệt trong thư mục `src/common` để dễ dàng tái sử dụng.

### 3.1. Decorators (Custom Decorators)

- **File**: `src/common/decorators/`
- **`@Roles(...roles: string[])`**: Gắn metadata về quyền hạn cho route handler. Được `RolesGuard` sử dụng để kiểm tra phân quyền.
- **`@CurrentUser()`**: Tự động lấy object `user` từ Request (đã được JWT Guard gán vào) để sử dụng trong Controller. Tiện lợi hơn việc gọi `req.user`.

### 3.2. Interceptors & Filters (Xử lý Request/Response)

- **File**: `src/common/interceptors/response.interceptor.ts`
  - **Response Interceptor**: Chuẩn hóa mọi phản hồi thành công từ API về định dạng chung `{ message, data, errorCode: null }`. Giúp Frontend xử lý dữ liệu nhất quán.
- **File**: `src/common/filters/http-exception.filter.ts`
  - **HttpException Filter**: Bắt tất cả các lỗi HTTP (kể cả lỗi validation) và trả về định dạng chuẩn `{ message, data: null, errorCode }`.

### 3.3. Tiện Ích Upload File

- **File**: `src/common/utils/upload.util.ts`
- **Chức năng**:
  - `generateUploadPath`: Tạo đường dẫn lưu file theo cấu trúc ngày tháng (`uploads/YYYY/MM/DD`).
  - `generateFileName`: Tạo tên file an toàn (slug + timestamp).
  - `generateFileMetadata`: Trích xuất metadata file.

### 3.4. Xử Lý Hình Ảnh (Image Processing)

- **File**: `src/common/utils/sharp.util.ts`
- **Chức năng**:
  - `compressImageIfNeeded`: Kiểm tra và nén ảnh nếu dung lượng > 1MB sử dụng thư viện `sharp`. Chất lượng nén mặc định 80%.

### 3.5. Xử Lý Chuỗi (String Utils)

- **File**: `src/common/utils/slugify.util.ts` & `remove-vietnamese-tones.util.ts`
- **Chức năng**:
  - Chuẩn hóa chuỗi tiếng Việt, tạo slug URL-friendly (VD: "Phật Giáo" -> "phat-giao").

---

## 4. Module Lưu Trữ & Backup (Backup System)

Logic xử lý sao lưu và phục hồi dữ liệu hệ thống.

- **File**: `src/modules/backup/services/backup.service.ts`
- **Quy trình Backup**:
  1. Sử dụng `mongodump` để dump toàn bộ dữ liệu MongoDB ra stream.
  2. Nén thư mục `uploads` (chứa file ảnh/video người dùng).
  3. Đóng gói tất cả vào một file `.zip` duy nhất (có mật khẩu hoặc không tùy cấu hình) bằng thư viện `archiver`.
- **Quy trình Restore**:
  1. Giải nén file zip.
  2. Sử dụng `mongorestore` để phục hồi dữ liệu vào DB (có cơ chế `dryRun` để phát hiện source DB và map namespace tự động).
  3. Phục hồi thư mục `uploads`.

---

## 5. Các Thư Viện Sử Dụng (Dependencies)

Sau khi phân tích `package.json` và mã nguồn, dưới đây là danh sách các thư viện chính đang được sử dụng trong dự án và vai trò của chúng:

### 5.1. Core Framework & Database
- **`@nestjs/*`**: Bộ framework chính (Core, Common, Platform Express) để xây dựng ứng dụng Server-side.
- **`mongoose` / `@nestjs/mongoose`**: Tương tác với cơ sở dữ liệu MongoDB (ODM).

### 5.2. Bảo Mật & Xác Thực (Security & Auth)
- **`argon2`**: Mã hóa mật khẩu an toàn (thay thế bcrypt).
- **`@nestjs/jwt` / `passport-jwt`**: Xử lý JSON Web Token (JWT) cho Authentication.
- **`@nestjs/passport` / `passport`**: Middleware xác thực.
- **`helmet`**: Tăng cường bảo mật bằng cách thiết lập các HTTP headers an toàn.
- **`svg-captcha`**: Tạo mã Captcha hình ảnh để chống spam/bot.
- **`@nestjs/throttler`**: Giới hạn tốc độ request (Rate Limiting) để chống Brute-force/DDoS.

### 5.3. Xử Lý Dữ Liệu & Tiện Ích (Data & Utils)
- **`class-validator` / `class-transformer`**: Xác thực (Validation) và chuyển đổi dữ liệu DTO.
- **`sharp`**: Xử lý hình ảnh (nén, resize) hiệu năng cao.
- **`axios` / `@nestjs/axios`**: Thực hiện các HTTP Request ra bên ngoài (nếu có).
- **`googleapis`**: Thư viện chính chủ của Google để làm việc với Google Drive API (Backup/Restore).
- **`archiver` / `unzipper`**: Nén và giải nén file ZIP (dùng cho Backup).
- **`nodemailer`**: Gửi email (SMTP).
- **`slugify`**: Tạo đường dẫn thân thiện (slug) từ tiêu đề.
- **`pinyin`**: Chuyển đổi ký tự tiếng Trung sang Pinyin (dùng tạo slug cho bài viết tiếng Trung).
- **`ua-parser-js`**: Phân tích thông tin trình duyệt/thiết bị từ User-Agent (dùng để quản lý thiết bị đăng nhập).

### 5.4. Khác
- **`@nestjs/schedule`**: Quản lý các tác vụ định kỳ (Cron Jobs) -> Dùng để lên lịch Auto Backup.
- **`@nestjs/cache-manager` / `cache-manager`**: Quản lý bộ nhớ đệm (Caching).
- **`compression`**: Nén Gzip cho phản hồi HTTP để tăng tốc độ tải.
