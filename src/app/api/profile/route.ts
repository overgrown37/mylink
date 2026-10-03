import { NextResponse } from "next/server";
import mockApiResponse from "@/data/mockApiResponse.json";

export async function GET() {
  return NextResponse.json(mockApiResponse, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
