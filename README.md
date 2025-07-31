# Analytica: AI-Powered Sales Analytics

Analytica is a sophisticated, AI-powered web application designed to democratize data analysis. Its core purpose is to act as an intelligent business analyst that can be queried in plain English. Users can ask complex questions about sales data, market trends, and product performance, and in response, Analytica provides a comprehensive, real-time dashboard.

![Analytica Screenshot](https://placehold.co/800x450.png?text=Analytica+UI)
*This is a placeholder image. Replace with a screenshot of the actual application.*

## Core Features

-   **Natural Language Queries**: Ask complex questions like *"Compare iPhone vs Samsung sales in Asia for 2023"* and get instant, structured answers.
-   **AI-Driven Analysis**: Leverages Google's Gemini Pro to fetch real-time context and generate insightful analytics.
-   **Rich Data Visualization**: Dynamically generates interactive charts (bar, line, pie, area) to visualize the data, powered by Recharts.
-   **Comprehensive Results**: Each query returns a full dashboard including:
    -   A narrative summary of the findings.
    -   A key business insight highlighting important trends.
    -   An interactive data chart.
    -   A complete data table with the raw numbers.
    -   Suggested follow-up questions for deeper, conversational exploration.
-   **Real-time Animations**: A fluid user experience with animations for loading states and a "typewriter" effect for AI-generated text.
-   **Themable UI**: Includes a modern, responsive interface with both Light and Dark modes.

## Tech Stack

Analytica is built with a modern, powerful, and scalable tech stack.

### Frontend

-   **Framework**: [Next.js](https://nextjs.org/) (with React) using the App Router.
-   **Language**: [TypeScript](https://www.typescriptlang.org/).
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/) for beautiful, accessible, and composable components.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling workflow.
-   **Data Visualization**: [Recharts](https://recharts.org/) for creating interactive and responsive charts.
-   **Animations**: [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate) for UI animations.

### Backend & AI

-   **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit) for orchestrating AI flows.
-   **Language Model (LLM)**: [Google Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/) for all reasoning, data generation, and analysis.

## How It Works: The AI Algorithm

The core logic of Analytica is a two-step AI flow orchestrated by Genkit:

1.  **Fetch Real-Time Context**: The user's query is first sent to Gemini to act as a "data retrieval expert." The model synthesizes relevant, real-time information and statistics from its training data, creating an ad-hoc dataset for the query.

2.  **Format Data & Generate Insights**: The context from Step 1 is then passed back to Gemini, which is now prompted to act as an "expert data analyst." It transforms the raw context into a structured JSON object containing the summary, insight, data table, chart recommendations, and follow-up questions. This JSON is then sent to the frontend to be rendered.

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (version 18 or later)
-   `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add your Gemini API key:
    ```env
    GEMINI_API_KEY=AIza...your...key...here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:9002](http://localhost:9002).
