
'use server';
/**
 * @fileOverview Refines a user's idea into a high-quality AI prompt by intelligently applying constraints, tone, and context.
 *
 * - refinePrompt - A function that refines the prompt.
 * - RefinePromptInput - The input type for the refinePrompt function.
 * - RefinePromptOutput - The return type for the refinePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefinePromptInputSchema = z.object({
  idea: z
    .string()
    .describe('The user input idea.'),
  promptType: z.string().describe('The type of prompt to generate (e.g., content writing, YouTube script, ad copy).'),
  qualityLevel: z.string().describe('The desired quality level of the prompt (Basic, Advanced, Expert).'),
});
export type RefinePromptInput = z.infer<typeof RefinePromptInputSchema>;

const RefinePromptOutputSchema = z.object({
  refinedPrompt: z.string().describe('The refined AI prompt.'),
});
export type RefinePromptOutput = z.infer<typeof RefinePromptOutputSchema>;

export async function refinePrompt(input: RefinePromptInput): Promise<RefinePromptOutput> {
  return refinePromptFlow(input);
}

const refinePromptPrompt = ai.definePrompt({
  name: 'refinePromptPrompt',
  input: {schema: RefinePromptInputSchema},
  output: {schema: RefinePromptOutputSchema},
  prompt: `You are a senior AI prompt engineer. Convert the user’s casual idea into a professional, high-performing AI prompt for {{promptType}} at a {{qualityLevel}} level. Add role, context, constraints, tone, format, and clarity based on reasoning for when or if it is needed. Do NOT remove user intent.

User Idea: {{{idea}}}`,
});

const refinePromptFlow = ai.defineFlow(
  {
    name: 'refinePromptFlow',
    inputSchema: RefinePromptInputSchema,
    outputSchema: RefinePromptOutputSchema,
  },
  async input => {
    const {output} = await refinePromptPrompt(input);
    return output!;
  }
);
