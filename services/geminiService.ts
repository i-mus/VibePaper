
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateWallpapers(prompt: string, aspectRatio: AspectRatio): Promise<string[]> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 4,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("No images were generated.");
        }

        return response.generatedImages.map(img => {
            const base64ImageBytes: string = img.image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        });

    } catch (error) {
        console.error("Error generating wallpapers:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate images: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
}
