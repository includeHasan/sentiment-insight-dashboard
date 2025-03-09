import React, { useState, useEffect } from "react";
import { Dashboard } from "./Dashboard";
import { useStreamingConversationData } from "@/hooks/useStreamingConversationData";
import { Loader2, AlertCircle, Clock, BarChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function DashboardContainer() {
  const { 
    data, 
    isLoading, 
    error, 
    alertMessages = [],
    progress,
    streamComplete,
    currentStreamingItem,
    totalItems
  } = useStreamingConversationData(3000); // 1.5 seconds per message
  
  // Track the most recently added alerts
  const [recentAlerts, setRecentAlerts] = useState<typeof alertMessages>([]);
  
  // Update recent alerts when alertMessages changes
  useEffect(() => {
    // When new alerts appear, update recentAlerts
    if (alertMessages.length > 0) {
      const newAlerts = alertMessages.filter(
        alert => !recentAlerts.some(ra => 
          ra.text === alert.text && ra.type === alert.type
        )
      );
      
      if (newAlerts.length > 0) {
        setRecentAlerts(newAlerts);
      }
    }
  }, [alertMessages]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading conversation data...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <p className="text-lg font-medium mb-2">Failed to load data</p>
        <p className="text-muted-foreground text-center max-w-md">
          {error.message}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Validate data structure
  if (!data?.conversation || !Array.isArray(data.conversation)) {
    console.error("Invalid data structure:", data);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <p className="text-lg font-medium mb-2">Invalid data format</p>
        <p className="text-muted-foreground text-center max-w-md">
          The data from the server is missing the conversation property or it's not an array.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Group alerts by type - only show most recent alerts
  const abusiveAlerts = recentAlerts.filter((msg) => msg.type === "abusive") || [];
  const delayAlerts = recentAlerts.filter((msg) => msg.type === "delay") || [];
  const accuracyAlerts = recentAlerts.filter((msg) => msg.type === "accuracy") || [];

  // Show alerts inline - these are only the most recent alerts that appeared
  const alertsSection = recentAlerts.length > 0 ? (
    <div className="container mx-auto px-4 mt-4 space-y-2">
      {abusiveAlerts.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          <h3 className="text-sm font-medium text-destructive">Abusive Content Detected</h3>
          {abusiveAlerts.map((message, index) => (
            <Alert key={`abusive-${index}`} variant="destructive" className="animate-highlight-new">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Abusive content from {message.speaker}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {delayAlerts.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          <h3 className="text-sm font-medium text-amber-600">Slow Response Times Detected</h3>
          {delayAlerts.map((message, index) => (
            <Alert key={`delay-${index}`} variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950/30 animate-highlight-new">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700">Response delay: {message.value}s</AlertTitle>
              <AlertDescription className="text-amber-600">
                {message.text.substring(0, 100)}
                {message.text.length > 100 ? "..." : ""}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {accuracyAlerts.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          <h3 className="text-sm font-medium text-rose-600">Poor Accuracy Detected</h3>
          {accuracyAlerts.map((message, index) => (
            <Alert key={`accuracy-${index}`} variant="default" className="border-rose-500 bg-rose-50 dark:bg-rose-950/30 animate-highlight-new">
              <BarChart className="h-4 w-4 text-rose-600" />
              <AlertTitle className="text-rose-700">
                Accuracy score: {Math.round(((Number(message.value) + 1) / 2) * 100)}%
              </AlertTitle>
              <AlertDescription className="text-rose-600">
                {message.text.substring(0, 100)}
                {message.text.length > 100 ? "..." : ""}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  ) : null;

  // Show streaming progress indicator if not complete
  const streamingIndicator = !streamComplete ? (
    <div className="container mx-auto px-4 py-2 flex items-center gap-4">
      <div className="flex-1">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        {Math.round(progress)}% ({data?.conversation?.length || 0})
      </div>
      {currentStreamingItem && (
        <div className="flex items-center gap-1 text-sm bg-primary/10 px-2 py-1 rounded-md">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span>Processing: {currentStreamingItem.speaker}</span>
        </div>
      )}
    </div>
  ) : null;

  // If we get here, we have valid data
  return (
    <>
      {/* {alertsSection} */}
      {streamingIndicator}
      <Dashboard 
        data={data} 
        isStreaming={!streamComplete} 
        currentStreamingItem={currentStreamingItem} 
      />
    </>
  );
}
