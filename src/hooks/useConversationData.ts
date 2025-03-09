import { useState, useEffect } from "react";
import { ConversationData } from "@/utils/dataTypes";

export function useConversationData() {
  const [data, setData] = useState<ConversationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/data");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        console.log("API Response:", jsonData);
        
        // Process data
        if (Array.isArray(jsonData)) {
          setData({ conversation: jsonData });
        } 
        else if (jsonData.conversation && Array.isArray(jsonData.conversation)) {
          setData(jsonData);
        } 
        else {
          throw new Error("Unexpected data structure from API");
        }
        
      } catch (err) {
        console.error("Error fetching conversation data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
