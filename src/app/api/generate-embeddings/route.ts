import { createEmbedding } from "@/lib/actions/create-embeddings";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // get data from request
    const formData = await req.formData();

    // get file path that was sent in the form data
    const filePath = formData.get("mediaPath") as string;

    if (!filePath) {
      return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }
    
    // generate embeddings for the file content
    const embedding = await createEmbedding(filePath);
    return NextResponse.json({ success: true, embedding });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
