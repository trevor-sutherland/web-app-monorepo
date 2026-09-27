import {
  createProjectId,
  loadProjects,
  mergeProjects,
  parseImportedProjects,
  PROJECTS_STORAGE_KEY,
  saveProjects,
} from './project-storage';
import { compressImageFile } from './compress-image';
import type { BreadProject } from './project';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => data.delete(key),
    setItem: (key: string, value: string) => data.set(key, value),
  };
}

const sample = (id: string, title: string): BreadProject => ({
  id,
  title,
  sourceRecipeTitle: 'Country Loaf (Sourdough)',
  createdAt: '2026-09-19T18:00:00.000Z',
  updatedAt: '2026-09-19T18:00:00.000Z',
  notes: '',
  flour: 1000,
  whiteFlour: 900,
  wholeWheatFlour: 100,
  water: 800,
  salt: 20,
  leaven: 200,
});

describe('project storage', () => {
  it('round-trips projects through storage', () => {
    const storage = memoryStorage();
    const projects = [sample('proj-1', 'Saturday country loaf')];
    saveProjects(projects, storage);
    expect(storage.getItem(PROJECTS_STORAGE_KEY)).toContain('Saturday');
    expect(loadProjects(storage)).toEqual(projects);
  });

  it('throws a storage-full message on quota errors', () => {
    const storage = {
      setItem: () => {
        const error = new Error('quota');
        error.name = 'QuotaExceededError';
        throw error;
      },
    };
    expect(() => saveProjects([], storage)).toThrow(/storage is full/i);
  });

  it('parses a bare array or a projects wrapper', () => {
    const project = sample('proj-1', 'One');
    expect(parseImportedProjects(JSON.stringify([project]))).toEqual([project]);
    expect(
      parseImportedProjects(JSON.stringify({ projects: [project] })),
    ).toEqual([project]);
  });

  it('rejects import files that are not project lists', () => {
    expect(() => parseImportedProjects('{"nope":true}')).toThrow(
      /JSON array of projects/,
    );
  });

  it('merges imports by id, with the import winning', () => {
    const merged = mergeProjects(
      [sample('proj-1', 'Old'), sample('proj-2', 'Keep')],
      [sample('proj-1', 'New')],
    );
    expect(merged.map((project) => project.title)).toEqual(['New', 'Keep']);
  });

  it('builds a dated project id', () => {
    expect(createProjectId(new Date('2026-09-19T18:00:00.000Z'))).toMatch(
      /^proj-2026-09-19-/,
    );
  });
});

describe('compressImageFile', () => {
  it('rejects files that are not images', async () => {
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    await expect(compressImageFile(file)).rejects.toThrow(/image file/i);
  });
});
