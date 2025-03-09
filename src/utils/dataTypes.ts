export interface ConversationEntry {
  speaker: string;
  text: string;
  start_time: string;
  end_time: string;
  sentiment_words_analysis?: string;
  sentiment_tone?: string;
  sentiment?: number;
  response_delay: string;
  accuracy: number | null;
  is_abusive?: boolean;
  abusive_words?: string[];
}

export interface ConversationData {
  conversation: ConversationEntry[];
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
  type: 'general' | 'accuracy' | 'sentiment' | 'delays' | 'interaction';
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}
