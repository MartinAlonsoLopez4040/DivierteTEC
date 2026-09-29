import type { CatalogState, Category, Project, Section, SectionId } from '../domain/catalog'

// Puertos de lectura: un catálogo remoto podrá implementar las mismas interfaces.
export interface SectionReader {
  getSections(): readonly Section[]
}

export interface CategoryReader {
  getCategories(): readonly Category[]
}

export interface ProjectReader {
  getProjects(): readonly Project[]
}

export interface CatalogPort extends SectionReader, CategoryReader, ProjectReader {}

export interface Lifecycle {
  start(): void
  stop(): void
}

export interface NavigationHandlers {
  selectSection(id: SectionId): void
  selectCategory(id: string): void
  toggleMenu(): void
  closeMenu(): void
}

export interface ViewPort extends Lifecycle {
  bind(handlers: NavigationHandlers): void
  render(state: CatalogState): void
}
