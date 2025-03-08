
export interface ConversationEntry {
  speaker: "Bot" | "Customer";
  text: string;
  start_time: string;
  end_time: string;
  sentiment_words_analysis: "positive" | "neutral" | "negative";
  sentiment_tone: "positive" | "neutral" | "negative";
  response_delay: string | "null";
  accuracy_scale: number | null;
}

export interface AccuracyMetric {
  value: number;
  label: string;
  time: string;
}

export interface DelayMetric {
  value: number; 
  label: string;
  time: string;
}

export interface SentimentMetric {
  type: "words" | "tone";
  speaker: "Bot" | "Customer";
  value: "positive" | "neutral" | "negative";
  time: string;
}

export interface TimelineEntry {
  speaker: "Bot" | "Customer";
  text: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
  accuracy?: number | null;
  delay?: string;
}

export type InsightType = 
  | "general" 
  | "accuracy" 
  | "sentiment" 
  | "delays" 
  | "interaction";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
}
