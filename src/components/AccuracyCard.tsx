
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { ChevronUp, ChevronDown, Minus } from "lucide-react";

interface AccuracyCardProps {
  data: ConversationEntry[];
}

export function AccuracyCard({ data }: AccuracyCardProps) {
  // Extract bot entries with accuracy scores
  const botEntriesWithAccuracy = data.filter(
    (entry) => entry.speaker === "Bot" && entry.accuracy_scale !== null
  );
  
  // Calculate average accuracy
  const accuracyValues = botEntriesWithAccuracy.map((entry) => entry.accuracy_scale as number);
  const avgAccuracy = accuracyValues.length > 0
    ? accuracyValues.reduce((sum, val) => sum + val, 0) / accuracyValues.length
    : 0;
  
  // Calculate percentage (range from -1 to 1 mapped to 0-100%)
  const percentage = Math.round(((avgAccuracy + 1) / 2) * 100);
  
  // Get descriptive text based on accuracy
  const getAccuracyText = () => {
    if (avgAccuracy > 0.5) return "Excellent";
    if (avgAccuracy > 0) return "Good";
    if (avgAccuracy > -0.5) return "Fair";
    return "Poor";
  };
  
  // Get color based on accuracy
  const getAccuracyColor = () => {
    if (avgAccuracy > 0.5) return "text-emerald-500";
    if (avgAccuracy > 0) return "text-blue-500";
    if (avgAccuracy > -0.5) return "text-amber-500";
    return "text-rose-500";
  };
  
  // Get icon based on accuracy trend
  const getAccuracyIcon = () => {
    if (avgAccuracy > 0.3) return <ChevronUp className="h-5 w-5 text-emerald-500" />;
    if (avgAccuracy < -0.3) return <ChevronDown className="h-5 w-5 text-rose-500" />;
    return <Minus className="h-5 w-5 text-blue-500" />;
  };

  return (
    <Card className="overflow-hidden glass-card hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Accuracy Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={`text-3xl font-semibold ${getAccuracyColor()}`}>
              {percentage}%
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {getAccuracyIcon()}
              <span>{getAccuracyText()}</span>
            </p>
          </div>
          
          <div className="h-24 w-24 relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={`${getAccuracyColor()} stroke-current`}
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {accuracyValues.length} responses
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
