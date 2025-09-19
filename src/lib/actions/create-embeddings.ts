import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { embed } from "ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { execSync } from "child_process";
import fs from "fs";
import mammoth from "mammoth";
import os from "os";
import path from "path";
import PdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import * as XLSX from "xlsx";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(filePath: string) {
  const { data, error } = await supabase.storage
    .from("media")
    .download(filePath);
  if (error || !data) throw new Error("Failed to download file");

  // get public url of the file
  const { data: urlData } = supabase.storage
    .from("media")
    .getPublicUrl(filePath);

  const fileUrl = urlData.publicUrl;

  // extract text from the file
  const text = await extractTextFromFile(data, filePath);

  // split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", ".", "!", "?", " ", ""],
  });

  const chunks = await splitter.splitText(text);

  // generate embeddings for each chunk
  const chunksWithEmbeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: chunk,
      });

      return { embedding, content: chunk };
    })
  );

  // store in db
  const { error: insertError } = await supabase.from("chunks").insert(
    chunksWithEmbeddings.map(({ content, embedding }) => ({
      filename: filePath,
      content: content,
      vector: embedding,
      url: fileUrl,
    }))
  );

  if (insertError) {
    console.error("Error inserting embeddings:", insertError);
    throw new Error("Failed to save embeddings");
  }

  return chunksWithEmbeddings;
}

async function extractTextFromFile(
  fileData: Blob,
  filePath: string
): Promise<string> {
  const fileExtension = path.extname(filePath).toLowerCase();
  const tempFilePath = path.join(os.tmpdir(), `temp_file${fileExtension}`);

  console.log(`Temp file path: ${tempFilePath}`);

  // write the blob to a temporary file
  try {
    await fs.promises.writeFile(
      tempFilePath,
      Buffer.from(await fileData.arrayBuffer())
    );
    console.log("File written successfully.");
  } catch (err) {
    console.error("Error writing file:", err);
    throw new Error("Failed to write temporary file.");
  }

  // check if file exists
  const fileExists = fs.existsSync(tempFilePath);
  if (!fileExists) {
    console.error("Temp file was not created.");
    throw new Error("File was not created successfully.");
  }

  console.log("File exists:", fileExists);

  try {
    switch (fileExtension) {
      case ".pdf":
        return await extractTextFromPDF(tempFilePath);
      case ".docx":
        return await extractTextFromDOCX(tempFilePath);
      case ".xlsx":
        return extractTextFromXLSX(tempFilePath);
      case ".txt":
        console.log("Reading .txt file...");
        const textContent = await fs.promises.readFile(tempFilePath, "utf-8");
        console.log("Extracted text:", textContent);
        return textContent;
      default:
        throw new Error("Unsupported file type");
    }
  } catch (err) {
    console.error("Error extracting text:", err);
    throw new Error("Failed to extract text.");
  } finally {
    // clean up the temp file
    try {
      await fs.promises.unlink(tempFilePath);
      console.log("Temp file deleted.");
    } catch (err) {
      console.error("Error deleting temp file:", err);
    }
  }
}

//function to clean up the text
const cleanText = (text: string) => {
  return text
    .replace(/\x00/g, "") // remove null bytes
    .replace(/[^\x20-\x7E\n]/g, ""); // remove non-ascii characters
};

// extract the text from pdf
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    console.log("Trying pdf-parse...");
    const dataBuffer = await fs.promises.readFile(filePath);
    const data = await PdfParse(dataBuffer);

    const text = data.text.replace(/\uFFFD/g, "").trim(); // remove invalid characters

    if (text && text.length > 20) {
      console.log("Extracted text successfully using pdf-parse.");
      return cleanText(text);
    }

    throw new Error("Extracted text is empty or invalid.");
  } catch (error) {
    console.warn("pdf-parse failed:", error);
  }

  // fallback using pdftotext
  try {
    console.log("Trying pdftotext...");
    const extractedText = execSync(`pdftotext -layout "${filePath}" -`, {
      encoding: "utf-8",
    }).trim();
    if (extractedText.length > 20) {
      console.log("Extracted text successfully using pdftotext.");
      return extractedText;
    }

    throw new Error("pdftotext extraction returned empty text.");
  } catch (error) {
    console.warn("pdftotext failed:", error);
  }

  // final fallback - OCR with Tesseract.js (for scanned pdfs)
  try {
    console.log("Trying OCR (Tesseract.js)...");
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    });

    if (text.length > 20) {
      console.log("Extracted text successfully using OCR.");
      return text;
    }

    throw new Error("OCR extraction returned empty text.");
  } catch (error) {
    console.error("OCR extraction failed:", error);
  }

  throw new Error("Failed to extract text from PDF using all methods.");
}

//extract text from docx files
async function extractTextFromDOCX(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to extract text from DOCX");
  }
}

//extract text from xlsx files
function extractTextFromXLSX(filePath: string): string {
  try {
    const workbook = XLSX.readFile(filePath);
    let text = "";
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      text += XLSX.utils.sheet_to_csv(sheet) + "\n\n";
    });
    return text;
  } catch (error) {
    console.error("Error parsing XLSX:", error);
    throw new Error("Failed to extract text from XLSX");
  }
}
