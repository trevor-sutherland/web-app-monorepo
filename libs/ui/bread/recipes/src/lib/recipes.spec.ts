import { breadRecipes } from './catalog';
import { formatTotalHours, totalPrepHours } from './preparation';
import {
  defaultProjectTitle,
  formulaLines,
  hydrationPercent,
  scalePercent,
  scaleRecipeToActuals,
} from './scale';

describe('scalePercent', () => {
  it('rounds baker percentages to whole grams', () => {
    expect(scalePercent(80, 500)).toBe(400);
    expect(scalePercent(0.3, 1000)).toBe(3);
  });

  it('returns 0 for a non-numeric percentage', () => {
    expect(scalePercent(Number.NaN, 500)).toBe(0);
  });
});

describe('hydrationPercent', () => {
  it('returns water divided by flour, to one decimal', () => {
    expect(hydrationPercent(800, 1000)).toBe(80);
    expect(hydrationPercent(750, 1000)).toBe(75);
  });

  it('returns null when flour is zero', () => {
    expect(hydrationPercent(100, 0)).toBeNull();
  });
});

describe('scaleRecipeToActuals', () => {
  it('scales the country loaf from 1000g flour', () => {
    const recipe = breadRecipes.find(
      (item) => item.title === 'Country Loaf (Sourdough)',
    );
    expect(scaleRecipeToActuals(recipe, 1000)).toEqual({
      flour: 1000,
      whiteFlour: 900,
      wholeWheatFlour: 100,
      water: 800,
      salt: 20,
      leaven: 200,
    });
  });

  it('includes milk-bread extras and tangzhong on the formula list', () => {
    const recipe = breadRecipes.find(
      (item) => item.title === 'Milk Bread (Yeasted)',
    );
    if (!recipe) throw new Error('missing milk bread');
    const labels = formulaLines(recipe, 500).map((line) => line.label);
    expect(labels).toContain('Milk');
    expect(labels).toContain('Butter');
    expect(labels).toContain('Sugar');
    expect(labels).toContain('Tangzhong bread flour');
  });
});

describe('preparation total', () => {
  it('sums minutes and hours for the overnight wheat bread', () => {
    const recipe = breadRecipes[0];
    expect(formatTotalHours(totalPrepHours(recipe.preperation))).toBe(
      '18.3 hours',
    );
  });
});

describe('defaultProjectTitle', () => {
  it('drops the parenthetical type', () => {
    expect(defaultProjectTitle('Country Loaf (Sourdough)')).toBe(
      'Country Loaf bake',
    );
  });
});
