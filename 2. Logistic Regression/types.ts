
export interface Song {
  title: string;
  dance: number;
  energy: number;
  label: number; // 1: Class 1, 0: Class 0
}

export enum Step {
  SoundCheck = 1,
  SCurve = 2,
  VelvetRope = 3,
  DemoTape = 4
}

export interface ModelWeights {
  dance: number;
  energy: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
