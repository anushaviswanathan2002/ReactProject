# ReactProject

A modern React application with global state management for UI control.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [UI Context](#ui-context)
  - [Usage](#usage)
  - [API Reference](#api-reference)
  - [Example](#example)
- [Getting Started](#getting-started)

## Features

- **Global UI State Management** - Centralized state for theme, sidebar, and notifications
- **Dark Mode Support** - Toggle between light and dark themes
- **Sidebar Control** - Show/hide sidebar functionality
- **Notification System** - Display notifications with auto-dismiss capability
- **React Hooks** - Easy access via custom `useUI()` hook

## Installation

```bash
npm install
```

## UI Context

The `ui-context.js` file provides a React Context-based solution for managing global UI state across your application.

### Usage

1. **Wrap your app with the UIProvider:**

```jsx
import { UIProvider } from './ui-context';

function App() {
  return (
    <UIProvider>
      <YourAppComponents />
    </UIProvider>
  );
}
```

2. **Use the context in your components:**

```jsx
import { useUI } from './ui-context';

function MyComponent() {
  const { isDarkMode, toggleDarkMode, notifications, addNotification } = useUI();
  
  return (
    <div>
      <button onClick={toggleDarkMode}>
        Current mode: {isDarkMode ? 'Dark' : 'Light'}
      </button>
      <button onClick={() => addNotification('Success!', 'success')}>
        Add Notification
      </button>
    </div>
  );
}
```

### API Reference

The `useUI()` hook provides access to the following properties and methods:

#### State Properties
- **`isDarkMode`** (boolean) - Current theme mode
- **`isSidebarOpen`** (boolean) - Sidebar visibility state
- **`notifications`** (array) - List of active notifications
- **`theme`** (object) - Current theme settings

#### Methods
- **`toggleDarkMode()`** - Toggle between dark and light modes
- **`setSidebarOpen(value)`** - Set sidebar open/closed state
- **`toggleSidebar()`** - Toggle sidebar visibility
- **`addNotification(message, type)`** - Add a notification
  - `message` (string) - Notification message
  - `type` (string) - Notification type: 'success', 'error', 'warning', 'info'
- **`removeNotification(id)`** - Remove a notification by ID
- **`setTheme(newTheme)`** - Update theme settings

### Example

```jsx
import React from 'react';
import { useUI } from './ui-context';

export function Dashboard() {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    isSidebarOpen, 
    toggleSidebar,
    addNotification,
    notifications 
  } = useUI();

  const handleSave = () => {
    addNotification('Changes saved successfully!', 'success');
  };

  return (
    <div style={{ background: isDarkMode ? '#1a1a1a' : '#fff' }}>
      <header>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? 'Hide' : 'Show'} Sidebar
        </button>
        <button onClick={toggleDarkMode}>
          Toggle Theme
        </button>
      </header>
      
      <main>
        <h1>Dashboard</h1>
        <button onClick={handleSave}>Save</button>
      </main>

      <div className="notifications">
        {notifications.map(notif => (
          <div key={notif.id} className={`notif-${notif.type}`}>
            {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Wrap your application with `UIProvider`
5. Use the `useUI()` hook in your components