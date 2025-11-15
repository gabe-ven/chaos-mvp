import { 
  captureException, 
  captureMessage, 
  addBreadcrumb 
} from '../src/sentry.js';

describe('Sentry Integration', () => {
  // Suppress console output during tests
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('captureException should not throw without Sentry DSN', () => {
    const error = new Error('Test error');
    
    expect(() => {
      captureException(error, { context: 'test' });
    }).not.toThrow();
  });

  test('captureMessage should not throw without Sentry DSN', () => {
    expect(() => {
      captureMessage('Test message', 'info', { context: 'test' });
    }).not.toThrow();
  });

  test('addBreadcrumb should not throw without Sentry DSN', () => {
    expect(() => {
      addBreadcrumb('User clicked button', 'user', { buttonId: 'submit' });
    }).not.toThrow();
  });

  test('functions should handle various error types', () => {
    const errorTypes = [
      new Error('Standard error'),
      new TypeError('Type error'),
      new ReferenceError('Reference error'),
      { message: 'Plain object error' },
      'String error'
    ];

    errorTypes.forEach(error => {
      expect(() => {
        captureException(error);
      }).not.toThrow();
    });
  });

  test('captureMessage should handle different severity levels', () => {
    const levels = ['info', 'warning', 'error', 'fatal'];

    levels.forEach(level => {
      expect(() => {
        captureMessage('Test message', level);
      }).not.toThrow();
    });
  });

  test('should handle errors with complex context', () => {
    const complexContext = {
      user: { id: 123, email: 'test@example.com' },
      request: { url: '/api/test', method: 'POST' },
      nested: { deep: { value: 'test' } }
    };

    expect(() => {
      captureException(new Error('Test'), complexContext);
    }).not.toThrow();
  });
});

