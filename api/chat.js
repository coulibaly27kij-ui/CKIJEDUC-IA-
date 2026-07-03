import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { message } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API manquante sur le serveur Vercel.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Consignes pédagogiques centrées sur le programme ivoirien (APC) et les sciences
    const consigneDomaine = "Tu es l'assistant IA officiel de CKIJEDUC (Bibliothèque Numérique & IA Pédagogique en Côte d'Ivoire). Ton rôle est d'aider les élèves et les enseignants. Tu maîtrises le programme scolaire ivoirien (notamment l'Approche Par Compétences - APC), les sciences (Physique-Chimie, SVT), le soutien scolaire et la pédagogie. Réponds de manière claire, structurée, bienveillante et adaptée au niveau de l'utilisateur. Si une question sort complètement du cadre de l'éducation ou de l'école, réponds poliment que tu es uniquement programmé pour aider sur les sujets éducatifs et scolaires liés à CKIJEDUC.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: consigneDomaine,
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la génération de la réponse.' });
  }
}
