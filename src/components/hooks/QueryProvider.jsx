import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ULTRA AGGRESSIVE CACHE to minimize API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // EXTREME CACHE - 2 HOURS stale, 24 HOURS in memory
      staleTime: 1000 * 60 * 60 * 2, // 2 HOURS
      gcTime: 1000 * 60 * 60 * 24, // 24 HOURS
      
      // DISABLE ALL automatic refetches
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      
      // NEVER retry on rate limit
      retry: (failureCount, error) => {
        const errorMsg = error?.message || '';
        
        // NEVER retry these errors
        if (errorMsg.includes('429') || 
            errorMsg.includes('Rate limit') ||
            errorMsg.includes('rate limit') ||
            errorMsg.includes('Too many requests') ||
            errorMsg.includes('401') || 
            errorMsg.includes('not authenticated')) {
          console.warn('⚠️ Rate limit or auth error - NOT retrying');
          return false;
        }
        
        // Only retry network errors once
        if (errorMsg.includes('Network Error') || 
            errorMsg.includes('Failed to fetch')) {
          return failureCount < 1;
        }
        
        return false;
      },
      
      // LONG retry delays
      retryDelay: (attemptIndex) => {
        return Math.min(15000 * Math.pow(2, attemptIndex), 60000); // 15s, 30s, 60s
      },
      
      // Silent error handling
      onError: (error) => {
        const errorMsg = error?.message || '';
        if (errorMsg.includes('Rate limit') || errorMsg.includes('429')) {
          console.warn('⚠️ Rate limit hit. Using cached data.');
        } else if (errorMsg.includes('not authenticated') || errorMsg.includes('401')) {
          // Silent - auth is handled by AuthGuard
          return;
        } else {
          console.error('Query error:', errorMsg);
        }
      },
      
      networkMode: 'online',
    },
    
    mutations: {
      retry: false, // NEVER retry mutations
      
      onError: (error) => {
        const errorMsg = error?.message || '';
        if (errorMsg.includes('Rate limit') || errorMsg.includes('429')) {
          console.error('⚠️ Rate limit on mutation. Wait 60s and try again.');
        } else {
          console.error('Mutation error:', errorMsg);
        }
      },
    },
  },
});

// AGGRESSIVE QUEUE SYSTEM - Only 2 concurrent queries
let activeQueries = 0;
const MAX_CONCURRENT_QUERIES = 2; // REDUCED from 3
const queryQueue = [];
const DELAY_BETWEEN_QUERIES = 1000; // 1 SECOND delay

// Intercept fetchQuery to implement queue
const originalFetch = queryClient.fetchQuery.bind(queryClient);
queryClient.fetchQuery = async (...args) => {
  // Queue if too many active queries
  if (activeQueries >= MAX_CONCURRENT_QUERIES) {
    console.log('⏳ Query queued. Waiting for slot...');
    await new Promise(resolve => {
      queryQueue.push(resolve);
    });
  }
  
  activeQueries++;
  
  try {
    const result = await originalFetch(...args);
    return result;
  } catch (error) {
    // Check if rate limit error
    if (error?.message?.includes('Rate limit') || error?.message?.includes('429')) {
      console.error('🚨 RATE LIMIT EXCEEDED. Pausing all queries for 60s...');
      // Add 60s delay before next query
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    throw error;
  } finally {
    activeQueries--;
    
    // Process next query in queue with delay
    if (queryQueue.length > 0) {
      const nextResolve = queryQueue.shift();
      setTimeout(nextResolve, DELAY_BETWEEN_QUERIES);
    }
  }
};

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}