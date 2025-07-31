# **App Name**: KronosLens

## Core Features:

- Real-Time Context Fetching: Use Gemini API to fetch the real-time context (market share articles, industry stats, press releases, etc.) for the user's query about product sales. Gemini is used as a tool to find real market trends and source.
- Data Formatting & Analysis: Pass cleaned context and user's query to OpenAI API (GPT-4) to generate a sales table with summary and chart recommendation.
- Data Visualization & Export: Display the data in a clear, structured table, supporting CSV export and chart PNG download. Suggested chart types include bar, line, pie, and area.
- Insights & Summaries: Provide plain-English summaries and business insights based on the data analysis. Smart follow-up questions are also generated to facilitate further exploration.
- Source Referencing: Include source references for the data wherever possible. Estimated tags and confidence scores are also used to indicate the reliability of the data.
- Query Caching & Refresh: Cache queries with timestamps to enable refresh. The feature stores data for later use, enhancing real-time updates.

## Style Guidelines:

- Primary color: Dark indigo (#3F51B5) to convey trust and depth in data analytics. 
- Background color: Very light indigo (#F0F2F9) for a clean, professional interface.
- Accent color: Deep purple (#7E57C2) to highlight important elements and calls to action.
- Body and headline font: 'Inter' (sans-serif) for a modern, objective look, suitable for both headlines and body text.
- Use clean, minimalist icons to represent different data types and functions. For instance, charts, tables, export functions.
- The layout should be clean and intuitive, emphasizing key metrics and visualizations. Utilize white space to create a clutter-free interface.
- Subtle transitions and animations for chart updates and data loading to provide a smooth, real-time experience.