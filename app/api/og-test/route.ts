import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_PORTFOLIO_URL
    : "http://localhost:3000";

  // Test the Open Graph image URLs
  const imageUrl = `${baseUrl}/charles_big.png`;

  try {
    const imageResponse = await fetch(imageUrl, { method: "HEAD" });
    const imageAccessible = imageResponse.ok;

    return NextResponse.json({
      success: true,
      baseUrl,
      imageUrl,
      imageAccessible,
      imageStatus: imageResponse.status,
      ogTags: {
        title: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
        description:
          "React & Next.js specialist building high-performance apps with AWS cloud integration. Hire Charles Adu Tetteh for modern software development needs. Available for hire globally.",
        image: imageUrl,
        url: baseUrl,
        siteName: "Charles Adu Tetteh Portfolio",
        type: "website",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test image accessibility",
        baseUrl,
        imageUrl,
      },
      { status: 500 }
    );
  }
}
