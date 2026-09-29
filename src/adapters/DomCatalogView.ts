import type { NavigationHandlers, ViewPort } from '../application/ports'
import type { CatalogState, Category, Project, Section, SectionId } from '../domain/catalog'

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, content?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (content !== undefined) node.textContent = content
  return node
}

function required<T extends HTMLElement>(doc: Document, selector: string): T {
  const node = doc.querySelector<T>(selector)
  if (!node) throw new Error(`Falta el elemento ${selector} en index.html`)
  return node
}

export class DomCatalogView implements ViewPort {
  private readonly shell: HTMLElement
  private readonly toggle: HTMLButtonElement
  private readonly topNav: HTMLElement
  private readonly categoryNav: HTMLElement
  private readonly content: HTMLElement
  private readonly breadcrumb: HTMLElement
  private readonly main: HTMLElement
  private handlers: NavigationHandlers | null = null

  constructor(private readonly doc: Document) {
    this.shell = required(doc, '#app-shell')
    this.toggle = required(doc, '#menu-toggle')
    this.topNav = required(doc, '#top-nav')
    this.categoryNav = required(doc, '#category-nav')
    this.content = required(doc, '#page-content')
    this.breadcrumb = required(doc, '#breadcrumb-current')
    this.main = required(doc, '#main-content')
  }

  bind(handlers: NavigationHandlers): void { this.handlers = handlers }

  start(): void {
    this.doc.addEventListener('click', this.onClick)
    this.doc.addEventListener('keydown', this.onKeydown)
  }

  stop(): void {
    this.doc.removeEventListener('click', this.onClick)
    this.doc.removeEventListener('keydown', this.onKeydown)
  }

  render(state: CatalogState): void {
    this.shell.dataset.menuOpen = String(state.menuOpen)
    this.toggle.setAttribute('aria-expanded', String(state.menuOpen))
    this.toggle.setAttribute('aria-label', state.menuOpen ? 'Ocultar categorías' : 'Mostrar categorías')
    this.renderNavigation(state)
    this.renderContent(state)
  }

