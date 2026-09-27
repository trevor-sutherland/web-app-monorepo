import type { BreadRecipe } from './recipe';

export const breadRecipes: BreadRecipe[] = [
  {
    author: "Ken Forkish's Flour Salt Water Yeast",
    title: 'Overnight 40% Wheat Bread (Yeasted)',
    type: 'Yeasted',
    ingredients: {
      whiteFlour: 60,
      wholeWheatFlour: 40,
      water: 80,
      yeast: 0.3,
      salt: 2.2,
    },
    preperation: {
      autolyse: { time: 20, unit: 'minutes', temperature: 74 },
      bulkFermentation: { time: 5, unit: 'hours', temperature: 74 },
      proof: { time: 12, unit: 'hours', temperature: 45 },
      bake: { time: 60, unit: 'minutes', temperature: 475 },
    },
  },
  {
    author: 'Tartine Bread',
    title: 'Country Loaf (Sourdough)',
    type: 'Sourdough',
    ingredients: {
      whiteFlour: 90,
      wholeWheatFlour: 10,
      water: 80,
      leaven: 20,
      salt: 2,
    },
    preperation: {
      autolyse: { time: 20, unit: 'minutes', temperature: 74 },
      bulkFermentation: { time: 5, unit: 'hours', temperature: 74 },
      proof: { time: 90, unit: 'minutes', temperature: 74 },
      bake: { time: 60, unit: 'minutes', temperature: 475 },
    },
  },
  {
    author: "Memoirs of a Baker's Instagram",
    title: 'Focaccia (Sourdough)',
    type: 'Sourdough',
    ingredients: {
      whiteFlour: 100,
      wholeWheatFlour: 0,
      water: 80,
      leaven: 30,
      salt: 2.5,
    },
    preperation: {
      autolyse: { time: 30, unit: 'minutes', temperature: 74 },
      bulkFermentation: { time: 5, unit: 'hours', temperature: 74 },
      proof: { time: '', unit: 'hours', temperature: '' },
      bake: { time: 22, unit: 'minutes', temperature: 450 },
    },
  },
  {
    author: 'Joshua Weissman',
    title: 'Milk Bread (Yeasted)',
    type: 'Yeasted',
    ingredients: {
      tangzhong: {
        'bread-flour': 5,
        water: 8,
        milk: 16,
      },
      whiteFlour: 100,
      wholeWheatFlour: 0,
      water: 0,
      yeast: 2.8,
      salt: 1,
      milk: 37.5,
      eggs: 0.00285714,
      butter: 12,
      sugar: 17.5,
    },
    preperation: {
      autolyse: { time: '', unit: 'minutes', temperature: '' },
      bulkFermentation: { time: 1, unit: 'hours', temperature: 74 },
      proof: { time: 1, unit: 'hours', temperature: 74 },
      bake: { time: 30, unit: 'minutes', temperature: 350 },
    },
  },
];
