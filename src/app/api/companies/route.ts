import { NextResponse } from "next/server"; // Import Next.js Response object for API responses
import companies from "./companies.json";

export async function GET() {
  try {
    // Simulate a potential error scenario (e.g., if the data fails to load)
    if (!companies) {
      throw new Error("Data not found");
    }

    return NextResponse.json(companies);
  } catch (error) {
    // Return an error response with a status code of 500
    return NextResponse.json({ message: "Error fetching data", error }, { status: 200 });
  }
}
