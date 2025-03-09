
import { useMemo } from 'react';
import { ConversationEntry, Insight, InsightType } from "@/utils/dataTypes";

export function useInsights(data: ConversationEntry[]) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const insights: Insight[] = [];
    
    // Calculate accuracy metrics
    const botEntries = data.filter(entry => entry.speaker === "Bot" && entry.accuracy_scale !== null);
    const accuracyValues = botEntries.map(entry => entry.accuracy_scale as number);
    const avgAccuracy = accuracyValues.length > 0 
      ? accuracyValues.reduce((sum, val) => sum + val, 0) / accuracyValues.length
      : 0;
    
    // Get sentiment distribution
    const botSentiments = data.filter(entry => entry.speaker === "Bot")
      .map(entry => entry.sentiment_words_analysis);
    const customerSentiments = data.filter(entry => entry.speaker === "Customer")
      .map(entry => entry.sentiment_words_analysis);
    
    const botPositive = botSentiments.filter(s => s === "positive").length;
    const botNeutral = botSentiments.filter(s => s === "neutral").length;
    const botNegative = botSentiments.filter(s => s === "negative").length;
    
    const customerPositive = customerSentiments.filter(s => s === "positive").length;
    const customerNeutral = customerSentiments.filter(s => s === "neutral").length;
    const customerNegative = customerSentiments.filter(s => s === "negative").length;
    
    // Get response delays
    const delays = data
      .filter(entry => entry.speaker === "Bot" && entry.response_delay !== "null")
      .map(entry => {
        const delay = entry.response_delay;
        if (delay === "null") return 0;
        const match = delay.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : 0;
      });
    
    const avgDelay = delays.length > 0 
      ? delays.reduce((sum, val) => sum + val, 0) / delays.length
      : 0;
    
    // General conversation insight
    insights.push({
      type: "general",
      title: "Conversation Overview",
      description: `This ${data.length}-message conversation showed ${
        avgAccuracy > 0.5 ? "good" : avgAccuracy > 0 ? "moderate" : "poor"
      } bot accuracy with ${
        delays.length > 0 ? `an average response delay of ${avgDelay.toFixed(1)} seconds` : "minimal delays"
      }.`
    });
    
    // Accuracy insight
    insights.push({
      type: "accuracy",
      title: "Accuracy Analysis",
      description: `The bot's responses showed ${
        avgAccuracy > 0.5 ? "above average" : avgAccuracy > 0 ? "average" : "below average"
      } accuracy. ${
        accuracyValues.some(v => v < 0) 
          ? "Some responses contained inaccuracies that should be addressed." 
          : "All responses were generally accurate."
      }`
    });
    
    // Sentiment insight
    const dominantBotSentiment = botPositive > botNeutral && botPositive > botNegative 
      ? "positive" 
      : botNegative > botNeutral && botNegative > botPositive
        ? "negative"
        : "neutral";
        
    const dominantCustomerSentiment = customerPositive > customerNeutral && customerPositive > customerNegative 
      ? "positive" 
      : customerNegative > customerNeutral && customerNegative > customerPositive
        ? "negative"
        : "neutral";
    
    insights.push({
      type: "sentiment",
      title: "Sentiment Analysis",
      description: `The bot's tone was primarily ${dominantBotSentiment}, while the customer appeared ${dominantCustomerSentiment}. ${
        dominantBotSentiment === dominantCustomerSentiment 
          ? "Both parties maintained similar sentiment throughout the conversation."
          : `There was a sentiment mismatch between the bot (${dominantBotSentiment}) and customer (${dominantCustomerSentiment}).`
      }`
    });
    
    // Delay insight
    if (delays.length > 0) {
      insights.push({
        type: "delays",
        title: "Response Timing",
        description: `The bot's average response delay was ${avgDelay.toFixed(1)} seconds. ${
          avgDelay < 1 
            ? "Responses were generally very quick."
            : avgDelay < 2
              ? "Response times were acceptable."
              : "Some responses had noticeable delays."
        }`
      });
    }
    
    // Interaction pattern insight
    const customerCorrections = data.filter((entry, i) => {
      if (i === 0 || entry.speaker !== "Customer") return false;
      const prevEntry = data[i-1];
      return prevEntry.speaker === "Bot" && 
        (entry.text.toLowerCase().includes("wait") || 
        entry.text.toLowerCase().includes("no") ||
        entry.text.toLowerCase().includes("actually"));
    });
    
    if (customerCorrections.length > 0) {
      insights.push({
        type: "interaction",
        title: "Conversation Flow",
        description: `Customer needed to correct or clarify information ${customerCorrections.length} times during the conversation, suggesting some misunderstandings occurred.`
      });
    }
    
    return insights;
  }, [data]);
}
