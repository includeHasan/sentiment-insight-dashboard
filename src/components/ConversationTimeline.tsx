
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { Bot, User, Clock } from "lucide-react";

interface ConversationTimelineProps {
  data: ConversationEntry[];
}

export function ConversationTimeline({ data }: ConversationTimelineProps) {
  // Format the timestamp for display
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length === 3) {
      return `${parts[1]}:${parts[2]}`;
    }
    return timeStr;
  };
  
  // Get sentiment class
  const getSentimentClass = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "pill-positive";
      case "negative":
        return "pill-negative";
      default:
        return "pill-neutral";
    }
  };
  
  // Get accuracy indicator
  const getAccuracyIndicator = (accuracy: number | null) => {
    if (accuracy === null) return null;
    
    if (accuracy > 0.5) return <span className="text-xs text-emerald-500">Excellent</span>;
    if (accuracy > 0) return <span className="text-xs text-blue-500">Good</span>;
    if (accuracy > -0.5) return <span className="text-xs text-amber-500">Fair</span>;
    return <span className="text-xs text-rose-500">Poor</span>;
  };

  return (
    <Card className="glass-card hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Conversation Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Vertical Timeline Line */}
          <div className="absolute top-0 bottom-0 left-6 w-px bg-border transform translate-x-px"></div>
          
          {data.map((entry, index) => (
            <div 
              key={index} 
              className="relative flex items-start gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Node */}
              <div className="absolute left-6 transform -translate-x-1/2 mt-1.5">
                <div className={`rounded-full p-1.5 ${
                  entry.speaker === "Bot" 
                    ? "bg-blue-100 text-blue-600"
                    : "bg-violet-100 text-violet-600"
                }`}>
                  {entry.speaker === "Bot" ? (
                    <Bot className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                </div>
              </div>
              
              {/* Timestamp */}
              <div className="min-w-16 text-xs text-muted-foreground flex items-center pt-1.5">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTime(entry.start_time)}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-secondary/30 rounded-lg p-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h4 className="text-sm font-medium">
                    {entry.speaker === "Bot" ? "AI Assistant" : "Customer"}
                  </h4>
                  
                  <div className={`pill ${getSentimentClass(entry.sentiment_words_analysis)}`}>
                    {entry.sentiment_words_analysis}
                  </div>
                  
                  {entry.accuracy_scale !== null && (
                    <div className="pill bg-secondary">
                      {getAccuracyIndicator(entry.accuracy_scale)}
                    </div>
                  )}
                  
                  {entry.response_delay !== "null" && (
                    <div className="pill bg-secondary text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{entry.response_delay}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm">{entry.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
