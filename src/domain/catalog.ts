export type SectionId = 'inicio' | 'proyectos' | 'subjuegos' | 'plantel'

export interface Section {
  readonly id: SectionId
  readonly label: string
  readonly title: string
  readonly description: string
}

export interface Category {
  readonly id: string
  readonly label: string
  readonly description: string
  readonly symbol: string
}

export interface Project {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly categoryId: string
  readonly kind: 'juego' | 'proyecto'
  readonly priceMXN?: number
}

export interface CatalogState {
  readonly sections: readonly Section[]
  readonly categories: readonly Category[]
  readonly projects: readonly Project[]
  readonly activeSection: SectionId
  readonly activeCategory: string | null
  readonly menuOpen: boolean
}
