'use server';

/**
 * @fileOverview An AI agent that enhances a space name with contextual information.
 *
 * - enhanceSpaceName - A function that enhances a space name with contextual information.
 * - EnhanceSpaceNameInput - The input type for the enhanceSpaceName function.
 * - EnhanceSpaceNameOutput - The return type for the enhanceSpaceName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceSpaceNameInputSchema = z.object({
  spaceName: z.string().describe('The name of the space to enhance.'),
});
export type EnhanceSpaceNameInput = z.infer<typeof EnhanceSpaceNameInputSchema>;

const EnhanceSpaceNameOutputSchema = z.object({
  enhancedDescription: z.string().describe('An enhanced description of the space and its potential uses.'),
});
export type EnhanceSpaceNameOutput = z.infer<typeof EnhanceSpaceNameOutputSchema>;

export async function enhanceSpaceName(input: EnhanceSpaceNameInput): Promise<EnhanceSpaceNameOutput> {
  return enhanceSpaceNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceSpaceNamePrompt',
  input: {schema: EnhanceSpaceNameInputSchema},
  output: {schema: EnhanceSpaceNameOutputSchema},
  prompt: `You are a creative interior designer specializing in suggesting uses for spaces based on their names.

  Given the name of a space, provide a description of the space and suggest potential uses for it, or who it might be useful to reach.

  Space Name: {{{spaceName}}}
  `,
});

const enhanceSpaceNameFlow = ai.defineFlow(
  {
    name: 'enhanceSpaceNameFlow',
    inputSchema: EnhanceSpaceNameInputSchema,
    outputSchema: EnhanceSpaceNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
