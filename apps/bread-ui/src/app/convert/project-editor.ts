import { Component, inject, TemplateRef } from '@angular/core';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  hydrationPercent,
  visibleActualFields,
  type RecipeActuals,
} from '@web-app-monorepo/ui/bread/recipes';
import { ConvertSession } from './convert-session';

@Component({
  selector: 'app-project-editor',
  imports: [NgbAlert],
  templateUrl: './project-editor.html',
})
export class ProjectEditor {
  readonly session = inject(ConvertSession);
  private readonly modal = inject(NgbModal);

  confirmDelete(content: TemplateRef<unknown>): void {
    this.modal
      .open(content, { ariaLabelledBy: 'delete-project-title' })
      .result.then(
        () => this.session.deleteProject(),
        () => undefined,
      );
  }

  fields() {
    return visibleActualFields(
      this.session.actuals(),
      this.session.formulaActuals(),
    );
  }

  hydration(): number | null {
    const amounts = this.session.actuals();
    return hydrationPercent(amounts.water, amounts.flour);
  }

  formulaGrams(key: keyof RecipeActuals): number | null {
    const formula = this.session.formulaActuals();
    const value = formula[key];
    return value === undefined ? null : Number(value);
  }

  overridden(key: keyof RecipeActuals): boolean {
    const formula = this.formulaGrams(key);
    const actual = this.session.actuals()[key];
    return (
      formula !== null &&
      actual !== undefined &&
      Number(actual) !== Number(formula)
    );
  }

  onPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    void this.session.addPhoto(file);
  }
}
