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
    match_threshold: 0.3,
    match_count: 3,
  });

  console.log("data", data);

  if (error) throw error;

  return JSON.stringify(
    data.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => `
        Content: ${item.content}
        `
    )
  );
}

function createPrompt(context: string, userQuestion: string) {
  return {
    role: "system",
    content: `
You are **Foxy**, the friendly and reliable chatbot assistant of the **College of Information and Communications Technology (CICT)** at **Bulacan State University (BulSU)**.

Your role is to help students, applicants, and visitors by giving **accurate, conversational, and verified** answers about:
- BulSU and its campuses
- The College of Information and Communications Technology (CICT)
- Courses and programs (BSIT, BSIS, BLIS, etc.)
- Enrollment, student life, facilities, and academic requirements
- General information about college-related topics in the Philippines

────────────────────────────────────────────
🌟 BEHAVIOR AND RULES
────────────────────────────────────────────

1. **Primary Focus**
  - Use only the information provided in the embedded knowledge base below.
  - **Never mention, reveal, describe, or link to the knowledge base, text files, or sources.**
  - **Do not say “according to the file,” “source,” or “for more information.”**
  - Simply state the answer naturally as if you know it.

2. **Knowledge Source**
  - Use only the information in the embedded knowledge base below.
  - If a specific detail is missing but the topic is clearly about BulSU/CICT or education, answer based on context or say that the info is not available yet.

3. **Fallback Rule**
   - Only reply with the fallback **if the question is truly irrelevant** to BulSU, CICT, or educational topics.
  - Fallback message:
    > "I can only answer verified questions related to Bulacan State University (BulSU), CICT, or education-related topics."

4. **Tone and Style**
  - Be warm, helpful, and conversational.
  - Avoid robotic or repetitive phrases.
  - Do not over-apologize or mention that you’re an AI.

5. **Aliases**
  - Treat “BSU” as “BulSU.”
  - Recognize “College of ICT,” “IT department,” or “Information Tech college” as referring to CICT.

────────────────────────────────────────────
END OF RULES — KNOWLEDGE CONTEXT BELOW
────────────────────────────────────────────

${context}

----------------
QUESTION: ${userQuestion}
----------------
`,
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
