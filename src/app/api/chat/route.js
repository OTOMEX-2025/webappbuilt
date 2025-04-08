import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return new Response(JSON.stringify({ message: 'Message is required' }), { status: 400 });
    }

    const allowedTopics = ["stress", "anxiety", "depression", "mental health", "therapy", "self-care"];
    const messageLower = message.toLowerCase();

    const isRelevant = allowedTopics.some((topic) => messageLower.includes(topic)) ||
                       messageLower.includes("cope") ||
                       messageLower.includes("help") ||
                       messageLower.includes("feeling") ||
                       messageLower.includes("manage");

    if (!isRelevant) {
      return new Response(
        JSON.stringify({
          response: "Hey there! 👋 This chatbot is focused on mental health support, including stress, anxiety, depression, and self-care. Please ask questions related to those topics 💚"
        }),
        { status: 200 }
      );
    }

    // GPT-3.5 response
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o',  // Using gpt-3.5-turbo
      messages: [
        {
          role: 'system',
          content: 'You are a supportive mental health assistant. Answer with empathy, clarity, and helpful advice. Avoid medical diagnoses.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
    });

    const gptText = gptResponse.choices?.[0]?.message?.content || '';

    // Gemini response
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const geminiResult = await geminiModel.generateContent({ contents: [{ role: 'user', parts: [{ text: message }] }] });
    const geminiText = geminiResult.response?.text() || '';

    // Choose best or combine
    let finalResponse = gptText;

    if (geminiText.length > gptText.length + 100) {
      finalResponse = geminiText;
    } else if (geminiText && gptText) {
      finalResponse = `${gptText}\n\n---\n\nAdditional thoughts:\n${geminiText}`;
    }

    return new Response(
      JSON.stringify({ response: finalResponse }),  // Clean output without extra metadata
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Mental Health API Error:', error);
    if (error.code === 'insufficient_quota') {
      return new Response(
        JSON.stringify({
          message: 'You have exceeded your API quota. Please try again later.',
          error: error.message,
        }),
        { status: 429 }
      );
    }
    return new Response(
      JSON.stringify({
        message: 'Something went wrong. Please try again later.',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
