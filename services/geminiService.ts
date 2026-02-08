
import { GoogleGenAI, Type } from "@google/genai";

export const getSecurityTip = async (): Promise<{ title: string; content: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma dica de segurança curta e única para proteger contas de e-mail. Retorne um objeto JSON com os campos 'title' (título) e 'content' (conteúdo) em português brasileiro.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Error fetching Gemini tip:", error);
    return {
      title: "Lembrete de Segurança",
      content: "Use senhas exclusivas para cada conta e habilite a Autenticação de Dois Fatores (2FA) sempre que possível."
    };
  }
};
