import { useState, useEffect } from "react";
import { ConversationData, ConversationEntry } from "@/utils/dataTypes";
import { useConversationData } from "./useConversationData";

interface AlertMessage {
  type: 'abusive' | 'delay' | 'accuracy';
  text: string;
  speaker: string;
  value?: string | number;
  entryIndex: number;  // Add an index to track which entry this alert belongs to
}

export function useStreamingConversationData(streamingSpeed = 1500) {
  // Get the full conversation data
  const { data: fullData, isLoading, error } = useConversationData();
  
  // State for streaming data
  const [streamedData, setStreamedData] = useState<ConversationData | null>(null);
  const [streamComplete, setStreamComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStreamingItem, setCurrentStreamingItem] = useState<ConversationEntry | null>(null);
  
  // Track all alert messages and currently shown alerts separately
  const [allAlertMessages, setAllAlertMessages] = useState<AlertMessage[]>([]);
  const [visibleAlertMessages, setVisibleAlertMessages] = useState<AlertMessage[]>([]);
  
  // Detect all potential alerts when full data is available
  useEffect(() => {
    if (!isLoading && fullData?.conversation) {
      const alerts: AlertMessage[] = [];
      
      fullData.conversation.forEach((entry, index) => {
        // Check for abusive content
        if (entry.is_abusive === true) {
          alerts.push({
            type: 'abusive',
            text: entry.text,
            speaker: entry.speaker,
            entryIndex: index
          });
        }
        
        // Check for long response times
        if (entry.speaker === 'Bot' && entry.response_delay !== "null") {
          const delayMatch = entry.response_delay.match(/(\d+)/);
          if (delayMatch) {
            const delaySeconds = parseInt(delayMatch[0], 10);
            if (delaySeconds > 1) {
              alerts.push({
                type: 'delay',
                text: entry.text,
                speaker: entry.speaker,
                value: delaySeconds,
                entryIndex: index
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
            value: entry.accuracy,
            entryIndex: index
          });
        }
      });
      
      setAllAlertMessages(alerts);
    }
  }, [fullData, isLoading]);
  
  // Stream the data
  useEffect(() => {
    if (!isLoading && fullData?.conversation) {
      // Initialize with empty conversation array
      if (!streamedData) {
        setStreamedData({ conversation: [] });
        return;
      }
      
      // If we haven't streamed all messages yet
      if (currentIndex < fullData.conversation.length) {
        const timer = setTimeout(() => {
          // Set the currently streaming item
          setCurrentStreamingItem(fullData.conversation[currentIndex]);
          
          // Add the next message
          setStreamedData(prev => {
            if (!prev) return { conversation: [fullData.conversation[currentIndex]] };
            
            return {
              conversation: [
                ...prev.conversation,
                fullData.conversation[currentIndex]
              ]
            };
          });
          
          // Update visible alerts - show only alerts for messages we've processed so far
          setVisibleAlertMessages(
            allAlertMessages.filter(alert => alert.entryIndex <= currentIndex)
          );
          
          // Increment index
          setCurrentIndex(prevIndex => prevIndex + 1);
        }, streamingSpeed);
        
        return () => clearTimeout(timer);
      } else if (!streamComplete) {
        // All messages streamed
        setStreamComplete(true);
        setCurrentStreamingItem(null);
      }
    }
  }, [fullData, isLoading, currentIndex, streamedData, streamComplete, streamingSpeed, allAlertMessages]);
  
  return {
    data: streamedData,
    isLoading,
    error,
    alertMessages: visibleAlertMessages,
    streamComplete,
    currentStreamingItem,
    progress: fullData?.conversation?.length 
      ? (currentIndex / fullData.conversation.length) * 100 
      : 0,
    totalItems: fullData?.conversation?.length || 0
  };
}
