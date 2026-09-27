import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  compressImageFile,
  createProjectId,
  exportFileName,
  loadProjects,
  mergeProjects,
  parseImportedProjects,
  projectsToExportJson,
  saveProjects,
  type BreadProject,
} from '@web-app-monorepo/ui/bread/journal';
import {
  breadRecipes,
  defaultProjectTitle,
  emptyActuals,
  scaleRecipeToActuals,
  type RecipeActuals,
} from '@web-app-monorepo/ui/bread/recipes';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConvertSession {
  private readonly http = inject(HttpClient);

  readonly recipes = breadRecipes;
  readonly flour = signal<number | ''>(500);
  readonly selectedTitle = signal('');
  readonly projects = signal<BreadProject[]>(loadProjects());
  readonly activeProjectId = signal<string | null>(null);
  readonly projectTitle = signal('');
  readonly notes = signal('');
  readonly photo = signal('');
  readonly photoBusy = signal(false);
  readonly photoError = signal('');
  readonly importError = signal('');
  readonly actuals = signal<RecipeActuals>(emptyActuals(500));
  readonly heroUrl = signal('');

  readonly recipe = computed(() =>
    this.recipes.find((item) => item.title === this.selectedTitle()),
  );

  readonly formulaActuals = computed(() => {
    const recipe = this.recipe();
    const flour = Number(this.flour()) || 0;
    return recipe ? scaleRecipeToActuals(recipe, flour) : emptyActuals(flour);
  });

  constructor() {
    this.loadHero();
  }

  selectRecipe(title: string): void {
    this.selectedTitle.set(title);
    this.activeProjectId.set(null);
    const recipe = this.recipes.find((item) => item.title === title);
    const flour = Number(this.flour()) || 0;
    this.actuals.set(
      recipe ? scaleRecipeToActuals(recipe, flour) : emptyActuals(flour),
    );
    this.projectTitle.set(recipe ? defaultProjectTitle(recipe.title) : '');
    this.notes.set('');
    this.photo.set('');
    this.photoError.set('');
  }

  setFlour(raw: string): void {
    const flour = raw === '' ? '' : Number(raw);
    this.flour.set(flour);
    const recipe = this.recipe();
    const flourNum = Number(flour) || 0;
    if (recipe) {
      this.actuals.set(scaleRecipeToActuals(recipe, flourNum));
    } else {
      this.actuals.update((current) => ({ ...current, flour: flourNum }));
    }
  }

  setProjectTitle(value: string): void {
    this.projectTitle.set(value);
  }

  setNotes(value: string): void {
    this.notes.set(value);
  }

  setActual(key: keyof RecipeActuals, raw: string): void {
    const num = raw === '' ? '' : Number(raw);
    this.actuals.update((current) => {
      const next = { ...current, [key]: num === '' ? 0 : num };
      return next;
    });
    if (key === 'flour' && raw !== '') {
      this.flour.set(Number(raw));
    }
  }

  async addPhoto(file: File | undefined): Promise<void> {
    if (!file) return;
    this.photoBusy.set(true);
    this.photoError.set('');
    try {
      this.photo.set(await compressImageFile(file));
    } catch (err) {
      this.photoError.set(
        err instanceof Error ? err.message : 'Could not add that photo.',
      );
    } finally {
      this.photoBusy.set(false);
    }
  }

  removePhoto(): void {
    this.photo.set('');
    this.photoError.set('');
  }

  saveProject(): void {
    const title = this.projectTitle().trim();
    const recipe = this.recipe();
    if (!title || !recipe) return;

    const now = new Date().toISOString();
    const activeId = this.activeProjectId();
    const existing = activeId
      ? this.projects().find((project) => project.id === activeId)
      : undefined;
    const amounts = this.actuals();
    const project: BreadProject = {
      id: existing ? existing.id : createProjectId(),
      title,
      sourceRecipeTitle: recipe.title,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
      notes: this.notes() || '',
      flour: Number(amounts.flour) || 0,
      whiteFlour: Number(amounts.whiteFlour) || 0,
      wholeWheatFlour: Number(amounts.wholeWheatFlour) || 0,
      water: Number(amounts.water) || 0,
      salt: Number(amounts.salt) || 0,
    };
    if (this.photo()) project.photo = this.photo();
    this.copyOptional(project, amounts, 'leaven');
    this.copyOptional(project, amounts, 'yeast');
    this.copyOptional(project, amounts, 'milk');
    this.copyOptional(project, amounts, 'eggs');
    this.copyOptional(project, amounts, 'butter');
    this.copyOptional(project, amounts, 'sugar');

    const next = existing
      ? this.projects().map((item) =>
          item.id === existing.id ? project : item,
        )
      : [project, ...this.projects()];

    try {
      this.persist(next);
      this.activeProjectId.set(project.id);
      this.flour.set(project.flour);
      this.photoError.set('');
    } catch (err) {
      this.photoError.set(
        err instanceof Error ? err.message : 'Could not save this project.',
      );
    }
  }

  deleteProject(): void {
    const activeId = this.activeProjectId();
    if (!activeId) return;
    this.persist(this.projects().filter((project) => project.id !== activeId));
    this.clearProject();
  }

  clearProject(): void {
    const flour = Number(this.flour()) || 500;
    const recipe = this.recipe();
    this.activeProjectId.set(null);
    this.projectTitle.set(recipe ? defaultProjectTitle(recipe.title) : '');
    this.notes.set('');
    this.photo.set('');
    this.photoError.set('');
    this.actuals.set(
      recipe ? scaleRecipeToActuals(recipe, flour) : emptyActuals(flour),
    );
  }

  selectProject(projectId: string): void {
    const project = this.projects().find((item) => item.id === projectId);
    if (!project) return;
    const actuals: RecipeActuals = {
      flour: project.flour,
      whiteFlour: project.whiteFlour,
      wholeWheatFlour: project.wholeWheatFlour,
      water: project.water,
      salt: project.salt,
    };
    if (project.leaven !== undefined) actuals.leaven = project.leaven;
    if (project.yeast !== undefined) actuals.yeast = project.yeast;
    if (project.milk !== undefined) actuals.milk = project.milk;
    if (project.eggs !== undefined) actuals.eggs = project.eggs;
    if (project.butter !== undefined) actuals.butter = project.butter;
    if (project.sugar !== undefined) actuals.sugar = project.sugar;

    this.activeProjectId.set(project.id);
    this.projectTitle.set(project.title);
    this.notes.set(project.notes || '');
    this.photo.set(project.photo || '');
    this.photoError.set('');
    this.flour.set(project.flour);
    this.selectedTitle.set(project.sourceRecipeTitle || '');
    this.actuals.set(actuals);
  }

  exportProjects(): void {
    const blob = new Blob([projectsToExportJson(this.projects())], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  importFile(file: File | undefined): void {
    if (!file) return;
    this.importError.set('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImportedProjects(String(reader.result));
        this.persist(mergeProjects(this.projects(), imported));
        this.importError.set('');
      } catch (err) {
        this.importError.set(
          err instanceof Error
            ? err.message
            : 'Could not import projects. Use a JSON export from this app.',
        );
      }
    };
    reader.onerror = () => {
      this.importError.set('Could not read that file.');
    };
    reader.readAsText(file);
  }

  private persist(projects: BreadProject[]): void {
    saveProjects(projects);
    this.projects.set(projects);
  }

  private copyOptional(
    project: BreadProject,
    amounts: RecipeActuals,
    key: 'leaven' | 'yeast' | 'milk' | 'eggs' | 'butter' | 'sugar',
  ): void {
    const value = amounts[key];
    if (value !== undefined) {
      project[key] = Number(value) || 0;
    }
  }

  heroBackground(): string | null {
    const url = this.heroUrl();
    if (!url) return null;
    return `url("${url.replace(/"/g, '%22')}")`;
  }

  private loadHero(): void {
    const key = environment.unsplashAccessKey;
    if (!key) return;
    this.http
      .get<{ urls?: { regular?: string; full?: string } }>(
        'https://api.unsplash.com/photos/random',
        {
          params: { client_id: key, query: 'bread' },
        },
      )
      .subscribe({
        next: (response) => {
          const urls = response.urls;
          const url = urls?.regular || urls?.full;
          if (url) this.heroUrl.set(url);
        },
        error: () => {
          // The header photo is optional.
        },
      });
  }
}
