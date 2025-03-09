import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { Bot, User, Clock } from "lucide-react";

interface ConversationTimelineProps {
  data: ConversationEntry[];
  isStreaming?: boolean;
  currentStreamingItem?: ConversationEntry | null;
}

export function ConversationTimeline({ 
  data, 
  isStreaming = false,
  currentStreamingItem = null 
}: ConversationTimelineProps) {
  // Removed the useRef and useEffect for auto-scrolling
  
  // Format the timestamp for display
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length === 3) {
      return `${parts[1]}:${parts[2]}`;
    }
    return timeStr;
  };
  
  // Get sentiment indicator
  const getSentimentIndicator = (sentiment: number) => {
    if (sentiment > 0.3) return "positive";
    if (sentiment < -0.3) return "negative";
    return "neutral";
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
    <Card className="glass-card hover-scale max-h-[600px] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Conversation Timeline</span>
          {isStreaming && (
            <span className="text-xs font-normal bg-primary/20 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></span>
              Streaming
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[550px] pr-2">
        <div className="relative space-y-6">
          {/* Vertical Timeline Line */}
          <div className="absolute top-0 bottom-0 left-6 w-px bg-border transform translate-x-px"></div>
          
          {data.map((entry, index) => {
            // Check if this message is new (last added)
            const isNewMessage = index === data.length - 1 && isStreaming;
            
            return (
              <div 
                key={index} 
                className={`relative flex items-start gap-4 transition-all duration-500 ${
                  isNewMessage ? "animate-highlight-new" : "animate-fade-in"
                }`}
                style={{ 
                  animationDelay: isNewMessage ? "0ms" : `${50 * index}ms`,
                }}
              >
                {/* Timeline Node */}
                <div className={`absolute left-6 transform -translate-x-1/2 mt-1.5 transition-all duration-300 ${isNewMessage ? "scale-125" : ""}`}>
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
                <div className={`flex-1 bg-secondary/30 rounded-lg p-3 shadow-sm ${
                  isNewMessage ? "animate-pulse-subtle border border-primary/30" : ""
                }`}>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-medium">
                      {entry.speaker === "Bot" ? "AI Assistant" : "Customer"}
                    </h4>
                    
                    <div className={`pill pill-${getSentimentIndicator(entry.sentiment)}`}>
                      {getSentimentIndicator(entry.sentiment)}
                    </div>
                    
                    {entry.accuracy !== null && (
                      <div className="pill bg-secondary">
                        {getAccuracyIndicator(entry.accuracy)}
                      </div>
                    )}
                    
                    {entry.response_delay !== "null" && (
                      <div className="pill bg-secondary text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{entry.response_delay}</span>
                      </div>
                    )}
                    
                    {isNewMessage && (
                      <div className="pill bg-primary/20 text-primary text-xs">
                        New
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm">{entry.text}</p>
                </div>
              </div>
            );
          })}

          {/* Add typing indicator when streaming */}
          {isStreaming && currentStreamingItem && (
            <div className="relative flex items-start gap-4">
              <div className="absolute left-6 transform -translate-x-1/2 mt-1.5">
                <div className="rounded-full p-1.5 bg-primary/20">
                  <div className="h-3 w-3"></div>
                </div>
              </div>
              
              <div className="min-w-16 text-xs text-muted-foreground flex items-center pt-1.5">
                <Clock className="h-3 w-3 mr-1" />
                <span>now</span>
              </div>
              
              <div className="flex-1 bg-secondary/30 rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <span className="text-sm text-muted-foreground ml-2">
                    {currentStreamingItem.speaker === "Bot" 
                      ? "AI is responding..." 
                      : "Customer is typing..."}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Removed the ref for auto-scrolling */}
        </div>
      </CardContent>
    </Card>
  );
}
