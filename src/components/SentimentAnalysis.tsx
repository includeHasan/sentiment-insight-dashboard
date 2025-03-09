import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle } from "lucide-react";

interface SentimentAnalysisProps {
  data: ConversationEntry[];
}

export function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  // Process data for bot and customer sentiment
  const botSentiments = data.filter(entry => entry.speaker === "Bot");
  const customerSentiments = data.filter(entry => entry.speaker === "Customer");
  
  // Classify sentiments into positive, neutral, negative based on sentiment value
  const classifySentiment = (sentimentValue: number) => {
    if (sentimentValue > 0.1) return "positive";
    if (sentimentValue < -0.1) return "negative";
    return "neutral";
  };
  
  // Count sentiment categories for bot
  const botSentimentCategories = botSentiments.map(entry => classifySentiment(entry.sentiment));
  const botPositive = botSentimentCategories.filter(s => s === "positive").length;
  const botNeutral = botSentimentCategories.filter(s => s === "neutral").length;
  const botNegative = botSentimentCategories.filter(s => s === "negative").length;
  
  // Count sentiment categories for customer
  const customerSentimentCategories = customerSentiments.map(entry => classifySentiment(entry.sentiment));
  const customerPositive = customerSentimentCategories.filter(s => s === "positive").length;
  const customerNeutral = customerSentimentCategories.filter(s => s === "neutral").length;
  const customerNegative = customerSentimentCategories.filter(s => s === "negative").length;
  
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };
  
  return (
    <Card className="glass-card hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Bot</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sentiment-positive">Positive</span>
                <span className="text-xs font-medium">{botPositive} ({calculatePercentage(botPositive, botSentiments.length)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${calculatePercentage(botPositive, botSentiments.length)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sentiment-neutral">Neutral</span>
                <span className="text-xs font-medium">{botNeutral} ({calculatePercentage(botNeutral, botSentiments.length)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${calculatePercentage(botNeutral, botSentiments.length)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sentiment-negative">Negative</span>
                <span className="text-xs font-medium">{botNegative} ({calculatePercentage(botNegative, botSentiments.length)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${calculatePercentage(botNegative, botSentiments.length)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Customer</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sentiment-positive">Positive</span>
                <span className="text-xs font-medium">{customerPositive} ({calculatePercentage(customerPositive, customerSentiments.length)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${calculatePercentage(customerPositive, customerSentiments.length)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sentiment-neutral">Neutral</span>
                <span className="text-xs font-medium">{customerNeutral} ({calculatePercentage(customerNeutral, customerSentiments.length)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${calculatePercentage(customerNeutral, customerSentiments.length)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sentiment-negative">Negative</span>
                <span className="text-xs font-medium">{customerNegative} ({calculatePercentage(customerNegative, customerSentiments.length)}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${calculatePercentage(customerNegative, customerSentiments.length)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
