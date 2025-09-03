import { embed, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
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
    match_count: 10,
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

// system message template
function createPrompt(context: string, userQuestion: string) {
  return {
    role: "system",
    content: `
      You are Foxy, a helpful assistant for College of Information and Communications Technology (CICT).
      Use the following context to answer questions: 
      ----------------
      START CONTEXT
      ${context}
      END CONTEXT
      ----------------
      
      Return the answer in markdown format including relevant links.
      Where the above context does not provide enough information relating to the question provide an answer based on your own knowledge but caveat it so the user
      knows that it may not be up to date.
      
      ----------------
      QUESTION: ${userQuestion}
      ----------------`,
  };
}

export async function POST(req: Request) {
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
