# Linear Regression as an Interactive Lesson

Most explanations of linear regression jump from a scatter plot straight into equations. That works if you already trust the math. For everyone else, the gap between "points on a chart" and "best fit line" can feel abstract. This project closes that gap by turning linear regression into a short, visual walkthrough that explains the ideas in small, concrete steps.

This README is written like a Medium article: it covers why we built it, what we built, how it works, and what we learned.

## Why We Built This

Linear regression is often the first model people meet in machine learning. It is also the first time many learners see error metrics like MSE and goodness-of-fit like R^2. Those concepts are simpler when they are visual and interactive.

We built this app to:

- Make the relationship between data points and a line obvious.
- Show error as a distance you can see, not just a number.
- Turn prediction into a hands-on experiment, not a formula on a slide.

Movies are a familiar domain with clear inputs (budget) and outputs (revenue). That makes the lesson relatable without dumbing down the math.

## What We Built

The app is split into two panels:

- A guide panel that explains the current phase and offers quick questions.
- A visualization panel that updates as you move through the steps.

The learning flow is intentionally simple:

1. **Scatter Plot**: see the raw data and the trend.
2. **Residuals and Error**: visualize errors and compute MSE.
3. **Best Fit**: show the least-squares line and the R^2 score.
4. **Prediction**: move a budget slider and see predicted revenue.

Each phase builds on the previous one, so you learn the model in the same order you would reason about it.

## How We Built It

### Data and Math

The dataset is a small list of films with budget, revenue, and release year. The linear regression uses standard least squares:

- Compute slope (m) and intercept (b) from the data.
- Compute residuals and MSE.
- Compute R^2 to summarize fit.

All of this lives in `constants.tsx` and is recalculated whenever filters change.

### UI and State

The visualization uses Recharts for the scatter plot, residual lines, and regression line. The UI is driven by a simple step enum. As the step changes:

- Different overlays appear (residuals, best-fit line).
- Metrics are revealed at the right moment.
- The prediction slider becomes active at the end.

Filtering by decade lets users see how the relationship changes across time.

### Assistant Responses

The guide panel can send short questions to a server endpoint (`/api/oracle`). The response is intentionally brief so the UI stays readable.

To keep keys out of the browser, the client never calls the Gemini SDK directly. Instead:

- The client sends a request to `/api/oracle`.
- The dev or preview server processes it and calls Gemini.
- Responses are returned as plain text.

This keeps the app functional while minimizing the risk of key exposure.

## Lessons Learned and Challenges

Building a small teaching app surfaces a few practical lessons:

- **Residuals make error click**. A dashed red line explains MSE faster than a formula ever will.
- **Step gating reduces overload**. Showing everything at once is confusing. Staging concepts keeps users oriented.
- **Data quirks are teachable moments**. A single outlier can bend the line in surprising ways, which is exactly the point of talking about variance and fit.
- **Short answers are better**. Long responses block the UI. Two sentences are often enough.
- **Security should be the default**. Even small demos should avoid shipping API keys to the browser.

Challenges we navigated:

- Balancing simplicity with correctness (you can only show so much math on one screen).
- Keeping the chart readable while adding residual lines and a prediction point.
- Making the story flow without hiding the underlying mechanics.

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
- `components/VisualizationPanel.tsx`: charts and prediction UI
- `constants.tsx`: dataset and regression math
- `server/oracle.ts`: server endpoint for assistant responses
- `services/geminiService.ts`: client helper to call the endpoint

## Where to Go Next

If you want to extend the project:

- Swap in a new dataset (housing prices, salaries, sports stats).
- Add polynomial regression for non-linear relationships.
- Compare metrics like MAE vs MSE.
- Let users add points and watch the line update in real time.

This is meant to be a clean, minimal foundation. The structure is simple so you can take it in any direction.
