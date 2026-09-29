import './style.css'
import { CatalogController } from './application/CatalogController'
import { StaticCatalog } from './adapters/StaticCatalog'
import { DomCatalogView } from './adapters/DomCatalogView'

// Punto de composición: aquí se conectan el catálogo, la lógica y la interfaz.
// Se pueden sustituir los adaptadores sin cambiar el controlador.
const catalog = new StaticCatalog()
const view = new DomCatalogView(document)
const app = new CatalogController(catalog, view, window.matchMedia('(min-width: 980px)').matches)

app.start()

if (import.meta.hot) {
  import.meta.hot.dispose(() => app.stop())
}
