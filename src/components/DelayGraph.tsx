
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";

interface DelayGraphProps {
  data: ConversationEntry[];
}

export function DelayGraph({ data }: DelayGraphProps) {
  // Extract bot entries with delay information
  const delayData = data
    .filter((entry) => entry.speaker === "Bot" && entry.response_delay !== "null")
    .map((entry, index) => {
      // Extract numerical value from delay string (e.g., "1 second" -> 1)
      const delayMatch = entry.response_delay.match(/(\d+)/);
      const delayValue = delayMatch ? parseInt(delayMatch[0], 10) : 0;
      
      // Parse time to get minutes and seconds
      const timeParts = entry.start_time.split(":");
      const timeFormatted = `${timeParts[1]}:${timeParts[2]}`;
      
      return {
        name: `Response ${index + 1}`,
        delay: delayValue,
        time: timeFormatted,
      };
    });
  
  // Calculate average delay
  const avgDelay = delayData.length > 0
    ? delayData.reduce((sum, item) => sum + item.delay, 0) / delayData.length
    : 0;

  return (
    <Card className="glass-card hover-scale h-80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Response Delay</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Avg: {avgDelay.toFixed(1)}s</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-64">
        {delayData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={delayData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tickFormatter={(value) => `${value}s`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} seconds`, "Delay"]}
                labelFormatter={(label) => `${label}`}
                contentStyle={{ 
                  borderRadius: '0.5rem', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              />
              <Bar 
                dataKey="delay" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>No delay data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
