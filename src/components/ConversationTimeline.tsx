import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { Bot, User, Clock, AlertTriangle, XCircle, BarChart2 } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, TooltipProps, ReferenceDot
} from 'recharts';

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
  // Format the timestamp for display
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length === 3) {
      return `${parts[1]}:${parts[2]}`;
    }
    return timeStr;
  };
  
  // Get sentiment indicator
  const getSentimentIndicator = (sentiment: number | string) => {
    if (typeof sentiment === 'number') {
      if (sentiment > 0.1) return "positive";
      if (sentiment < -0.1) return "negative";
      return "neutral";
    } else {
      return sentiment; // If it's already a string like "positive", "negative", etc.
    }
  };
  
  // Get sentiment color
  const getSentimentColor = (sentiment: number | string) => {
    let sentimentValue = sentiment;
    
    if (typeof sentiment === 'string') {
      sentimentValue = sentiment === "positive" ? 0.5 : 
                       sentiment === "negative" ? -0.5 : 0;
    }
    
    if ((typeof sentimentValue === 'number' && sentimentValue > 0.1) || sentiment === "positive") {
      return "#16a34a"; // green-600
    }
    if ((typeof sentimentValue === 'number' && sentimentValue < -0.1) || sentiment === "negative") {
      return "#dc2626"; // red-600
    }
    return "#525252"; // neutral-600
  };
  
  // Get accuracy indicator
  const getAccuracyIndicator = (accuracy: number | null) => {
    if (accuracy === null) return null;
    
    if (accuracy > 0.5) return <span className="text-xs text-emerald-500">Excellent</span>;
    if (accuracy > 0) return <span className="text-xs text-blue-500">Good</span>;
    if (accuracy > -0.5) return <span className="text-xs text-amber-500">Fair</span>;
    return <span className="text-xs text-rose-500">Poor</span>;
  };

  // Check if an entry has an alert
  const getAlertType = (entry: ConversationEntry): { type: string, color: string } | null => {
    // Check for abusive content
    if (entry.is_abusive === true) {
      return { type: 'abusive', color: '#ef4444' }; // red-500
    }
    
    // Check for poor accuracy (for bot responses)
    if (entry.speaker === 'Bot' && entry.accuracy !== null && entry.accuracy < -0.2) {
      return { type: 'accuracy', color: '#f97316' }; // orange-500
    }
    
    // Check for significant delay
    if (entry.speaker === 'Bot' && entry.response_delay !== "null") {
      const delayMatch = entry.response_delay.match(/(\d+)/);
      if (delayMatch) {
        const delaySeconds = parseInt(delayMatch[0], 10);
        if (delaySeconds > 3) {
          return { type: 'delay', color: '#eab308' }; // yellow-500
        }
      }
    }
    
    return null;
  };

  // Transform conversation data for the area chart
  const chartData = data.map((entry, index) => {
    // Get sentiment analysis value
    const sentimentValue = typeof entry.sentiment === 'number' ? entry.sentiment : 
                           entry.sentiment_words_analysis === "positive" ? 0.5 :
                           entry.sentiment_words_analysis === "negative" ? -0.5 : 0;
    
    // Scale the sentiment for display (0 to 100 range)
    const scaledSentimentValue = Math.min(90, Math.max(10, ((sentimentValue + 1) / 2) * 80 + 10));
    
    // Check if this entry has an alert
    const alert = getAlertType(entry);
    
    return {
      name: formatTime(entry.start_time),
      index: index,
      customer: entry.speaker === "Customer" ? scaledSentimentValue : 0,
      bot: entry.speaker === "Bot" ? scaledSentimentValue : 0,
      text: entry.text.substring(0, 30) + (entry.text.length > 30 ? "..." : ""),
      sentiment: typeof entry.sentiment === 'number' ? 
                (entry.sentiment > 0.1 ? "positive" : entry.sentiment < -0.1 ? "negative" : "neutral") :
                entry.sentiment_words_analysis || "neutral",
      speaker: entry.speaker,
      alert: alert ? alert.type : null,
      alertColor: alert ? alert.color : null,
      fullEntry: entry
    };
  });

  // Custom tooltip for the area chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/90 border border-border p-2 rounded-md shadow-md text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-violet-500">{data.speaker === "Customer" ? "Customer speaking" : ""}</p>
          <p className="text-blue-500">{data.speaker === "Bot" ? "AI Assistant speaking" : ""}</p>
          <p className="mt-1">{data.text}</p>
          <p className={`mt-1 ${
            data.sentiment === "positive" ? "text-emerald-500" : 
            data.sentiment === "negative" ? "text-rose-500" : "text-neutral-500"
          }`}>
            Sentiment: {data.sentiment}
          </p>
          
          {/* Alert information */}
          {data.alert && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="font-medium text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {data.alert === 'abusive' && 'Abusive Content Detected'}
                {data.alert === 'accuracy' && 'Poor Accuracy Response'}
                {data.alert === 'delay' && 'Significant Response Delay'}
              </p>
              {data.alert === 'delay' && data.fullEntry.response_delay !== "null" && (
                <p className="text-amber-600">Delay: {data.fullEntry.response_delay}</p>
              )}
              {data.alert === 'accuracy' && data.fullEntry.accuracy !== null && (
                <p className="text-orange-600">
                  Accuracy: {Math.round(((data.fullEntry.accuracy + 1) / 2) * 100)}%
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'abusive':
        return <XCircle className="h-3 w-3" />;
      case 'accuracy':
        return <BarChart2 className="h-3 w-3" />;
      case 'delay':
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
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
        <div className="space-y-6">
          {/* Area Chart Visualization */}
          <div className="h-[250px] w-full mb-4 border border-border/50 rounded-lg overflow-hidden relative">
            {/* Alert Legend */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 bg-background/70 p-1 rounded text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Abusive Content</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Poor Accuracy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Response Delay</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCustomer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  axisLine={{ stroke: '#e5e7eb' }} 
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  hide={true}
                  domain={[0, 100]} 
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="customer" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCustomer)" 
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 1, fill: 'white' }}
                  name="Customer"
                />
                <Area 
                  type="monotone" 
                  dataKey="bot" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBot)" 
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 1, fill: 'white' }}
                  name="AI Assistant"
                />
                
                {/* Alert markers */}
                {chartData.map((entry, index) => {
                  if (entry.alert) {
                    const y = entry.speaker === "Customer" ? entry.customer : entry.bot;
                    return (
                      <ReferenceDot
                        key={`alert-${index}`}
                        x={entry.name}
                        y={y}
                        r={6}
                        fill={entry.alertColor || "#ef4444"}
                        stroke="#fff"
                        strokeWidth={2}
                        strokeOpacity={0.8}
                      />
                    );
                  }
                  return null;
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span>Customer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>AI Assistant</span>
            </div>
          </div>
          
          {/* Streaming indicator */}
          {isStreaming && currentStreamingItem && (
            <div className="flex justify-end mb-2">
              <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></span>
                {currentStreamingItem.speaker === 'Bot' ? 'AI responding...' : 'Customer typing...'}
              </div>
            </div>
          )}
          
          {/* Messages List */}
          <div className="relative space-y-6">
            {/* Vertical Timeline Line */}
            <div className="absolute top-0 bottom-0 left-6 w-px bg-border transform translate-x-px"></div>
            
           
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
