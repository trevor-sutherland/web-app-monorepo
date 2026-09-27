export interface Tangzhong {
  'bread-flour': number;
  water: number;
  milk: number;
}

export interface Ingredients {
  whiteFlour: number;
  wholeWheatFlour: number;
  water: number;
  salt: number;
  yeast?: number;
  leaven?: number;
  milk?: number;
  eggs?: number;
  butter?: number;
  sugar?: number;
  tangzhong?: Tangzhong;
}

export interface PrepStep {
  time: number | '';
  unit: string;
  temperature: number | '';
}

export interface Preparation {
  autolyse: PrepStep;
  bulkFermentation: PrepStep;
  proof: PrepStep;
  bake: PrepStep;
}

export interface BreadRecipe {
  author: string;
  title: string;
  type: string;
  ingredients: Ingredients;
  /** Spelling matches the original catalog file. */
  preperation: Preparation;
}

export interface RecipeActuals {
  flour: number;
  whiteFlour: number;
  wholeWheatFlour: number;
  water: number;
  salt: number;
  leaven?: number;
  yeast?: number;
  milk?: number;
  eggs?: number;
  butter?: number;
  sugar?: number;
}

export const PREP_STEPS = [
  'autolyse',
  'bulkFermentation',
  'proof',
  'bake',
] as const;

export type PrepStepKey = (typeof PREP_STEPS)[number];

export const PREP_STEP_LABELS: Record<PrepStepKey, string> = {
  autolyse: 'Autolyse',
  bulkFermentation: 'Bulk Fermentation',
  proof: 'Proof',
  bake: 'Bake',
};

export const EXTRA_INGREDIENT_KEYS = [
  'milk',
  'eggs',
  'butter',
  'sugar',
] as const;

export type ExtraIngredientKey = (typeof EXTRA_INGREDIENT_KEYS)[number];

export const ACTUAL_FIELDS: Array<{
  key: keyof RecipeActuals;
  label: string;
  always: boolean;
}> = [
  { key: 'flour', label: 'Total flour (g)', always: true },
  { key: 'whiteFlour', label: 'White flour (g)', always: true },
  { key: 'wholeWheatFlour', label: 'Whole wheat flour (g)', always: true },
  { key: 'water', label: 'Water (g)', always: true },
  { key: 'salt', label: 'Salt (g)', always: true },
  { key: 'leaven', label: 'Leaven (g)', always: false },
  { key: 'yeast', label: 'Yeast (g)', always: false },
  { key: 'milk', label: 'Milk (g)', always: false },
  { key: 'eggs', label: 'Eggs (g)', always: false },
  { key: 'butter', label: 'Butter (g)', always: false },
  { key: 'sugar', label: 'Sugar (g)', always: false },
];
