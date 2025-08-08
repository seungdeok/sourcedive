import { http, InternetServerError, NotFoundError } from "@/lib/http";
import type { PackageSize } from "@/types/package";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ package_name: string }> }) {
  try {
    const { package_name } = await params;
    const packageName = decodeURIComponent(package_name);

    if (!packageName || packageName.trim() === "") {
      return NextResponse.json({ error: "Package name is required" }, { status: 400 });
    }

    const response = await http(`https://bundlephobia.com/api/size?package=${encodeURIComponent(packageName)}`);

    const data: PackageSize = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (error instanceof InternetServerError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
