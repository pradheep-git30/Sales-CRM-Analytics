'use server';

import {
  dataFormattingAnalysis,
  DataFormattingAnalysisOutput,
} from '@/ai/flows/data-formatting-analysis';
import { fetchRealTimeContext } from '@/ai/flows/fetch-real-time-context';

export type ActionResponse = {
  data?: DataFormattingAnalysisOutput;
  error?: string;
};

// Function to check for future years in the query
const checkForFutureDates = (query: string): boolean => {
    const currentYear = new Date().getFullYear();
    const yearRegex = /\b(20[2-9][0-9]|2[1-9][0-9]{2})\b/g; // Matches years 2025 and beyond
    const matches = query.match(yearRegex);

    if (matches) {
        for (const match of matches) {
            if (parseInt(match) > currentYear) {
                return true;
            }
        }
    }
    return false;
};

export async function getSalesAnalytics(
  query: string
): Promise<ActionResponse> {
  if (!query) {
    return { error: 'Query cannot be empty.' };
  }

  // Validate for future dates
  if (checkForFutureDates(query)) {
    return { error: `I cannot predict the future. Please ask for a year up to ${new Date().getFullYear()}.` };
  }

  try {
    // 1. Fetch real-time context using Gemini
    const contextResponse = await fetchRealTimeContext({ query });

    if (!contextResponse || !contextResponse.context) {
      throw new Error('Failed to fetch real-time context.');
    }

    // 2. Pass context to Gemini for analysis and formatting
    const analysisResponse = await dataFormattingAnalysis({
      query,
      context: contextResponse.context,
    });
    
    if (!analysisResponse) {
        throw new Error('Failed to get analysis from AI.');
    }

    return { data: analysisResponse };
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
    return { error: `An error occurred while processing your request: ${errorMessage}` };
  }
}
