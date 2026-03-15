
// src/ai/flows/generate-high-quality-prompt.ts
'use server';
/**
 * @fileOverview Converts a simple user idea into a high-quality, structured AI prompt.
 *
 * - generateHighQualityPrompt - The main function to convert user ideas to AI prompts.
 * - GenerateHighQualityPromptInput - The input type for the generateHighQualityPrompt function.
 * - GenerateHighQualityPromptOutput - The output type for the generateHighQualityPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHighQualityPromptInputSchema = z.object({
  idea: z.string().describe('The user input idea.'),
  promptType: z.string().describe('The type of prompt to generate (e.g., content writing, YouTube script, ad copy).'),
  qualityLevel: z.enum(['Basic', 'Advanced', 'Expert']).describe('The desired quality level of the prompt.'),
});

export type GenerateHighQualityPromptInput = z.infer<typeof GenerateHighQualityPromptInputSchema>;

const GenerateHighQualityPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated high-quality AI prompt.'),
});

export type GenerateHighQualityPromptOutput = z.infer<typeof GenerateHighQualityPromptOutputSchema>;

export async function generateHighQualityPrompt(input: GenerateHighQualityPromptInput): Promise<GenerateHighQualityPromptOutput> {
  return generateHighQualityPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHighQualityPromptPrompt',
  input: {schema: GenerateHighQualityPromptInputSchema},
  output: {schema: GenerateHighQualityPromptOutputSchema},
  prompt: `You are a senior AI prompt engineer. Convert the user's casual idea into a professional, high-performing AI prompt. Add role, context, constraints, tone, format, and clarity. Do NOT remove user intent.

Here's the user's idea: {{{idea}}}

Prompt Type: {{{promptType}}}
Quality Level: {{{qualityLevel}}}


Output the prompt.`, 
});

const generateHighQualityPromptFlow = ai.defineFlow(
  {
    name: 'generateHighQualityPromptFlow',
    inputSchema: GenerateHighQualityPromptInputSchema,
    outputSchema: GenerateHighQualityPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
