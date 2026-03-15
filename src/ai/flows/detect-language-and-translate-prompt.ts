
'use server';
/**
 * @fileOverview A flow that detects the language of the input text and translates the generated prompt to the preferred language.
 *
 * - detectLanguageAndTranslatePrompt - A function that detects the language of the input text and translates the generated prompt.
 * - DetectLanguageAndTranslatePromptInput - The input type for the detectLanguageAndTranslatePrompt function.
 * - DetectLanguageAndTranslatePromptOutput - The return type for the detectLanguageAndTranslatePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectLanguageAndTranslatePromptInputSchema = z.object({
  text: z.string().describe('The input text to be translated.'),
  targetLanguage: z
    .string()
    .describe('The exact target language for the translated prompt (e.g. Hindi, Spanish, English).'),
});
export type DetectLanguageAndTranslatePromptInput = z.infer<
  typeof DetectLanguageAndTranslatePromptInputSchema
>;

const DetectLanguageAndTranslatePromptOutputSchema = z.object({
  translatedPrompt: z.string().describe('The translated prompt.'),
});
export type DetectLanguageAndTranslatePromptOutput = z.infer<
  typeof DetectLanguageAndTranslatePromptOutputSchema
>;

export async function detectLanguageAndTranslatePrompt(
  input: DetectLanguageAndTranslatePromptInput
): Promise<DetectLanguageAndTranslatePromptOutput> {
  return detectLanguageAndTranslatePromptFlow(input);
}

const detectLanguagePrompt = ai.definePrompt({
  name: 'detectLanguagePrompt',
  prompt: `Detect the language of the following text. Return the language name only. Do not include any other words in the output.\n\nText: {{{text}}}`,
});

const translatePrompt = ai.definePrompt({
  name: 'translatePrompt',
  input: z.object({
    text: z.string(),
    targetLanguage: z.string(),
  }),
  prompt: `Translate the following text to {{targetLanguage}}:\n\n{{{text}}}`,
});

const detectLanguageAndTranslatePromptFlow = ai.defineFlow(
  {
    name: 'detectLanguageAndTranslatePromptFlow',
    inputSchema: DetectLanguageAndTranslatePromptInputSchema,
    outputSchema: DetectLanguageAndTranslatePromptOutputSchema,
  },
  async input => {
    const detectedLanguageResponse = await detectLanguagePrompt(input);
    const detectedLanguage = detectedLanguageResponse.output;

    const translateResponse = await translatePrompt({
      text: input.text,
      targetLanguage: input.targetLanguage,
    });

    return {translatedPrompt: translateResponse.output!};
  }
);
