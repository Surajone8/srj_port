import { NextRequest, NextResponse } from "next/server";
import { ContactFormData, ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // In production, integrate Resend, Postmark, or SendGrid here
    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Message received successfully." },
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
