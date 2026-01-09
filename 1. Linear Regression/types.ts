
export enum Step {
  SCATTER = 1,
  RESIDUALS = 2,
  BEST_FIT = 3,
  PREDICTION = 4
}

export interface Movie {
  title: string;
  budget: number;
  revenue: number;
  year: number;
}

export interface RegressionParams {
  m: number;
  b: number;
}

export interface RegressionMetrics {
  sse: number;
  mse: number;
  r2: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type DecadeFilter = 'All' | '1990s' | '2000s' | '2010s';
