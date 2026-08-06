import "server-only";

import OpenAI from "openai";

function getOpenAIApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  return apiKey;
}

export const openai = new OpenAI({
  apiKey: getOpenAIApiKey(),
});
