import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Updated model name

export async function POST(req) {
  try {
    const { prompt, messageHistory, caseDetails } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let fullPrompt = `The user asked: "${prompt}". `;
    if (messageHistory && messageHistory.length > 0) {
      const recentMessages = messageHistory
        .slice(-5)
        .map((msg) => `${msg.senderRole}: ${msg.message}`)
        .join('\n');
      fullPrompt += `Here's the recent conversation history:\n${recentMessages}\n`;
    }
    if (caseDetails) {
      fullPrompt += `Here are some details about the case: ${JSON.stringify(caseDetails)}. `;
    }
    fullPrompt += `Respond in a helpful and informative way.`;

    const result = await model.generateContent([fullPrompt]);
    const geminiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(JSON.stringify({ response: geminiResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response from Gemini' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
