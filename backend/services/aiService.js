import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const AI_API_KEY = process.env.AI_API_KEY;
const model = 'microsoft/DialoGPT-medium';

export async function getAIResponse(prompt) {
   try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // optional, in case the model takes time
            }
        );

        // Hugging Face returns an array with generated_text
        if (response.data && response.data[0] && response.data[0].generated_text) {
            return response.data[0].generated_text;
        } else {
            return "No response from AI.";
        }
    } catch (err) {
        console.error('AI API Error:', err.message);
        throw new Error('Failed to get AI response');
    }
}