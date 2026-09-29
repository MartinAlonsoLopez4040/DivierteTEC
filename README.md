# DivierteTEC

Página independiente para descubrir juegos y proyectos recreativos de cualquier categoría. Por ahora contiene la portada, el menú de categorías y las entradas **Subjuegos** y **Plantel**. No incluye panel administrativo ni compras: esos flujos se podrán incorporar cuando se definan los productos y sus reglas.

La interfaz usa una paleta oscura inspirada en una tienda de juegos y el azul `#1B396A` como referencia cromática al TecNM. El símbolo `D·` es propio de este proyecto; no se usa el logotipo institucional.

## Ejecutar en VS Code

1. Clona el repositorio y abre la carpeta `DivierteTEC` en VS Code.
2. Comprueba que Node.js sea 20.19+ o 22.12+ con `node -v`.
3. En la terminal integrada ejecuta `npm install` (una vez) y luego `npm run dev`.
4. Vite abrirá la página. Si no se abre sola, visita la dirección local indicada en la terminal, normalmente `http://localhost:5173/`.
5. Edita y guarda un archivo `.ts` o `.css`: el navegador recibe los cambios automáticamente. Detén el servidor con `Ctrl+C`.

En VS Code también puedes usar **Terminal → Ejecutar tarea… → Iniciar página web (TypeScript)**. Esta tarea lanza `npm run dev` en la terminal integrada.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia Vite y transforma TypeScript durante el desarrollo. |
| `npm run typecheck` | Comprueba tipos sin emitir archivos. |
| `npm run build` | Comprueba tipos y produce la web en `dist/`. |
| `npm run preview` | Abre localmente la versión compilada. |

No abras `index.html` con `file://`: usa el servidor de Vite. Durante el desarrollo Vite transforma TypeScript para el navegador; `tsc` comprueba los tipos al ejecutar `typecheck` o `build`.

## Organización del código

| Ubicación | Responsabilidad |
| --- | --- |
| `index.html` y `src/style.css` | Estructura HTML5 y presentación adaptable. |
| `src/domain/catalog.ts` | Interfaces de sección, categoría, proyecto y estado; un proyecto puede tener `priceMXN`. |
| `src/application/ports.ts` | Contratos de lectura y vista. `CatalogPort` hereda `SectionReader`, `CategoryReader` y `ProjectReader`. |
| `src/application/CatalogController.ts` | Casos de interacción: seleccionar apartados, filtrar proyectos y abrir/cerrar menú. |
| `src/adapters/StaticCatalog.ts` | Datos iniciales en memoria. La lista de proyectos empieza vacía para no mostrar productos ficticios. |
| `src/adapters/DomCatalogView.ts` | Adaptador que traduce el estado a elementos HTML e interacciones del navegador. |
| `src/main.ts` | Punto de composición donde se conectan los adaptadores al controlador. |

Para cargar proyectos reales, añade objetos `Project` en el adaptador de datos o reemplázalo por una fuente externa que implemente `CatalogPort`. La vista puede mostrar títulos, descripciones y precios en MXN; todavía no procesa ventas ni pagos.
