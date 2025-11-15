import { sleep, measureTime } from '../src/utils/timers.js';

describe('Timer Utilities', () => {
  test('sleep should wait for specified duration', async () => {
    const startTime = Date.now();
    await sleep(100);
    const duration = Date.now() - startTime;

    expect(duration).toBeGreaterThanOrEqual(90); // Allow some margin
    expect(duration).toBeLessThan(150);
  });

  test('measureTime should measure execution duration', async () => {
    const testFn = async () => {
      await sleep(50);
      return 'result';
    };

    const { result, duration } = await measureTime(testFn);

    expect(result).toBe('result');
    expect(duration).toBeGreaterThanOrEqual(40);
    expect(duration).toBeLessThan(100);
  });

  test('measureTime should handle synchronous functions', async () => {
    const testFn = () => {
      return 42;
    };

    const { result, duration } = await measureTime(testFn);

    expect(result).toBe(42);
    expect(duration).toBeGreaterThanOrEqual(0);
    expect(duration).toBeLessThan(10);
  });

  test('measureTime should handle errors', async () => {
    const testFn = async () => {
      throw new Error('Test error');
    };

    await expect(measureTime(testFn)).rejects.toThrow('Test error');
  });

  test('sleep with zero duration', async () => {
    const startTime = Date.now();
    await sleep(0);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(10);
  });
});

