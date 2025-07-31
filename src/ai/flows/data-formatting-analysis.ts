'use server';

/**
 * @fileOverview A Genkit flow that uses the OpenAI API to generate a sales table,
 * summary, and chart recommendation based on the cleaned context and user query.
 *
 * - dataFormattingAnalysis - A function that handles the data formatting and analysis process.
 * - DataFormattingAnalysisInput - The input type for the dataFormattingAnalysis function.
 * - DataFormattingAnalysisOutput - The return type for the dataFormattingAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Flow, FlowOption } from 'genkit/flow';
import { googleAI } from '@genkit-ai/googleai';

const DataFormattingAnalysisInputSchema = z.object({
  query: z.string().describe('The user query related to product sales.'),
  context: z.string().describe('The cleaned context fetched from Gemini API.'),
});
export type DataFormattingAnalysisInput = z.infer<typeof DataFormattingAnalysisInputSchema>;

const DataFormattingAnalysisOutputSchema = z.object({
  summary: z.string().describe('A summary of the sales data.'),
  insight: z.string().describe('A business insight based on the sales data.'),
  chart_type: z.enum(['bar', 'line', 'pie', 'area']).describe('The recommended chart type for visualization.'),
  suggested_visuals: z.array(z.enum(['bar', 'line', 'pie', 'area'])).describe('A list of suggested chart types.'),
  follow_ups: z.array(z.string()).describe('A list of suggested follow-up questions.'),
  data_table: z.object({
    columns: z.array(z.string()).describe('The columns of the sales data table.'),
    rows: z.array(z.array(z.union([z.string(), z.number()]))).describe('The rows of the sales data table. Each inner array represents a row.'),
  }).describe('The sales data table.'),
  sources: z.array(z.string()).describe('A list of sources for the data.'),
  estimated: z.boolean().optional().describe('Indicates if the data is estimated.'),
  confidence: z.number().optional().describe('A confidence score for the data.'),
  note: z.string().optional().describe('A note about the data, e.g., if it is an estimation.'),
});
export type DataFormattingAnalysisOutput = z.infer<typeof DataFormattingAnalysisOutputSchema>;

const prompt = ai.definePrompt({
  name: 'dataFormattingAnalysisPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: DataFormattingAnalysisInputSchema},
  output: {schema: DataFormattingAnalysisOutputSchema},
  prompt: `Given the following context and user query, generate a real-world sales table with a summary and chart recommendation.

Context: {{{context}}}

Query: {{{query}}}

Ensure the response is a valid JSON object conforming to the DataFormattingAnalysisOutputSchema. Do not repeat identical data rows, show distinct figures, and back results with real sources or use estimated tags.
`,
});

const dataFormattingAnalysisFlow: Flow<DataFormattingAnalysisInput, DataFormattingAnalysisOutput> = ai.defineFlow(
  {
    name: 'dataFormattingAnalysisFlow',
    inputSchema: DataFormattingAnalysisInputSchema,
    outputSchema: DataFormattingAnalysisOutputSchema,
  },
  async (input, streamingCallback, options) => {
    const {output} = await prompt(input, options);
    return output!;
  }
);

export async function dataFormattingAnalysis(input: DataFormattingAnalysisInput, options?: FlowOption): Promise<DataFormattingAnalysisOutput> {
    return dataFormattingAnalysisFlow(input, undefined, options);
}
