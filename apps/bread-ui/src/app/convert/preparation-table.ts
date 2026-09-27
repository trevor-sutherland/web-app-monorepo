import { Component, input } from '@angular/core';
import {
  PREP_STEP_LABELS,
  PREP_STEPS,
  formatStepTime,
  formatTemperature,
  formatTotalHours,
  totalPrepHours,
  type BreadRecipe,
} from '@web-app-monorepo/ui/bread/recipes';

@Component({
  selector: 'app-preparation-table',
  template: `
    @if (recipe()?.preperation; as prep) {
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Time</th>
            <th scope="col">Temperature</th>
          </tr>
        </thead>
        <tbody>
          @for (key of steps; track key) {
            <tr>
              <th scope="row">{{ labels[key] }}</th>
              <td>{{ time(prep[key]) }}</td>
              <td>{{ temperature(prep[key]) }}</td>
            </tr>
          }
          <tr>
            <th scope="row">Total</th>
            <td>
              {{ total(prep) }}
              <small class="text-muted">(sum of steps above)</small>
            </td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    } @else {
      <p class="display-6">
        Preparation instructions will appear when you choose a bread.
      </p>
    }
  `,
})
export class PreparationTable {
  readonly recipe = input<BreadRecipe | undefined>();
  readonly steps = PREP_STEPS;
  readonly labels = PREP_STEP_LABELS;

  time = formatStepTime;
  temperature = formatTemperature;

  total(prep: NonNullable<BreadRecipe['preperation']>): string {
    return formatTotalHours(totalPrepHours(prep));
  }
}
