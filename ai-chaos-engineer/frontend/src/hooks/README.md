# React Hooks Documentation

This directory contains custom React hooks used throughout the application.

## Available Hooks

### useWebSocket

Manages WebSocket connection for real-time updates.

```javascript
const { isConnected, lastMessage, messages } = useWebSocket('ws://localhost:3001/ws');
```

### useLocalStorage

Provides localStorage with React state synchronization.

```javascript
const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

### useDebounce

Debounces a value, useful for search inputs.

```javascript
const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

### usePrevious

Tracks previous value of a variable.

```javascript
const prevCount = usePrevious(count);
```

### useClickOutside

Detects clicks outside an element.

```javascript
const ref = useClickOutside(() => setIsOpen(false));
```

### useMediaQuery

Tracks media query matches for responsive design.

```javascript
const isMobile = useMediaQuery('(max-width: 768px)');
```

### useKeyboardShortcuts

Handles keyboard shortcuts throughout the app.

```javascript
useKeyboardShortcuts({
  'Escape': () => handleClose(),
  'Ctrl+K': () => handleSearch()
});
```

## Hook Guidelines

1. **Always return cleanup functions** from useEffect hooks
2. **Use useCallback** for functions returned from hooks
3. **Document hook parameters** and return values
4. **Handle edge cases** (null, undefined, browser compatibility)

