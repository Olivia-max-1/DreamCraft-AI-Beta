import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if the key exists to avoid runtime crashes before key selection
// However, the prompt says process.env.API_KEY is pre-configured.
// We will create a fresh instance per call to ensure we pick up any changes if the environment were to change (though typically static).
// Using a singleton or factory is fine.

const getAIClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const SYSTEM_INSTRUCTION = `
You are DreamCraft AI, an expert AI Full-Stack Developer and UI/UX Designer.
Your task is to generate complete, single-file HTML solutions that are ready to run.

RULES:
1. Output ONLY valid HTML code. Do not include markdown backticks (e.g., \`\`\`html) or descriptions outside the code.
2. The code MUST include all necessary CSS (using Tailwind CSS via CDN) and JavaScript (vanilla) within the single file.
3. Use FontAwesome for icons: <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
4. Use Tailwind CSS for styling: <script src="https://cdn.tailwindcss.com"></script>
5. Use Google Fonts (Inter): <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
6. The design must be modern, clean, responsive, and visually stunning (Mobile-First).
7. Ensure interactive elements (buttons, forms, toggles) have functional JavaScript attached (e.g., event listeners).
8. Do NOT use external CSS/JS files. Embed everything in <style> and <script> tags.
9. If modifying existing code, retain the existing structure/logic unless explicitly asked to refactor, but ensure the new features are integrated seamlessly.
10. Use high-quality placeholder images from https://picsum.photos/WIDTH/HEIGHT if needed.

When the user asks for a change, analyze the previous code (if provided) and output the FULL updated HTML file.
`;

export const generateAppCode = async (prompt: string, currentCode?: string): Promise<string> => {
    try {
        const ai = getAIClient();
        const model = 'gemini-2.5-flash'; // Fast and capable for code generation

        let fullPrompt = `User Request: ${prompt}`;
        
        if (currentCode) {
            fullPrompt += `\n\nExisting Code:\n${currentCode}\n\nTask: Update the Existing Code based on the User Request. Return the full updated HTML.`;
        } else {
            fullPrompt += `\n\nTask: Create a new single-file HTML application based on the User Request.`;
        }

        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.5, // Balance creativity and precision
            }
        });

        let text = response.text || '';
        
        // Cleanup markdown if the model hallucinates it despite instructions
        text = text.replace(/^```html/, '').replace(/^```/, '').replace(/```$/, '');
        
        return text.trim();

    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
};

export const explainCode = async (code: string, query: string): Promise<string> => {
     try {
        const ai = getAIClient();
        const model = 'gemini-2.5-flash';

        const prompt = `
        Code Context:
        ${code.substring(0, 5000)}... (truncated if too long)

        User Question: ${query}

        Provide a concise, helpful explanation or answer.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
             config: {
                systemInstruction: "You are a helpful coding assistant. Explain technical concepts simply.",
            }
        });

        return response.text || "I couldn't generate an explanation at this time.";
    } catch (error) {
        console.error("Gemini Explanation Error:", error);
        return "An error occurred while analyzing the code.";
    }
}