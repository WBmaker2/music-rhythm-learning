import { describe, it, expect } from 'vitest';
import { judge, pointsFor, accuracy } from './judgment';

describe('judge', () => {
  it('perfect within 50ms', () => {
    expect(judge(0)).toBe('Perfect');
    expect(judge(49)).toBe('Perfect');
    expect(judge(-50)).toBe('Perfect');
  });
  it('good within 120ms', () => {
    expect(judge(51)).toBe('Good');
    expect(judge(120)).toBe('Good');
  });
  it('miss beyond', () => {
    expect(judge(121)).toBe('Miss');
    expect(judge(500)).toBe('Miss');
  });
});

describe('pointsFor', () => {
  it('base points', () => {
    expect(pointsFor('Perfect', 0)).toBe(100);
    expect(pointsFor('Good', 0)).toBe(50);
    expect(pointsFor('Miss', 0)).toBe(0);
  });
  it('combo multiplier', () => {
    expect(pointsFor('Perfect', 5)).toBe(150);
  });
});

describe('accuracy', () => {
  it('ratio', () => {
    expect(accuracy(3,4)).toBe(0.75);
    expect(accuracy(0,0)).toBe(0);
  });
});
