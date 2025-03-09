import { useState, useEffect } from "react";
import { ConversationData } from "@/utils/dataTypes";
import { useToast } from "@/components/ui/use-toast";

interface AlertMessage {
  type: 'abusive' | 'delay' | 'accuracy';
  text: string;
  speaker: string;
  value?: string | number;
}

export function useConversationData() {
  const [data, setData] = useState<ConversationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [alertMessages, setAlertMessages] = useState<AlertMessage[]>([]);
  const { toast } = useToast();

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
        
        // Collect different types of alerts
        const alerts: AlertMessage[] = [];
        
        // Process data and check for alerts
        if (Array.isArray(jsonData)) {
          jsonData.forEach(entry => {
            // Check for abusive content
            if (entry.is_abusive === true) {
              alerts.push({
                type: 'abusive',
                text: entry.text,
                speaker: entry.speaker
              });
            }
            
            // Check for long response times (more than 1 second)
            if (entry.speaker === 'Bot' && entry.response_delay !== "null") {
              const delayMatch = entry.response_delay.match(/(\d+)/);
              if (delayMatch) {
                const delaySeconds = parseInt(delayMatch[0], 10);
                if (delaySeconds > 1) {
                  alerts.push({
                    type: 'delay',
                    text: entry.text,
                    speaker: entry.speaker,
                    value: delaySeconds
                  });
                }
              }
            }
            
            // Check for negative accuracy
            if (entry.speaker === 'Bot' && entry.accuracy !== null && entry.accuracy < 0) {
              alerts.push({
                type: 'accuracy',
                text: entry.text,
                speaker: entry.speaker,
                value: entry.accuracy
              });
            }
          });
          
          setData({ conversation: jsonData });
        } 
        else if (jsonData.conversation && Array.isArray(jsonData.conversation)) {
          jsonData.conversation.forEach(entry => {
            // Check for abusive content
            if (entry.is_abusive === true) {
              alerts.push({
                type: 'abusive',
                text: entry.text,
                speaker: entry.speaker
              });
            }
            
            // Check for long response times (more than 1 second)
            if (entry.speaker === 'Bot' && entry.response_delay !== "null") {
              const delayMatch = entry.response_delay.match(/(\d+)/);
              if (delayMatch) {
                const delaySeconds = parseInt(delayMatch[0], 10);
                if (delaySeconds > 1) {
                  alerts.push({
                    type: 'delay',
                    text: entry.text,
                    speaker: entry.speaker,
                    value: delaySeconds
                  });
                }
              }
            }
            
            // Check for negative accuracy
            if (entry.speaker === 'Bot' && entry.accuracy !== null && entry.accuracy < 0) {
              alerts.push({
                type: 'accuracy',
                text: entry.text,
                speaker: entry.speaker,
                value: entry.accuracy
              });
            }
          });
          
          setData(jsonData);
        } 
        else {
          throw new Error("Unexpected data structure from API");
        }
        
        // Store alert messages
        setAlertMessages(alerts);
        
      } catch (err) {
        console.error("Error fetching conversation data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show toast notifications for alerts
  useEffect(() => {
    if (alertMessages.length > 0) {
      alertMessages.forEach((message) => {
        let title = '';
        let description = '';
        
        switch (message.type) {
          case 'abusive':
            title = `Abusive content detected from ${message.speaker}`;
            description = message.text;
            break;
          case 'delay':
            title = `Long response delay (${message.value}s)`;
            description = `Response: "${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}"`;
            break;
          case 'accuracy':
            title = `Poor accuracy score (${Math.round(((message.value as number) + 1) / 2 * 100)}%)`;
            description = `Response: "${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}"`;
            break;
        }
        
        toast({
          variant: "destructive",
          title,
          description,
          duration: 10000, // 10 seconds
        });
      });
    }
  }, [alertMessages, toast]);

  return {
    data,
    isLoading,
    error,
    alertMessages
  };
}
