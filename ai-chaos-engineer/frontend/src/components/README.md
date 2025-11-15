# Frontend Components Documentation

This directory contains all React components used in the application.

## Component Structure

```
components/
├── RunForm.jsx           # Main form for URL input and test submission
├── ReportViewer.jsx      # Displays test results and report
├── TestHistory.jsx       # Shows history of previous tests
├── ErrorBoundary.jsx     # Catches and handles React errors
├── LoadingSkeleton.jsx   # Loading state placeholders
├── Modal.jsx             # Reusable modal/dialog component
├── Tooltip.jsx           # Tooltip component for help text
├── StatusIndicator.jsx   # Connection/status indicators
└── ProgressBar.jsx       # Progress bar component
```

## Component Usage

### RunForm

Main form component for submitting URLs and running chaos tests.

```jsx
<RunForm
  onReportReceived={(report) => setReport(report)}
  loading={loading}
  setLoading={setLoading}
  liveEvents={liveEvents}
/>
```

### ReportViewer

Displays comprehensive test results with export and copy functionality.

```jsx
<ReportViewer
  report={report}
  loading={loading}
  onBack={() => setReport(null)}
/>
```

### ErrorBoundary

Wraps the application to catch and handle errors gracefully.

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Modal

Reusable modal component with backdrop and keyboard support.

```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
</Modal>
```

## Component Guidelines

1. **Always include JSDoc comments** for component props and functionality
2. **Handle loading and error states** appropriately
3. **Use semantic HTML** for accessibility
4. **Follow consistent naming** conventions
5. **Keep components focused** on a single responsibility

