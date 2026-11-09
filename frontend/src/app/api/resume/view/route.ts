
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001/api/v1";

    // Get the currently active resume from NestJS.
    const resumeResponse = await fetch(`${apiUrl}/resume/public`, {
      cache: "no-store",
    });

    if (!resumeResponse.ok) {
      return NextResponse.json(
        { message: "No active resume is available." },
        { status: resumeResponse.status },
      );
    }

    const resume = await resumeResponse.json();

    if (!resume.fileUrl) {
      return NextResponse.json(
        { message: "Resume PDF URL is missing." },
        { status: 404 },
      );
    }

    // Only allow files hosted on Cloudinary.
    const fileUrl = new URL(resume.fileUrl);

    if (fileUrl.hostname !== "res.cloudinary.com") {
      return NextResponse.json(
        { message: "Invalid resume file URL." },
        { status: 400 },
      );
    }

    // Fetch the actual PDF.
    const pdfResponse = await fetch(fileUrl.toString(), {
      cache: "no-store",
    });

    if (!pdfResponse.ok) {
      return NextResponse.json(
        { message: "Unable to load the resume PDF." },
        { status: 502 },
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Taha-Siddique-Resume.pdf"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong while opening the resume." },
      { status: 500 },
    );
  }
}
