# Frontend Utilities Documentation

This directory contains utility functions and helpers used throughout the frontend application.

## Directory Structure

```
utils/
├── urlValidator.js      # URL validation and normalization
├── formatUtils.js        # Data formatting (dates, numbers, durations)
├── storage.js            # localStorage wrapper with error handling
├── clipboard.js          # Clipboard operations
├── helpers.js            # General helper functions
├── constants.js          # Application constants
├── validation.js         # Input validation functions
├── dateUtils.js          # Date manipulation and formatting
├── analytics.js          # Analytics tracking (stub)
└── performance.js        # Performance measurement utilities
```

## Usage Examples

### URL Validation

```javascript
import { validateAndNormalizeUrl } from '../utils/urlValidator';

const result = validateAndNormalizeUrl('example.com');
if (result.isValid) {
  console.log('Normalized URL:', result.normalized);
} else {
  console.error('Error:', result.error);
}
```

### Formatting

```javascript
import { formatDuration, formatNumber, formatDate } from '../utils/formatUtils';

const duration = formatDuration(123456); // "2m 3s"
const number = formatNumber(1234.56, 2); // "1,234.56"
const date = formatDate(new Date()); // "Jan 15, 2024, 2:30 PM"
```

### Storage

```javascript
import { getTestHistory, addToTestHistory } from '../utils/storage';

// Get test history
const history = getTestHistory(10); // Last 10 tests

// Add to history
addToTestHistory({
  url: 'https://example.com',
  score: 85,
  status: 'Excellent'
});
```

### Clipboard

```javascript
import { copyToClipboard, copyJsonToClipboard } from '../utils/clipboard';

// Copy text
await copyToClipboard('Hello World');

// Copy JSON
await copyJsonToClipboard({ key: 'value' });
```

## Best Practices

1. **Always validate user input** using validation utilities before processing
2. **Use storage utilities** instead of direct localStorage access for error handling
3. **Format data consistently** using formatUtils for display
4. **Handle errors gracefully** - all utilities include error handling

