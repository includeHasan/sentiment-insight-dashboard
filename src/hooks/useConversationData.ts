
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ConversationEntry } from '@/utils/dataTypes';
import { toast } from '@/components/ui/use-toast';

// You should replace this with your actual backend URL
const API_URL = 'http://192.168.x.x:8000/data';

export const useConversationData = () => {
  const [data, setData] = useState<ConversationEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL);
        
        // Extract conversation data from response
        if (response.data && response.data.conversation) {
          setData(response.data.conversation);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching conversation data:', error);
        setError(error);
        toast({
          title: "Error fetching data",
          description: error.message || "Could not load conversation data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
