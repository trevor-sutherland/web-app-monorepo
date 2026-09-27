import { Component, input } from '@angular/core';
import {
  formulaLines,
  type BreadRecipe,
} from '@web-app-monorepo/ui/recipes/data';

@Component({
  selector: 'app-formula-list',
  template: `
    @if (recipe(); as current) {
      <div class="list-group">
        <h3>{{ current.title }}</h3>
        <ul class="list-group list-group-flush">
          @for (line of lines(); track line.label) {
            <li class="list-group-item">
              <b>{{ line.label }}:</b> {{ line.grams }}
            </li>
          }
        </ul>
      </div>
    } @else {
      <p class="lead">Choose a bread to see scaled grams.</p>
    }
  `,
})
export class FormulaList {
  readonly recipe = input<BreadRecipe | undefined>();
  readonly flour = input<number | ''>(500);

  lines() {
    const recipe = this.recipe();
    if (!recipe) return [];
    return formulaLines(recipe, Number(this.flour()) || 0);
  }
}
