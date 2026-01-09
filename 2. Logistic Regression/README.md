<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Logistic Regression as a Hands-On Lesson

Logistic regression is often described as "a line passed through a sigmoid." That is accurate, but it can feel abstract. This project turns the concept into a guided, interactive walkthrough using a simple two-feature dataset. The goal is to make classification feel intuitive before it feels formal.

This README is written like a Medium article: it explains the scenario, what we built, why we built it, how it works, and what we learned along the way.

## Scenario: Binary Classification with Two Features

We work with a small labeled dataset that has two normalized features:

- Danceability
- Energy

Each example is labeled as Class 1 or Class 0. Logistic regression is a natural fit because it outputs probabilities, not just a hard yes or no. This makes it easy to see how the decision boundary shifts as weights change.

## What We Built

The app is a two-panel experience:

- A guide panel that explains each step and answers quick questions.
- A workspace that visualizes the model, the data, and the decision boundary.

The experience is broken into four stages:

1. **Scatter Plot**: See how the classes cluster in feature space.
2. **Sigmoid Curve**: Learn how a linear score becomes a probability.
3. **Decision Boundary**: Adjust weights and watch the boundary move.
4. **Prediction**: Use sliders to classify a new example in real time.

Each step introduces one core idea and keeps the UI focused on that idea alone.

## Why We Built It

Logistic regression is foundational. It is often the first classification model people encounter, and it introduces key ideas that show up everywhere:

- Mapping a score to a probability
- Using a threshold to classify
- Interpreting weights and feature importance

We wanted a way to teach those ideas without throwing a full textbook at the user. A small dataset and simple features keep the focus on the model, not the data cleaning.

## How It Works

### Data and Features

The dataset is a small, curated set of examples labeled as Class 1 or Class 0. Each data point has:

- `dance` (0-100)
- `energy` (0-100)
- `label` (1 or 0)

We plot these points and color them by label.

### Model Intuition

The model computes a linear score:

`score = w_dance * dance + w_energy * energy`

That score is passed through the sigmoid function to yield a probability between 0 and 1. A probability above 0.5 is treated as Class 1. The decision boundary is the line where the score equals the threshold.

### UI Mechanics

- **Step 1** shows the clusters.
- **Step 2** shows the sigmoid curve and how slope changes confidence.
- **Step 3** lets you tune weights and see how many positives you miss.
- **Step 4** lets you input a new example and see the predicted outcome.

Each step is its own component, with shared state stored in the main app.

### Assistant Responses

The guide panel can answer short questions via a local API endpoint. The client calls `/api/oracle`, and the server handles the model call. This keeps credentials on the server and limits what ships to the browser.

## Lessons Learned and Challenges

- **Probabilities are easier than thresholds**: Users understand a 70% chance faster than a strict cutoff.
- **Weight tuning teaches importance**: Moving sliders makes feature importance tangible.
- **Data scale matters**: Keeping both features on a 0-100 scale avoids confusion.
- **Short, focused steps beat long explanations**: Each step should answer one question.
- **Security is non-negotiable**: Keeping AI calls server-side prevents accidental key exposure.

## Run Locally

Prerequisite: Node.js

1. Install dependencies:
   `npm install`
2. Create `.env.local` and set:
   `GEMINI_API_KEY=your_key_here`
3. Start the dev server:
   `npm run dev`

## Project Structure

- `App.tsx`: main layout and step flow
- `components/ChatPanel.tsx`: guide panel UI
- `components/Workspace.tsx`: step container
- `components/Step1-4.tsx`: each learning step
- `constants.ts`: dataset and copy
- `server/oracle.ts`: server endpoint for assistant responses
- `services/geminiService.ts`: client helper for the endpoint

## Where to Go Next

If you want to extend this:

- Swap in a different dataset (sports stats, customer churn, medical outcomes).
- Add a second threshold and discuss precision vs recall.
- Visualize decision regions with a heatmap.
- Let users upload their own data points.

This project is intentionally small so it can be a clean base for new ideas.