  private readonly onClick = (event: MouseEvent): void => {
    const target = event.target
    if (!(target instanceof Element) || !this.handlers) return

    if (target.closest('#menu-toggle')) { this.handlers.toggleMenu(); return }
    if (target.closest('#menu-scrim')) { this.handlers.closeMenu(); this.toggle.focus(); return }

    const section = target.closest<HTMLElement>('[data-section]')
    if (section?.dataset.section) {
      event.preventDefault()
      this.handlers.selectSection(section.dataset.section as SectionId)
      this.closeMobileMenu()
      this.main.focus()
      return
    }

    const category = target.closest<HTMLElement>('[data-category]')
    if (category?.dataset.category) {
      this.handlers.selectCategory(category.dataset.category)
      this.closeMobileMenu()
      this.main.focus()
    }
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.handlers?.closeMenu()
      this.toggle.focus()
    }
  }

  private closeMobileMenu(): void {
    if (this.doc.defaultView?.matchMedia('(max-width: 979px)').matches) this.handlers?.closeMenu()
  }

  private renderNavigation(state: CatalogState): void {
    this.topNav.replaceChildren(...state.sections.filter((section) => section.id !== 'proyectos').map((section) => {
      const button = element('button', 'top-link', section.label)
      button.type = 'button'
      button.dataset.section = section.id
      if (state.activeSection === section.id) button.setAttribute('aria-current', 'page')
      return button
    }))

    this.categoryNav.replaceChildren(...state.categories.map((category) => {
      const button = element('button', 'category-link')
      button.type = 'button'
      button.dataset.category = category.id
      button.setAttribute('aria-pressed', String(state.activeCategory === category.id))
      button.append(element('span', 'category-symbol', category.symbol), element('span', '', category.label))
      return button
    }))
  }

  private renderContent(state: CatalogState): void {
    const section = state.sections.find((entry) => entry.id === state.activeSection)
    if (!section) return
    const category = state.categories.find((entry) => entry.id === state.activeCategory)
    this.breadcrumb.textContent = category?.label ?? section.label
    this.content.replaceChildren(state.activeSection === 'inicio' ? this.home(section) : this.sectionPage(state, section, category))
  }

  private home(section: Section): HTMLElement {
    const container = element('div')
    const hero = element('section', 'hero')
    hero.setAttribute('aria-labelledby', 'hero-title')

    const copy = element('div', 'hero-copy')
    copy.append(element('span', 'hero-kicker', 'DIVIERTETEC / CREACIONES PARA DESCUBRIR'))
    const title = element('h1', '', section.title)
    title.id = 'hero-title'
    copy.append(title, element('p', 'hero-description', section.description))

    const actions = element('div', 'hero-actions')
    actions.append(this.action('Explorar proyectos', 'proyectos', 'button-primary'), this.action('Ver subjuegos', 'subjuegos', 'button-secondary'))
    copy.append(actions)

    const art = element('div', 'hero-art')
    art.setAttribute('aria-hidden', 'true')
    const orbit = element('div', 'orbit')
    const back = element('div', 'art-card art-card-back')
    back.append(element('span', '', 'DESCUBRE'))
    const front = element('div', 'art-card art-card-front')
    front.append(element('span', 'art-mark', 'D·'), element('span', 'art-title', 'EXPLORA.\nJUEGA.\nCREA.'), element('span', 'art-index', '01 / DIVIERTETEC'))
    art.append(orbit, back, front)
    hero.append(copy, art)

    const discover = element('section', 'discover')
    discover.setAttribute('aria-labelledby', 'discover-title')
    const heading = element('div', 'section-heading')
    const headingCopy = element('div')
    headingCopy.append(element('span', 'label-small', 'EXPLORA'), element('h2', '', 'Tu punto de partida'))
    headingCopy.querySelector('h2')!.id = 'discover-title'
    heading.append(headingCopy, element('span', 'section-aside', '01 — 03'))

    const grid = element('div', 'entry-grid')
    grid.append(
      this.entryCard('01', 'Proyectos', 'Creaciones recreativas de cualquier categoría.', 'proyectos', 'entry-project'),
      this.entryCard('02', 'Subjuegos', 'Experiencias interactivas y proyectos jugables.', 'subjuegos', 'entry-game'),
      this.entryCard('03', 'Plantel', 'Conoce el lugar y a sus creadores.', 'plantel', 'entry-campus'),
    )
    discover.append(heading, grid)
    container.append(hero, discover)
    return container
  }

  private sectionPage(state: CatalogState, section: Section, category?: Category): HTMLElement {
    const container = element('div', 'section-page')
    const intro = element('section', 'page-intro')
    const title = element('h1', '', category && category.id !== 'todos' ? category.label : section.title)
    title.id = 'page-title'
    intro.setAttribute('aria-labelledby', 'page-title')
    intro.append(element('span', 'hero-kicker', section.label.toUpperCase()), title, element('p', '', category?.description ?? section.description))

    const visibleProjects = state.projects.filter((project) =>
      (section.id !== 'subjuegos' || project.kind === 'juego') &&
      (section.id !== 'proyectos' || !category || category.id === 'todos' || project.categoryId === category.id),
    )
    if (section.id !== 'plantel' && visibleProjects.length > 0) {
      const grid = element('section', 'project-grid')
      grid.setAttribute('aria-label', 'Proyectos disponibles')
      grid.append(...visibleProjects.map((project) => this.projectCard(project)))
      container.append(intro, grid)
      return container
    }

    const placeholder = element('section', 'placeholder-panel')
    const emblem = element('span', 'placeholder-emblem', category?.symbol ?? (section.id === 'plantel' ? '⌂' : '◫'))
    emblem.setAttribute('aria-hidden', 'true')
    const emptyTitle = section.id === 'plantel' ? 'El espacio del plantel está en preparación.' : section.id === 'subjuegos' ? 'Aquí aparecerán los subjuegos.' : 'Aquí aparecerán los proyectos.'
    placeholder.append(emblem, element('span', 'label-small', 'PRÓXIMAMENTE'), element('h2', '', emptyTitle), element('p', '', 'Esta sección ya tiene su lugar en la navegación; añadiremos su contenido en los siguientes pasos.'))
    container.append(intro, placeholder)
    return container
  }

  private projectCard(project: Project): HTMLElement {
    const card = element('article', 'project-card')
    card.append(element('span', 'label-small', project.kind === 'juego' ? 'JUEGO' : 'PROYECTO'))
    card.append(element('h2', '', project.title), element('p', '', project.summary))
    if (project.priceMXN !== undefined) {
      card.append(element('span', 'project-price', new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(project.priceMXN)))
    }
    return card
  }

  private entryCard(number: string, title: string, description: string, destination: SectionId, className: string): HTMLElement {
    const card = element('article', `entry-card ${className}`)
    card.append(element('span', 'entry-number', number), element('span', 'entry-graphic', destination === 'plantel' ? '⌂' : destination === 'proyectos' ? '✧' : '◇'))
    const bottom = element('div', 'entry-bottom')
    const text = element('div')
    text.append(element('h3', '', title), element('p', '', description))
    bottom.append(text, this.action('Explorar', destination, 'entry-arrow'))
    card.append(bottom)
    return card
  }

  private action(label: string, destination: SectionId, className: string): HTMLButtonElement {
    const button = element('button', className, label)
    button.type = 'button'
    button.dataset.section = destination
    return button
  }
}
