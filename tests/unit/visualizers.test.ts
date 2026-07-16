import { describe, expect, it } from 'vitest';
import { scenarios } from '@/components/visualizers/AlgorithmVisualizer';

describe('algorithm visualizers', () => {
  it('provides all twelve required, keyboard-operable step sequences', () => {
    expect(Object.keys(scenarios)).toHaveLength(12);
    for (const scenario of Object.values(scenarios)) {
      expect(scenario.title).toBeTruthy();
      expect(scenario.steps.length).toBeGreaterThanOrEqual(3);
      for (const step of scenario.steps) {
        expect(step.values.length).toBeGreaterThan(0);
        expect(step.status).toBeTruthy();
      }
    }
  });
});
