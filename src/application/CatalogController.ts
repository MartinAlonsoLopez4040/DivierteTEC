import type { CatalogState, SectionId } from '../domain/catalog'
import type { CatalogPort, Lifecycle, NavigationHandlers, ViewPort } from './ports'

export class CatalogController implements Lifecycle, NavigationHandlers {
  private state: CatalogState

  constructor(catalog: CatalogPort, private readonly view: ViewPort, initialMenuOpen: boolean) {
    this.state = {
      sections: catalog.getSections(),
      categories: catalog.getCategories(),
      projects: catalog.getProjects(),
      activeSection: 'inicio',
      activeCategory: null,
      menuOpen: initialMenuOpen,
    }
  }

  start(): void {
    this.view.bind(this)
    this.view.start()
    this.view.render(this.state)
  }

  stop(): void {
    this.view.stop()
  }

  selectSection(id: SectionId): void {
    if (!this.state.sections.some((section) => section.id === id)) return
    this.update({ activeSection: id, activeCategory: null })
  }

  selectCategory(id: string): void {
    if (!this.state.categories.some((category) => category.id === id)) return
    this.update({ activeSection: 'proyectos', activeCategory: id })
  }

  toggleMenu(): void {
    this.update({ menuOpen: !this.state.menuOpen })
  }

  closeMenu(): void {
    if (this.state.menuOpen) this.update({ menuOpen: false })
  }

  private update(changes: Partial<CatalogState>): void {
    this.state = { ...this.state, ...changes }
    this.view.render(this.state)
  }
}
