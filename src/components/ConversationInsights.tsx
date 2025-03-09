
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationEntry, Insight } from "@/utils/dataTypes";
import { useInsights } from "@/hooks/useInsights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Lightbulb, Clock, HeartHandshake, MessageSquare } from "lucide-react";

interface ConversationInsightsProps {
  data: ConversationEntry[];
}

export function ConversationInsights({ data }: ConversationInsightsProps) {
  const insights = useInsights(data);

  // Group insights by type
  const generalInsights = insights.filter(insight => insight.type === "general");
  const accuracyInsights = insights.filter(insight => insight.type === "accuracy");
  const sentimentInsights = insights.filter(insight => insight.type === "sentiment");
  const delayInsights = insights.filter(insight => insight.type === "delays");
  const interactionInsights = insights.filter(insight => insight.type === "interaction");
  
  // Helper to render insights list
  const renderInsightsList = (insightList: Insight[]) => {
    if (insightList.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <p>No insights available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {insightList.map((insight, index) => (
          <div key={index} className="p-4 bg-secondary/50 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <h4 className="font-medium mb-1">{insight.title}</h4>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>
    );
  };
  
  // Icon mapping for tabs
  const getTabIcon = (type: string) => {
    switch (type) {
      case "general":
        return <Lightbulb className="h-4 w-4" />;
      case "accuracy":
        return <BarChart3 className="h-4 w-4" />;
      case "sentiment":
        return <HeartHandshake className="h-4 w-4" />;
      case "delays":
        return <Clock className="h-4 w-4" />;
      case "interaction":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card className="glass-card hover-scale">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Conversation Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              {getTabIcon("general")}
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="flex items-center gap-1">
              {getTabIcon("accuracy")}
              <span className="hidden sm:inline">Accuracy</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-1">
              {getTabIcon("sentiment")}
              <span className="hidden sm:inline">Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="delays" className="flex items-center gap-1">
              {getTabIcon("delays")}
              <span className="hidden sm:inline">Delays</span>
            </TabsTrigger>
            <TabsTrigger value="interaction" className="flex items-center gap-1">
              {getTabIcon("interaction")}
              <span className="hidden sm:inline">Flow</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-0">
            {renderInsightsList(generalInsights)}
          </TabsContent>
          
          <TabsContent value="accuracy" className="mt-0">
            {renderInsightsList(accuracyInsights)}
          </TabsContent>
          
          <TabsContent value="sentiment" className="mt-0">
            {renderInsightsList(sentimentInsights)}
          </TabsContent>
          
          <TabsContent value="delays" className="mt-0">
            {renderInsightsList(delayInsights)}
          </TabsContent>
          
          <TabsContent value="interaction" className="mt-0">
            {renderInsightsList(interactionInsights)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
