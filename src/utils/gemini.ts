import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AssistPayload } from "../types";

/**
 * Clean Utility:
 * Safely removes markdown code block fences (e.g. ```json ... ```) 
 * if Gemini includes them in the raw string output.
 */
function cleanJsonResponse(text: string): string {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * Gemini Cognitive Assistance Engine
 * 
 * WHAT IT DOES:
 * Takes a paragraph that a reader is struggling with and uses Gemini Flash
 * to scaffold learning for neurodivergent students (ADHD/Dyslexia).
 * 
 * HOW IT WORKS:
 * 1. Sends the text to Gemini with a strict JSON system prompt.
 * 2. Asks for a Plain English translation (reduces syntactic fatigue).
 * 3. Identifies complex words (>3 syllables) and breaks them phonetically.
 * 4. Asks a Socratic comprehension check question to encourage active recall.
 */
export async function getCognitiveAssistance(
  paragraphText: string,
  apiKey: string
): Promise<AssistPayload> {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("Missing Gemini API Key. Please configure it in your settings or .env file.");
  }

  // Initialize the Gemini SDK with the student's or env API key
  const genAI = new GoogleGenerativeAI(apiKey.trim());

  // Using low-latency Flash model optimized for quick UI feedback
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    generationConfig: {
      responseMimeType: "application/json", // Enforce pure JSON response
    },
  });

  const prompt = `
You are a cognitive reading assistant for K-12 students with ADHD and dyslexia.
Analyze the following paragraph and provide structural reading assistance in STRICT JSON format matching this structure:
{
  "simplifiedText": "The paragraph rewritten in plain English. Do not shorten it too much; instead, elaborate the paragraph's core concepts in detail using simple, friendly, and non-fatiguing words (K-12 vocabulary) to ensure complete understanding. Stay faithful to the paragraph and do not introduce new facts.",
  "syllabifiedWords": [
    { "original": "complexWord", "syllables": "com-plex-word" }
  ],
  "socraticQuestion": "A quick Socratic comprehension check question to verify retention."
}

Rules:
1. "syllabifiedWords": Select 2-4 words with high structural complexity (>3 syllables) and break them into phonetic syllables (e.g. "communication" -> "com-mu-ni-ca-tion").
2. DO NOT return markdown wrappers (no \`\`\`json). Return raw JSON only.

Paragraph:
"${paragraphText}"
`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanedText = cleanJsonResponse(rawText);

    // Parse into our strict TypeScript AssistPayload contract
    const parsedData: AssistPayload = JSON.parse(cleanedText);
    return parsedData;
  } catch (error) {
    console.error("Error generating Gemini cognitive assistance:", error);
    throw error;
  }
}

/**
 * Socratic Answer Evaluator
 * 
 * WHAT IT DOES:
 * Evaluates the student's answer to the Socratic question and returns short, 
 * encouraging feedback.
 * 
 * CONSTRAINT:
 * Strictly limited to 2 sentences to prevent cognitive overload.
 */
export async function evaluateSocraticAnswer(
  originalText: string,
  question: string,
  studentAnswer: string,
  apiKey: string
): Promise<string> {
  if (!apiKey || apiKey.trim() === "") {
    return "Great effort! Keep reading closely.";
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `
You are an encouraging tutor checking a K-12 student's reading comprehension.
Original Text: "${originalText}"
Socratic Question: "${question}"
Student's Answer: "${studentAnswer}"

Rules:
1. Determine if the student's answer is correct or not based on the original text.
2. If the student's answer is incorrect, wrong, incomplete, or demonstrates a misunderstanding:
   - Provide encouraging, supportive feedback explaining why they are wrong, AND
   - EXPLICITLY state: "Please read the paragraph again."
3. If the student's answer is correct, provide warm feedback validating their understanding.
4. CRITICAL CONSTRAINT: Your entire response MUST BE EXACTLY 2 SENTENCES long. No more, no less.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error evaluating Socratic answer:", error);
    return "I couldn't contact the evaluation helper right now. Please review the paragraph again to verify your answer!";
  }
}