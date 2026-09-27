import type { BreadProject } from './project';

export const PROJECTS_STORAGE_KEY = 'breadConvert.projects';

function safeParse(raw: string | null): BreadProject[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? (data as BreadProject[]) : [];
  } catch {
    return [];
  }
}

export function loadProjects(
  storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage,
): BreadProject[] {
  if (!storage) return [];
  return safeParse(storage.getItem(PROJECTS_STORAGE_KEY));
}

export function saveProjects(
  projects: BreadProject[],
  storage: Pick<Storage, 'setItem'> | undefined = globalThis.localStorage,
): void {
  if (!storage) return;
  try {
    storage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    const quota =
      err instanceof Error &&
      (err.name === 'QuotaExceededError' ||
        (err as { code?: number }).code === 22);
    if (quota) {
      throw new Error(
        'Browser storage is full. Remove a photo or export and delete older projects.',
      );
    }
    throw err;
  }
}

export function createProjectId(now = new Date()): string {
  const stamp = now.toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 7);
  return `proj-${stamp}-${rand}`;
}

export function projectsToExportJson(projects: BreadProject[]): string {
  return JSON.stringify(projects, null, 2);
}

export function exportFileName(now = new Date()): string {
  return `bread-projects-${now.toISOString().slice(0, 10)}.json`;
}

/** Accepts a bare array or `{ projects: [...] }`. */
export function parseImportedProjects(text: string): BreadProject[] {
  const data: unknown = JSON.parse(text);
  if (Array.isArray(data)) return data as BreadProject[];
  if (
    data &&
    typeof data === 'object' &&
    Array.isArray((data as { projects?: unknown }).projects)
  ) {
    return (data as { projects: BreadProject[] }).projects;
  }
  throw new Error('Import file must be a JSON array of projects');
}

/** Later records with the same id replace earlier ones. */
export function mergeProjects(
  existing: BreadProject[],
  imported: BreadProject[],
): BreadProject[] {
  const byId = new Map<string, BreadProject>();
  for (const project of existing) {
    if (project?.id) byId.set(project.id, project);
  }
  for (const project of imported) {
    if (project?.id) byId.set(project.id, project);
  }
  return [...byId.values()];
}
