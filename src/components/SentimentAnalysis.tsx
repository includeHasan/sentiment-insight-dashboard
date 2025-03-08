
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle } from "lucide-react";

interface SentimentAnalysisProps {
  data: ConversationEntry[];
}

export function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  // Process data for bot sentiment
  const botSentiments = data.filter(entry => entry.speaker === "Bot");
  const botWordSentiments = botSentiments.map(entry => entry.sentiment_words_analysis);
  const botToneSentiments = botSentiments.map(entry => entry.sentiment_tone);
  
  // Process data for customer sentiment
  const customerSentiments = data.filter(entry => entry.speaker === "Customer");
  const customerWordSentiments = customerSentiments.map(entry => entry.sentiment_words_analysis);
  const customerToneSentiments = customerSentiments.map(entry => entry.sentiment_tone);
  
  // Calculate percentages for bot
  const botPositiveWords = botWordSentiments.filter(s => s === "positive").length;
  const botNeutralWords = botWordSentiments.filter(s => s === "neutral").length;
  const botNegativeWords = botWordSentiments.filter(s => s === "negative").length;
  
  const botPositiveTone = botToneSentiments.filter(s => s === "positive").length;
  const botNeutralTone = botToneSentiments.filter(s => s === "neutral").length;
  const botNegativeTone = botToneSentiments.filter(s => s === "negative").length;
  
  // Calculate percentages for customer
  const customerPositiveWords = customerWordSentiments.filter(s => s === "positive").length;
  const customerNeutralWords = customerWordSentiments.filter(s => s === "neutral").length;
  const customerNegativeWords = customerWordSentiments.filter(s => s === "negative").length;
  
  const customerPositiveTone = customerToneSentiments.filter(s => s === "positive").length;
  const customerNeutralTone = customerToneSentiments.filter(s => s === "neutral").length;
  const customerNegativeTone = customerToneSentiments.filter(s => s === "negative").length;
  
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };
  
  return (
    <Card className="glass-card hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="words">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="words" className="flex items-center gap-1 w-1/2">
              <MessageCircle className="h-4 w-4" />
              <span>Word Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="tone" className="flex items-center gap-1 w-1/2">
              <Heart className="h-4 w-4" />
              <span>Tone Analysis</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="words" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Bot</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-positive">Positive</span>
                    <span className="text-xs font-medium">{botPositiveWords} ({calculatePercentage(botPositiveWords, botSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${calculatePercentage(botPositiveWords, botSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-neutral">Neutral</span>
                    <span className="text-xs font-medium">{botNeutralWords} ({calculatePercentage(botNeutralWords, botSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${calculatePercentage(botNeutralWords, botSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-negative">Negative</span>
                    <span className="text-xs font-medium">{botNegativeWords} ({calculatePercentage(botNegativeWords, botSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${calculatePercentage(botNegativeWords, botSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Customer</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-positive">Positive</span>
                    <span className="text-xs font-medium">{customerPositiveWords} ({calculatePercentage(customerPositiveWords, customerSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${calculatePercentage(customerPositiveWords, customerSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-neutral">Neutral</span>
                    <span className="text-xs font-medium">{customerNeutralWords} ({calculatePercentage(customerNeutralWords, customerSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${calculatePercentage(customerNeutralWords, customerSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-negative">Negative</span>
                    <span className="text-xs font-medium">{customerNegativeWords} ({calculatePercentage(customerNegativeWords, customerSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${calculatePercentage(customerNegativeWords, customerSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tone" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Bot</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-positive">Positive</span>
                    <span className="text-xs font-medium">{botPositiveTone} ({calculatePercentage(botPositiveTone, botSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${calculatePercentage(botPositiveTone, botSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-neutral">Neutral</span>
                    <span className="text-xs font-medium">{botNeutralTone} ({calculatePercentage(botNeutralTone, botSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${calculatePercentage(botNeutralTone, botSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-negative">Negative</span>
                    <span className="text-xs font-medium">{botNegativeTone} ({calculatePercentage(botNegativeTone, botSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${calculatePercentage(botNegativeTone, botSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Customer</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-positive">Positive</span>
                    <span className="text-xs font-medium">{customerPositiveTone} ({calculatePercentage(customerPositiveTone, customerSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${calculatePercentage(customerPositiveTone, customerSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-neutral">Neutral</span>
                    <span className="text-xs font-medium">{customerNeutralTone} ({calculatePercentage(customerNeutralTone, customerSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${calculatePercentage(customerNeutralTone, customerSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sentiment-negative">Negative</span>
                    <span className="text-xs font-medium">{customerNegativeTone} ({calculatePercentage(customerNegativeTone, customerSentiments.length)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${calculatePercentage(customerNegativeTone, customerSentiments.length)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
