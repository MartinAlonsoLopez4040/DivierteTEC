import type { CatalogPort } from '../application/ports'
import type { Category, Project, Section } from '../domain/catalog'

const sections: readonly Section[] = [
  { id: 'inicio', label: 'Inicio', title: 'Explora. Juega. Descubre.', description: 'Un espacio para encontrar juegos, creaciones y proyectos de cualquier categoría. Conoce nuevas ideas y descubre lo que viene.' },
  { id: 'proyectos', label: 'Proyectos', title: 'Explora los proyectos.', description: 'Este catálogo reunirá propuestas recreativas, productos y creaciones de todas las categorías.' },
  { id: 'subjuegos', label: 'Subjuegos', title: 'Explora los subjuegos.', description: 'Aquí se reunirán juegos y experiencias interactivas.' },
  { id: 'plantel', label: 'Plantel', title: 'Conoce el plantel.', description: 'Aquí conocerás el plantel y a las personas detrás de sus proyectos.' },
]

const categories: readonly Category[] = [
  { id: 'todos', label: 'Todas las categorías', description: 'Descubre las creaciones de todo tipo.', symbol: '◫' },
  { id: 'juegos', label: 'Juegos', description: 'Experiencias para jugar y compartir.', symbol: '◇' },
  { id: 'tecnologia', label: 'Tecnología', description: 'Dispositivos, herramientas e ideas tecnológicas.', symbol: '⌘' },
  { id: 'arte', label: 'Arte y diseño', description: 'Creaciones visuales y objetos de diseño.', symbol: '✧' },
  { id: 'educacion', label: 'Educación', description: 'Proyectos para aprender mientras exploras.', symbol: '▦' },
  { id: 'otros', label: 'Otras ideas', description: 'Propuestas que abren nuevas categorías.', symbol: '◎' },
]

// Sin proyectos de muestra inventados: los reales se incorporarán aquí o mediante otro adaptador.
const projects: readonly Project[] = []

export class StaticCatalog implements CatalogPort {
  getSections(): readonly Section[] { return sections }
  getCategories(): readonly Category[] { return categories }
  getProjects(): readonly Project[] { return projects }
}
