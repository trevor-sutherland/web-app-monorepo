import { Component, inject } from '@angular/core';
import { ConvertSession } from './convert-session';
import { FormulaList } from './formula-list';
import { PreparationTable } from './preparation-table';
import { ProjectEditor } from './project-editor';
import { ProjectList } from './project-list';

@Component({
  selector: 'app-convert-page',
  imports: [FormulaList, PreparationTable, ProjectEditor, ProjectList],
  templateUrl: './convert-page.html',
})
export class ConvertPage {
  readonly session = inject(ConvertSession);
}
