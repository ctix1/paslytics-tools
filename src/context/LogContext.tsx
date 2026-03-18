import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LogEntry {
  id: string;
  name: string;
  sku: string;
  image: string;
  date: string;
  score: number | null;
  type: 'PAS' | 'Marketing' | 'Calculator' | 'Content';
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'date'>) => void;
  deleteLog: (id: string) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('paslytics_logs');
    if (saved) return JSON.parse(saved);
    
    // Initial mock data if empty
    return [
      { id: '1', name: 'Ergonomic Office Chair', sku: 'SKU-88291', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=60&q=80', date: 'Oct 24, 2023 14:22', score: 84, type: 'PAS' },
      { id: '2', name: 'Summer Campaign Plan', sku: 'MKT-44023', image: 'https://images.unsplash.com/photo-1543922596-b3bbaba80649?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 09:15', score: null, type: 'Marketing' },
      { id: '3', name: 'Product Calculator v2', sku: 'CALC-99012', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=60&q=80', date: 'Oct 23, 2023 08:00', score: null, type: 'Calculator' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('paslytics_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'date'>) => {
    const newLog: LogEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, deleteLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};
