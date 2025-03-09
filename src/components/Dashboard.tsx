import React from "react";
import { AccuracyCard } from "./AccuracyCard";
import { AccuracyGraph } from "./AccuracyGraph";
import { SentimentAnalysis } from "./SentimentAnalysis";
import { DelayGraph } from "./DelayGraph";
import { ConversationInsights } from "./ConversationInsights";
import { ConversationTimeline } from "./ConversationTimeline";
import { ConversationData, ConversationEntry } from "@/utils/dataTypes";
import { BarChart4, Clock, Heart, MessagesSquare } from "lucide-react";

interface DashboardProps {
  data: ConversationData;
  isStreaming?: boolean;
  currentStreamingItem?: ConversationEntry | null;
}

export function Dashboard({ data, isStreaming = false, currentStreamingItem = null }: DashboardProps) {
  const conversationData = data.conversation;
  
  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* Header */}
      <header className="mb-8 animate-slide-down">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Conversation Analytics
          {isStreaming && <span className="ml-2 text-lg text-primary animate-pulse">• Live</span>}
        </h1>
        <p className="text-muted-foreground">
          {isStreaming 
            ? "Real-time insights and analysis of streaming conversation data" 
            : "Detailed insights and analysis of conversation data"}
        </p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col gap-1 glass-card p-4 rounded-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Messages</h3>
            <MessagesSquare className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold">{conversationData.length}</p>
          <div className="text-xs text-muted-foreground">
            {conversationData.filter(entry => entry.speaker === "Bot").length} bot / {conversationData.filter(entry => entry.speaker === "Customer").length} customer
          </div>
        </div>
        
        <div className="flex flex-col gap-1 glass-card p-4 rounded-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Average Response Time</h3>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold">
            {(() => {
              const delays = conversationData
                .filter(entry => entry.speaker === "Bot" && entry.response_delay !== "null")
                .map(entry => {
                  const match = entry.response_delay.match(/(\d+)/);
                  return match ? parseInt(match[0], 10) : 0;
                });
              
              const avgDelay = delays.length > 0 
                ? delays.reduce((sum, val) => sum + val, 0) / delays.length
                : 0;
              
              return `${avgDelay.toFixed(1)}s`;
            })()}
          </p>
          <div className="text-xs text-muted-foreground">
            Based on {conversationData.filter(entry => entry.speaker === "Bot" && entry.response_delay !== "null").length} responses
          </div>
        </div>
        
        <div className="flex flex-col gap-1 glass-card p-4 rounded-2xl animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Customer Sentiment</h3>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold">
            {(() => {
              const customerSentiments = conversationData
                .filter(entry => entry.speaker === "Customer")
                .map(entry => entry.sentiment);
              
              if (customerSentiments.length === 0) return "N/A";
              
              const avgSentiment = customerSentiments.reduce((sum, val) => sum + val, 0) / customerSentiments.length;
              
              if (avgSentiment > 0.3) return "Positive";
              if (avgSentiment < -0.3) return "Negative";
              return "Neutral";
            })()}
          </p>
          <div className="text-xs text-muted-foreground">
            Based on {conversationData.filter(entry => entry.speaker === "Customer").length} customer messages
          </div>
        </div>
        
        <div className="flex flex-col gap-1 glass-card p-4 rounded-2xl animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Accuracy Rating</h3>
            <BarChart4 className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold">
            {(() => {
              const botEntriesWithAccuracy = conversationData.filter(
                entry => entry.speaker === "Bot" && entry.accuracy !== null
              );
              
              const accuracyValues = botEntriesWithAccuracy.map(entry => entry.accuracy as number);
              const avgAccuracy = accuracyValues.length > 0
                ? accuracyValues.reduce((sum, val) => sum + val, 0) / accuracyValues.length
                : 0;
              
              const percentage = Math.round(((avgAccuracy + 1) / 2) * 100);
              return `${percentage}%`;
            })()}
          </p>
          <div className="text-xs text-muted-foreground">
            Based on {conversationData.filter(entry => entry.speaker === "Bot" && entry.accuracy !== null).length} evaluated responses
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* First Column */}
        <div className="space-y-6">
          <AccuracyCard data={conversationData} />
          <SentimentAnalysis data={conversationData} />
        </div>
        
        {/* Second Column */}
        <div className="lg:col-span-2 space-y-6">
          <AccuracyGraph data={conversationData} />
          <DelayGraph data={conversationData} />
        </div>
      </div>
      
      {/* Insights and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversationInsights data={conversationData} />
        <ConversationTimeline 
          data={conversationData} 
          isStreaming={isStreaming}
          currentStreamingItem={currentStreamingItem}
        />
      </div>
    </div>
  );
}
