
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry } from "@/utils/dataTypes";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AccuracyGraphProps {
  data: ConversationEntry[];
}

export function AccuracyGraph({ data }: AccuracyGraphProps) {
  // Extract bot entries with accuracy scores and transform for chart
  const chartData = data
    .filter((entry) => entry.speaker === "Bot" && entry.accuracy_scale !== null)
    .map((entry, index) => {
      // Parse time to get minutes and seconds
      const timeParts = entry.start_time.split(":");
      const timeFormatted = `${timeParts[1]}:${timeParts[2]}`;
      
      return {
        name: `Response ${index + 1}`,
        accuracy: entry.accuracy_scale,
        time: timeFormatted,
      };
    });

  // Format tooltip value to show percentage
  const formatTooltipValue = (value: number) => {
    const percentage = Math.round(((value + 1) / 2) * 100);
    return `${percentage}%`;
  };

  return (
    <Card className="glass-card hover-scale h-80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Accuracy Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              domain={[-1, 1]} 
              ticks={[-1, -0.5, 0, 0.5, 1]} 
              tickFormatter={(value) => `${Math.round(((value + 1) / 2) * 100)}%`} 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip 
              formatter={(value: number) => formatTooltipValue(value)}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ 
                borderRadius: '0.5rem', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
