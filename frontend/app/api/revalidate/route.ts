import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    const tag = request.nextUrl.searchParams.get("tag");

    // 1. Security Check
    // If REVALIDATION_SECRET is not set in env, disable this feature for security
    const envSecret = process.env.REVALIDATION_SECRET;

    if (!envSecret) {
      return NextResponse.json(
        { message: "Revalidation secret not configured" },
        { status: 500 },
      );
    }

    if (secret !== envSecret) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // 2. Validate Tag
    if (!tag) {
      return NextResponse.json(
        { message: "Missing tag parameter" },
        { status: 400 },
      );
    }

    // 3. Revalidate
    (revalidateTag as any)(tag);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error revalidating" },
      { status: 500 },
    );
  }
}
