import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ✅ 2. Create the Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes (No refetching)
      cacheTime: 1000 * 60 * 30, // Data stays in RAM for 30 minutes
      refetchOnWindowFocus: false, // Don't refetch just because I clicked the window
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* ✅ 3. Wrap everything with QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)