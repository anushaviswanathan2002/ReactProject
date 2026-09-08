import React, { createContext, useContext, useState } from 'react';

/**
 * UIContext - Global context for UI state management
 */
const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('light');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications([...notifications, { ...notification, id }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    sidebarOpen,
    toggleSidebar,
    notifications,
    addNotification,
    removeNotification,
    theme,
    setTheme,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;
