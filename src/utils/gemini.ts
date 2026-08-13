import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AssistPayload } from "../types";

/**
 * Standardized model string matching the project spec and README.
 */
const GEMINI_MODEL = "gemini-3.6-flash";

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
 * Helper to enforce the 2-sentence constraint programmatically.
 */
function limitToTwoSentences(text: string): string {
  const trimmed = text.trim();
  // Match sentence endings (. ! ?) while preserving text structure
  const sentences = trimmed.match(/[^.!?]+[.!?]+/g);

  if (!sentences || sentences.length <= 2) {
    return trimmed;
  }

  return sentences.slice(0, 2).join(" ").trim();
}

/**
 * Helper to identify if a string is gibberish or non-linguistic noise.
 */
function isLikelyGibberish(text: string): boolean {
  const trimmed = text.trim().toLowerCase();
  
  // Single characters, punctuation only, or non-alphanumeric strings
  if (trimmed.length <= 1 || /^[^a-zA-Z0-9]+$/.test(trimmed)) {
    return true;
  }

  // Keyboard smashes / repeating consecutive characters (e.g., "aaaaa")
  if (/(.)\1{3,}/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Gemini Cognitive Assistance Engine
 */
export async function getCognitiveAssistance(
  paragraphText: string,
  apiKey: string
): Promise<AssistPayload> {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("Missing Gemini API Key. Please configure it in your settings or .env file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You are a supportive, warm cognitive reading assistant for K-12 students with ADHD and dyslexia.
Analyze the following paragraph and provide structural reading assistance in STRICT JSON format matching this structure:
{
  "simplifiedText": "The paragraph rewritten in plain English. Do not shorten it too much; instead, elaborate the paragraph's core concepts in detail using simple, friendly, and non-fatiguing words (K-12 vocabulary) to ensure complete understanding. Stay faithful to the paragraph and do not introduce new facts.",
  "syllabifiedWords": [
    { "original": "complexWord", "syllables": "com-plex-word" }
  ],
  "socraticQuestion": "A friendly, simple comprehension question."
}

Rules & Instruction Pacing:
1. "syllabifiedWords": Select 2-4 words with high structural complexity (>3 syllables) and break them into phonetic syllables (e.g. "communication" -> "com-mu-ni-ca-tion").
2. "socraticQuestion": Craft a direct, K-12 friendly check-in question. Keep it under 15 words and easy to answer in a short sentence or phrase. Avoid dense academic phrasing.
3. DO NOT return markdown wrappers (no \`\`\`json). Return raw JSON only.

Paragraph:
"${paragraphText}"
`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanedText = cleanJsonResponse(rawText);

    const parsedData: AssistPayload = JSON.parse(cleanedText);
    return parsedData;
  } catch (error) {
    console.error("Error generating Gemini cognitive assistance:", error);
    throw error;
  }
}

/**
 * Socratic Answer Evaluator with Edge-Case Safeguards
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

  const trimmed = studentAnswer.trim().toLowerCase();

  // Safeguard 1: Empty or single punctuation
  if (!trimmed || trimmed === "." || trimmed === "?" || trimmed === "!") {
    return "Give it a quick try! Please read the paragraph again and share what you think.";
  }

  // Safeguard 2: Direct non-answers
  const nonAnswerTriggers = ["idk", "i dont know", "i don't know", "no", "pass", "nothing", "dunno"];
  if (nonAnswerTriggers.includes(trimmed)) {
    return "No worries at all, reading takes practice! Please read the paragraph again and look for key details.";
  }

  // Safeguard 3: Keyboard noise or repeating gibberish (Regex fixed: 0-9)
  if (isLikelyGibberish(trimmed)) {
    return "That looks a bit like random letters! Please read the paragraph again and type your best answer.";
  }

  // AI Evaluation for meaningful inputs
  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const prompt = `
You are an encouraging tutor checking a K-12 student's reading comprehension.
Original Text: "${originalText}"
Socratic Question: "${question}"
Student's Answer: "${studentAnswer}"

Rules & Safeguards:
1. IF THE STUDENT'S ANSWER IS NONSENSE, GIBBERISH, OR UNRELATED KEYBOARD TYPING:
   - Politely invite them to refocus on the main idea.
   - EXPLICITLY state: "Please read the paragraph again."
2. IF THE ANSWER IS INCORRECT, WRONG, OR INCOMPLETE:
   - Provide encouraging, supportive feedback explaining why they missed the mark without scolding them.
   - EXPLICITLY state: "Please read the paragraph again."
3. IF THE ANSWER IS CORRECT OR SHOWS GOOD UNDERSTANDING:
   - Provide warm, positive feedback validating their comprehension.
4. CRITICAL CONSTRAINT: Your entire response MUST BE EXACTLY 2 SENTENCES long. No more, no less.
`;

  try {
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();
    
    // Programmatic enforcement of 2-sentence maximum
    return limitToTwoSentences(rawResponse);
  } catch (error) {
    console.error("Error evaluating Socratic answer:", error);
    return "I couldn't contact the evaluation helper right now. Please read the paragraph again.";
  }
}