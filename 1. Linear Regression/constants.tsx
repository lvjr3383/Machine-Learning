
import { Movie, RegressionParams, RegressionMetrics } from './types';

export const movieData: Movie[] = [
  { title: "Avatar", budget: 237, revenue: 2787, year: 2009 },
  { title: "Titanic", budget: 200, revenue: 1845, year: 1997 },
  { title: "The Avengers", budget: 220, revenue: 1518, year: 2012 },
  { title: "Jurassic World", budget: 150, revenue: 1671, year: 2015 },
  { title: "Furious 7", budget: 190, revenue: 1515, year: 2015 },
  { title: "Avengers: AOU", budget: 250, revenue: 1405, year: 2015 },
  { title: "Frozen", budget: 150, revenue: 1274, year: 2013 },
  { title: "Iron Man 3", budget: 200, revenue: 1215, year: 2013 },
  { title: "Minions", budget: 74, revenue: 1156, year: 2015 },
  { title: "Civil War", budget: 250, revenue: 1153, year: 2016 },
  { title: "Transformers 3", budget: 195, revenue: 1123, year: 2011 },
  { title: "Skyfall", budget: 200, revenue: 1108, year: 2012 },
  { title: "Dark Knight Rises", budget: 250, revenue: 1084, year: 2012 },
  { title: "Joker", budget: 55, revenue: 1074, year: 2019 },
  { title: "Toy Story 4", budget: 200, revenue: 1073, year: 2019 },
  { title: "Toy Story 3", budget: 200, revenue: 1066, year: 2010 },
  { title: "Pirates 2", budget: 200, revenue: 1065, year: 2006 },
  { title: "Lion King", budget: 45, revenue: 968, year: 1994 },
  { title: "Finding Nemo", budget: 94, revenue: 940, year: 2003 },
  { title: "Lone Ranger", budget: 215, revenue: 89, year: 2013 }
];

export function calculateRegression(data: Movie[]): RegressionParams {
  const n = data.length;
  if (n === 0) return { m: 0, b: 0 };
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  data.forEach(m => {
    sumX += m.budget; sumY += m.revenue;
    sumXY += m.budget * m.revenue; sumXX += m.budget * m.budget;
  });
  const den = (n * sumXX - sumX * sumX);
  const m = den === 0 ? 0 : (n * sumXY - sumX * sumY) / den;
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

export function calculateMetrics(data: Movie[], m: number, b: number): RegressionMetrics {
  const n = data.length;
  if (n === 0) return { sse: 0, mse: 0, r2: 0 };
  const sse = data.reduce((acc, mv) => acc + Math.pow(mv.revenue - (m * mv.budget + b), 2), 0);
  const mse = sse / n;
  const meanY = data.reduce((acc, mv) => acc + mv.revenue, 0) / n;
  const sst = data.reduce((acc, mv) => acc + Math.pow(mv.revenue - meanY, 2), 0);
  return { sse, mse, r2: sst === 0 ? 0 : 1 - (sse / sst) };
}

export const BEST_FIT = calculateRegression(movieData);
export const BAD_FIT = { m: 1.5, b: 200 };

export const STEP_METADATA = {
  1: {
    title: "Scatter Plot",
    description: "Phase 1: Visualize the raw data points.",
    mechanics: "Plot budget vs. revenue and look for a trend. If points rise as budgets rise, a linear model may be useful.",
    instruction: "Step 1: Inspect the scatter plot and look for correlation between budget and revenue.",
    questions: ["What pattern do you see?", "Is the trend positive or negative?"]
  },
  2: {
    title: "Residuals and Error",
    description: "Phase 2: Measure how far the line is from the data.",
    mechanics: "Residuals are vertical distances from points to the line. MSE is the average of squared residuals.",
    instruction: "Step 2: See how residuals show error and how MSE summarizes it.",
    questions: ["What is a residual?", "Why square the error?"]
  },
  3: {
    title: "Best Fit",
    description: "Phase 3: Find the line with minimum error.",
    mechanics: "Least squares selects the slope and intercept that minimize MSE. R^2 summarizes fit quality from 0 to 1.",
    instruction: "Step 3: Compare the best-fit line and the R^2 score.",
    questions: ["What does R^2 mean?", "Is this a strong fit?"]
  },
  4: {
    title: "Prediction",
    description: "Phase 4: Use the model for estimates.",
    mechanics: "Apply y = mx + b to a new budget to estimate revenue.",
    instruction: "Step 4: Move the budget slider to see the model's prediction.",
    questions: ["How is the prediction computed?", "What happens if the budget increases?"]
  }
};
