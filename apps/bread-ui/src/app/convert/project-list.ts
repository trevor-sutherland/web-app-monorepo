import { Component, inject } from '@angular/core';
import type { BreadProject } from '@web-app-monorepo/ui/bread/journal';
import { ConvertSession } from './convert-session';

@Component({
  selector: 'app-project-list',
  template: `
    <div class="project-list text-start">
      <div
        class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2"
      >
        <h3 class="mb-0">Bread projects</h3>
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            (click)="session.clearProject()"
          >
            New project
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            (click)="session.exportProjects()"
          >
            Export
          </button>
          <label class="btn btn-sm btn-outline-secondary mb-0">
            Import
            <input
              type="file"
              accept="application/json,.json"
              class="d-none"
              (change)="onImport($event)"
            />
          </label>
        </div>
      </div>
      @if (sorted().length === 0) {
        <p class="text-muted mb-0">
          No saved bakes yet. Choose a recipe, set flour, then save a project
          with notes and actual amounts.
        </p>
      } @else {
        <ul class="list-group">
          @for (project of sorted(); track project.id) {
            <li
              class="list-group-item list-group-item-action"
              [class.active]="project.id === session.activeProjectId()"
              role="button"
              tabindex="0"
              (click)="session.selectProject(project.id)"
              (keydown.enter)="session.selectProject(project.id)"
              (keydown.space)="
                $event.preventDefault(); session.selectProject(project.id)
              "
            >
              <div class="d-flex gap-2 align-items-start">
                @if (project.photo) {
                  <img
                    class="project-list-thumb"
                    [src]="project.photo"
                    alt=""
                  />
                }
                <div class="flex-grow-1 min-w-0">
                  <div class="fw-bold">
                    {{ project.title || 'Untitled bake' }}
                  </div>
                  <small
                    [class.text-muted]="
                      project.id !== session.activeProjectId()
                    "
                  >
                    {{ dateLabel(project) }}
                    @if (project.sourceRecipeTitle) {
                      · {{ project.sourceRecipeTitle }}
                    }
                  </small>
                </div>
              </div>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class ProjectList {
  readonly session = inject(ConvertSession);

  sorted(): BreadProject[] {
    return this.session
      .projects()
      .slice()
      .sort((a, b) => {
        const aTime = a.updatedAt || a.createdAt || '';
        const bTime = b.updatedAt || b.createdAt || '';
        return bTime.localeCompare(aTime);
      });
  }

  dateLabel(project: BreadProject): string {
    return (project.updatedAt || project.createdAt || '').slice(0, 10);
  }

  onImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    this.session.importFile(file);
  }
}
