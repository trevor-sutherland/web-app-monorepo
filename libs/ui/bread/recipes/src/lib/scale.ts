import {
  ACTUAL_FIELDS,
  type ExtraIngredientKey,
  EXTRA_INGREDIENT_KEYS,
  type BreadRecipe,
  type RecipeActuals,
} from './recipe';

/** Round a baker's percentage to whole grams for a flour weight. */
export function scalePercent(percent: number, flour: number): number {
  const flourNum = Number(flour) || 0;
  const pct = Number(percent);
  if (Number.isNaN(pct)) return 0;
  return Math.round((pct / 100) * flourNum);
}

function isPercent(value: number | undefined): value is number {
  return value !== undefined && !Number.isNaN(Number(value));
}

export function emptyActuals(flour = 0): RecipeActuals {
  return {
    flour,
    whiteFlour: 0,
    wholeWheatFlour: 0,
    water: 0,
    salt: 0,
  };
}

/** Build gram amounts from a catalog recipe and a flour weight. */
export function scaleRecipeToActuals(
  recipe: BreadRecipe | undefined,
  flour: number,
): RecipeActuals {
  const flourNum = Number(flour) || 0;
  if (!recipe?.ingredients) {
    return emptyActuals(flourNum);
  }

  const ingredients = recipe.ingredients;
  const actuals: RecipeActuals = {
    flour: flourNum,
    whiteFlour: scalePercent(ingredients.whiteFlour, flourNum),
    wholeWheatFlour: scalePercent(ingredients.wholeWheatFlour, flourNum),
    water: scalePercent(ingredients.water, flourNum),
    salt: scalePercent(ingredients.salt, flourNum),
  };

  if (isPercent(ingredients.leaven)) {
    actuals.leaven = scalePercent(ingredients.leaven, flourNum);
  }
  if (isPercent(ingredients.yeast)) {
    actuals.yeast = scalePercent(ingredients.yeast, flourNum);
  }

  for (const key of EXTRA_INGREDIENT_KEYS) {
    const percent = ingredients[key];
    if (isPercent(percent)) {
      actuals[key] = scalePercent(percent, flourNum);
    }
  }

  return actuals;
}

export function hydrationPercent(
  water: number | undefined,
  flour: number | undefined,
): number | null {
  const flourNum = Number(flour);
  const waterNum = Number(water);
  if (!flourNum || Number.isNaN(flourNum) || Number.isNaN(waterNum)) {
    return null;
  }
  return Math.round((waterNum / flourNum) * 1000) / 10;
}

export interface FormulaLine {
  label: string;
  grams: number;
}

const EXTRA_LABELS: Record<ExtraIngredientKey, string> = {
  milk: 'Milk',
  eggs: 'Eggs',
  butter: 'Butter',
  sugar: 'Sugar',
};

/** Formula rows, including milk-bread extras and tangzhong when present. */
export function formulaLines(
  recipe: BreadRecipe,
  flour: number,
): FormulaLine[] {
  const ingredients = recipe.ingredients;
  const lines: FormulaLine[] = [
    {
      label: 'White flour',
      grams: scalePercent(ingredients.whiteFlour, flour),
    },
    {
      label: 'Whole wheat flour',
      grams: scalePercent(ingredients.wholeWheatFlour, flour),
    },
    { label: 'Water', grams: scalePercent(ingredients.water, flour) },
  ];

  if (isPercent(ingredients.leaven)) {
    lines.push({
      label: 'Leaven',
      grams: scalePercent(ingredients.leaven, flour),
    });
  } else if (isPercent(ingredients.yeast)) {
    lines.push({
      label: 'Yeast',
      grams: scalePercent(ingredients.yeast, flour),
    });
  }

  lines.push({ label: 'Salt', grams: scalePercent(ingredients.salt, flour) });

  for (const key of EXTRA_INGREDIENT_KEYS) {
    const percent = ingredients[key];
    if (isPercent(percent)) {
      lines.push({
        label: EXTRA_LABELS[key],
        grams: scalePercent(percent, flour),
      });
    }
  }

  const tangzhong = ingredients.tangzhong;
  if (tangzhong) {
    lines.push(
      {
        label: 'Tangzhong bread flour',
        grams: scalePercent(tangzhong['bread-flour'], flour),
      },
      {
        label: 'Tangzhong water',
        grams: scalePercent(tangzhong.water, flour),
      },
      {
        label: 'Tangzhong milk',
        grams: scalePercent(tangzhong.milk, flour),
      },
    );
  }

  return lines;
}

export function visibleActualFields(
  actuals: RecipeActuals,
  formula: RecipeActuals,
) {
  return ACTUAL_FIELDS.filter((field) => {
    if (field.always) return true;
    return actuals[field.key] !== undefined || formula[field.key] !== undefined;
  });
}

export function defaultProjectTitle(recipeTitle: string): string {
  return `${recipeTitle.replace(/\s*\([^)]*\)\s*$/, '')} bake`;
}
