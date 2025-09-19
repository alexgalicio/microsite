import { createOpenAI } from "@ai-sdk/openai";
import { embed, streamText } from "ai";
import { type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
);

async function generateEmbedding(message: string) {
  return embed({
    model: openai.embedding("text-embedding-3-small"),
    value: message,
  });
}

async function fetchRelevantContext(embedding: number[]) {
  const { data, error } = await supabase.rpc("get_relevant_chunks", {
    query_vector: embedding,
    match_threshold: 0.5,
    match_count: 3,
  });

  console.log("data", data);

  if (error) throw error;

  return JSON.stringify(
    data.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => `
        Source: ${item.url}
        Content: ${item.content}
        `
    )
  );
}

function createPrompt(context: string, userQuestion: string) {
  return {
    role: "system",
    content: `
      You are Foxy, a friendly and knowledgeable assistant for the College
      of Information and Communitcations Technology.
      
      Your responses should be helpful and accurate, drawing from the context provided.
      Always include relevant URLs from the context when available.

      Use the provided context as your primary source. 
      If you find related information that might answer the question, mention it.
      Only say you don't know if there's truly no relevant information in the context.
      Don't repeat yourself unnecessarily.
      ----------------
      START CONTEXT
      ${context}
      END CONTEXT
      ----------------
      
      Return the answer in markdown format including relevant links.
      
      ----------------
      QUESTION: ${userQuestion}
      ----------------`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages.at(-1).content;

    const { embedding } = await generateEmbedding(latestMessage);
    const context = await fetchRelevantContext(embedding);
    const prompt = createPrompt(context, latestMessage);
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [prompt, ...messages],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log("Error generating response: " + error);
    throw error;
  }
}
