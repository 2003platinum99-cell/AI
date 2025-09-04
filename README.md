# Somali Programmer AI Bot

A personal AI chat bot, similar to ChatGPT, powered by the Gemini API. Engage in conversation, ask questions, and get instant, streaming responses.

This project is set up using Vite and React, and is ready to be deployed to GitHub Pages.

## Getting Started

### Prerequisites

-   Node.js (version 18 or higher recommended)
-   npm
-   A Gemini API Key

### Installation & Running Locally

1.  **Clone the repository:**
    If you haven't already, clone this project to your local machine.

2.  **Install dependencies:**
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    Create a file named `.env` in the root of the project. Inside this file, add your Gemini API key like this:
    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    *Note: The `.env` file is included in `.gitignore` to prevent you from accidentally committing your secret key.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

## Deploying to GitHub Pages

Follow these steps to make your application live on a `github.io` URL.

### Step 1: Push to GitHub

Create a new repository on your GitHub account and push this project's code to it.

### Step 2: Configure Project Files

You may need to update two files to match your GitHub details.

1.  **`package.json`**: Update the `homepage` URL to point to where your site will be live.
    ```json
    "homepage": "https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>",
    ```
2.  **`vite.config.ts`**: Update the `repositoryName` variable to be the exact name of your GitHub repository.
    ```typescript
    const repositoryName = '<YOUR_REPOSITORY_NAME>';
    ```

### Step 3: Deploy

Run the deploy script from your terminal. This command will automatically build the application and push the final files to a special `gh-pages` branch on your repository.

```bash
npm run deploy
```

### Step 4: Enable GitHub Pages

1.  On GitHub, go to your repository's **Settings** tab.
2.  In the sidebar, click on **Pages**.
3.  Under "Build and deployment", set the **Source** to "Deploy from a branch".
4.  Change the branch to **`gh-pages`** and the folder to **`/ (root)`**. Click **Save**.

After a few minutes, your application will be live at the URL you specified in the `homepage` field!