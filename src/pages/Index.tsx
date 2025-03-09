import React from "react";
import { Dashboard } from "@/components/Dashboard";
import { useConversationData } from "@/hooks/useConversationData";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const { data, isLoading, error } = useConversationData();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen p-8 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load conversation data. Please check your connection and try again.
            <div className="mt-2 text-xs opacity-70">{error.message}</div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <Dashboard data={data} />
    </div>
  );
};

export default Index;
