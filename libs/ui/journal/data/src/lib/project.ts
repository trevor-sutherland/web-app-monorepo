export interface BreadProject {
  id: string;
  title: string;
  sourceRecipeTitle: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
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
  photo?: string;
}
