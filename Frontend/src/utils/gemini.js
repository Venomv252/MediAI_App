import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPTS = {
  SYMPTOM_CHECKER: `You are an expert AI Doctor. Your task is to diagnose the user's condition. 
1. The user will specify a body part they clicked on or a symptom they are experiencing.
2. Formulate exactly ONE relevant follow-up question at a time to narrow down the diagnosis. Do NOT act as a form.
3. Be reassuring, professional, and empathetic, adopting a light "doctor" persona. 
4. After asking enough questions (usually 2-4), provide a highly accurate prediction (approx 95% accuracy based on their symptoms), tell them the likely disease or condition, and always advise them to seek an in-person medical professional for confirmation.`,
  
  MEDICINE_CHECKER: `You are an AI Pharmacist. The user will provide you with a medicine name or an image text. 
1. Describe what this medicine is used for.
2. List common side effects.
3. Provide general advice for taking it.
Always maintain a serious, professional tone and advise them to consult a doctor.`,
  
  MENTAL_HEALTH: `You are Dr. Serene, an empathetic, non-judgmental AI therapist and mental health counselor. 
1. The user will share their feelings, stress, or mental health concerns.
2. Provide a safe space, validate their feelings, and offer practical, structured coping strategies.
3. Keep your responses concise and supportive. 
4. Always remind them that you are an AI, and if they are in crisis, they should contact emergency services.`,
};

export const createDoctorSession = async (promptType = "SYMPTOM_CHECKER") => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", 
    systemInstruction: SYSTEM_PROMPTS[promptType],
  });

  const chat = model.startChat({
    history: [],
  });

  return chat;
};

export const analyzeMedicine = async (text, file) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `You are an AI Pharmacist. Analyze the provided medicine (by name or image). 
Return a JSON object exactly, with exactly these keys: 
"medicineName", "genericName", "uses", "dosage", "sideEffects", "warnings".
Do not wrap in markdown or backticks.`;

  const parts = [prompt];
  
  if (text) parts.push(`Medicine Name or description: ${text}`);
  
  if (file) {
    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    parts.push({
      inlineData: { data: base64Data, mimeType: file.type }
    });
  }

  const result = await model.generateContent(parts);
  const responseText = result.response.text();
  
  try {
    // Attempt to clean markdown json formatting if present
    const cleanedText = responseText.replace(/```json/i, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch(e) {
    console.error("Failed to parse JSON:", responseText);
    return { error: "Failed to parse medicine data." };
  }
};
