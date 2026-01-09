
import { Song } from './types';

export const SONG_DATA: Song[] = [
  { title: "Track 1", dance: 85, energy: 90, label: 1 },
  { title: "Track 2", dance: 92, energy: 80, label: 1 },
  { title: "Track 3", dance: 95, energy: 95, label: 1 },
  { title: "Track 4", dance: 10, energy: 5, label: 0 },
  { title: "Track 5", dance: 30, energy: 20, label: 0 },
  { title: "Track 6", dance: 55, energy: 50, label: 1 },
  { title: "Track 7", dance: 20, energy: 15, label: 0 },
  { title: "Track 8", dance: 88, energy: 95, label: 1 },
  { title: "Track 9", dance: 40, energy: 30, label: 0 },
  { title: "Track 10", dance: 50, energy: 40, label: 0 },
  { title: "Track 11", dance: 82, energy: 75, label: 1 },
  { title: "Track 12", dance: 0, energy: 10, label: 0 }
];

export const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  fail: '#64748B',
  hitZone: 'rgba(139, 92, 246, 0.05)',
  flopZone: 'rgba(100, 116, 139, 0.05)'
};

export const STEP_INFO = {
  1: {
    title: "Scatter Plot",
    chat: "Step 1: We start with a scatter plot of two features and their labels. Look for clustering between the two classes.",
    blurb: "Mapping Inputs: Logistic regression begins with labeled data. Plotting features helps reveal whether the classes are separable.",
    questions: ["What are features?", "Why a 2D plot?", "What do clusters mean?"]
  },
  2: {
    title: "Sigmoid Curve",
    chat: "Step 2: A linear score is converted to a probability using the sigmoid function.",
    blurb: "The sigmoid maps any real number to a 0-1 range, which is required for classification probabilities.",
    questions: ["Why use sigmoid?", "What does the curve show?", "How does slope affect it?"]
  },
  3: {
    title: "Decision Boundary",
    chat: "Step 3: Adjust feature weights and watch the decision boundary move.",
    blurb: "Weights control how much each feature contributes to the score. The boundary is the set of points where predicted probability crosses the threshold.",
    questions: ["What are weights?", "What is the threshold?", "How do errors change?"]
  },
  4: {
    title: "Prediction",
    chat: "Step 4: Move the sliders to classify a new example.",
    blurb: "Inference applies the learned weights to new data and outputs a probability and class.",
    questions: ["What is inference?", "How is the score computed?", "What changes the outcome?"]
  }
};
