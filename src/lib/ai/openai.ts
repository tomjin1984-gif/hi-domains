import "server-only";

import OpenAI from "openai";

function getOpenAIApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return apiKey;
}

// Initialize only when analysis is requested so other workspaces do not require AI credentials.
let client: OpenAI | undefined;
export function getOpenAI() {
  client ??= new OpenAI({ apiKey: getOpenAIApiKey() });
  return client;
}
