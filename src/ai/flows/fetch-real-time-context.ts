'use server';
/**
 * @fileOverview Fetches real-time context related to a product sales query using the Gemini API.
 *
 * - fetchRealTimeContext - A function that fetches real-time context.
 * - FetchRealTimeContextInput - The input type for the fetchRealTimeContext function.
 * - FetchRealTimeContextOutput - The return type for the fetchRealTimeContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const FetchRealTimeContextInputSchema = z.object({
  query: z.string().describe('The user query about product sales.'),
});
export type FetchRealTimeContextInput = z.infer<typeof FetchRealTimeContextInputSchema>;

const FetchRealTimeContextOutputSchema = z.object({
  context: z.string().describe('The real-time context fetched from the Gemini API.'),
});
export type FetchRealTimeContextOutput = z.infer<typeof FetchRealTimeContextOutputSchema>;

export async function fetchRealTimeContext(input: FetchRealTimeContextInput): Promise<FetchRealTimeContextOutput> {
  return fetchRealTimeContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fetchRealTimeContextPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: FetchRealTimeContextInputSchema},
  output: {schema: FetchRealTimeContextOutputSchema},
  prompt: `You are a real-time data retrieval expert. Your job is to use the following user query to find relevant, real-time information that can be used to generate sales data, summaries, insights and chart suggestions.

User Query: {{{query}}}

Return the real-time context that you found. Be as detailed as possible. Include the sources for the context.
`,
});

const fetchRealTimeContextFlow = ai.defineFlow(
  {
    name: 'fetchRealTimeContextFlow',
    inputSchema: FetchRealTimeContextInputSchema,
    outputSchema: FetchRealTimeContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
