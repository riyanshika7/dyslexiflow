import { GoogleGenAI } from '@google/generative-ai';

export interface SimplifiedResponse {
  simplifiedText: string;
  syllables: { word: string; breakdown: string }[];
  socraticPrompt: string;
}

export async function simplifyText(apiKey: string, text: string): Promise<SimplifiedResponse> {
  if (!apiKey) {
    throw new Error('Google Gemini API Key is missing. Please set it in Settings.');
  }

  // Initialize the SDK with the provided API key
  const ai = new GoogleGenAI({ apiKey });
  
  // Use Gemini 1.5 Flash for sub-second latency
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert educational cognitive specialist assisting K-12 students with dyslexia and ADHD.
Analyze the following text paragraph and respond with a JSON object.

Text to analyze:
"${text}"

Your response must strictly match the following JSON schema:
{
  "simplifiedText": "The text re-written in simple, direct, active-voice plain English. Avoid complex idioms, long compound sentences, or dense jargon. Keep it to the same length or shorter.",
  "syllables": [
    { "word": "original complex word", "breakdown": "the-word-split-into-syllables-separated-by-hyphens" }
  ],
  "socraticPrompt": "A single, encouraging, Socratic open-ended question that prompts the student to reflect on or demonstrate comprehension of the core concept in the paragraph. Do not quiz on trivial details."
}

Notes:
1. Provide exactly 2 or 3 words in the "syllables" array. Choose the most complex or long words.
2. Return ONLY the JSON object. Do not include markdown code block styling like \`\`\`json.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean up potential markdown formatting if the model didn't follow the instructions exactly
    const cleanJSON = responseText
      .replace(/^```json/i, '')
      .replace(/```$/, '')
      .trim();

    return JSON.parse(cleanJSON) as SimplifiedResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to connect to Gemini API.');
  }
}

export async function evaluateSocraticAnswer(
  apiKey: string,
  question: string,
  originalText: string,
  userAnswer: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('Google Gemini API Key is missing.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an encouraging educational coach. Evaluate a student's answer to a Socratic question based on a paragraph of text they just read.
Be supportive, positive, and offer constructive feedback in 2-3 short sentences. Never be harsh or discouraging. 
If they did well, validate why they are correct. If they are partially correct or incorrect, guide them back to the key details.

Details:
Paragraph: "${originalText}"
Socratic Question: "${question}"
Student's Answer: "${userAnswer}"

Write your brief feedback response in plain, direct text (no markdown formatting).
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error calling Gemini API for evaluation:', error);
    throw new Error('Failed to connect to Gemini API for evaluation.');
  }
}
