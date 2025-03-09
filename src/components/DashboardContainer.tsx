import React from "react";
import { Dashboard } from "./Dashboard";
import { useConversationData } from "@/hooks/useConversationData";
import { Loader2, AlertCircle, Clock, BarChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DashboardContainer() {
  const { data, isLoading, error, alertMessages = [] } = useConversationData();

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

  // Group alerts by type
  const abusiveAlerts = alertMessages?.filter((msg) => msg.type === "abusive") || [];
  const delayAlerts = alertMessages?.filter((msg) => msg.type === "delay") || [];
  const accuracyAlerts = alertMessages?.filter((msg) => msg.type === "accuracy") || [];

  // Show alerts inline
  const alertsSection = alertMessages.length > 0 ? (
    <div className="container mx-auto px-4 mt-4 space-y-2">
      {abusiveAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-destructive">Abusive Content Detected</h3>
          {abusiveAlerts.map((message, index) => (
            <Alert key={`abusive-${index}`} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Abusive content from {message.speaker}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {delayAlerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-amber-600">Slow Response Times Detected</h3>
          {delayAlerts.map((message, index) => (
            <Alert key={`delay-${index}`} variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
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
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-rose-600">Poor Accuracy Detected</h3>
          {accuracyAlerts.map((message, index) => (
            <Alert key={`accuracy-${index}`} variant="default" className="border-rose-500 bg-rose-50 dark:bg-rose-950/30">
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

  // If we get here, we have valid data
  return (
    <>
      {alertsSection}
      <Dashboard data={data} />
    </>
  );
}
