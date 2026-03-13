# Subjects Tracker

Tracker visual de plan de estudios universitario. Seguí el estado de cada materia, visualizá correlatividades y sabé en todo momento qué podés cursar o rendir.

## Funcionalidades

- Grid de materias organizado por año, con scroll horizontal
- Solo se muestran los años que tienen materias cargadas
- 5 estados: `disponible`, `cursando`, `regular`, `aprobada`, `bloqueada`
- `bloqueada` se calcula automáticamente según correlativas — no se persiste
- Dos tipos de correlativas: para cursar y para aprobar (final)
- Flechas animadas al seleccionar una materia, con filtro por tipo
- Planes de estudio precargados (UNR / UTN) — se cargan con un clic
- Importar / exportar plan en JSON
- Drag & drop para reordenar materias dentro de un año
- Sync en la nube con Supabase — accedé desde cualquier dispositivo
- Modo oscuro y modo daltonismo
- Sin librerías de UI — todo CSS custom properties

## Stack

- React 19 + Vite
- Supabase (auth + sync)
- CSS custom properties
- localStorage para persistencia offline

## Estructura

```
src/
├── components/
│   ├── SubjectCard.jsx        # Card individual de materia
│   ├── YearColumn.jsx         # Columna por año con drag & drop
│   ├── ArrowOverlay.jsx       # SVG de flechas (fixed + clipPath dinámico)
│   ├── StatusMenu.jsx         # Menú desplegable de estado
│   ├── AddModal.jsx           # Modal agregar / editar materia
│   ├── PlanSelectorModal.jsx  # Selector de planes precargados
│   ├── AuthButton.jsx         # Botón de login / estado de sync
│   ├── AuthModal.jsx          # Modal de autenticación
│   ├── MergePromptModal.jsx   # Resolución de conflictos local vs nube
│   ├── InfoModal.jsx          # Info, privacidad, reportes, tema
│   ├── Header.jsx
│   ├── Legend.jsx
│   ├── GlobalStyles.jsx       # CSS global + keyframes
│   ├── Toast.jsx
│   ├── Dot.jsx
│   └── EmptyState.jsx
├── hooks/
│   ├── useLocalData.js        # Estado local + localStorage
│   ├── useCurriculumData.js   # Orquesta local + sync
│   ├── useSupabaseSync.js     # Sync con Supabase (debounce, retry, merge)
│   ├── useArrows.js           # Cálculo y animación de flechas
│   └── useToast.js
├── utils/
│   ├── statusLogic.js         # Cálculo de estados bloqueados y permitidos
│   ├── arrowHelpers.js        # Geometría de flechas
│   └── constants.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── data/
│   └── planes.js              # Planes de estudio hardcodeados
└── lib/
    └── supabase.js
```

## Notas técnicas

**Flechas y clip horizontal** — `ArrowOverlay` usa `position: fixed` con coordenadas en viewport space (`getBoundingClientRect`). El recorte sobre el área visible del scroll container se hace con un `<clipPath>` SVG con `clipPathUnits="userSpaceOnUse"`, actualizado en cada scroll y resize. Evita el parallax que ocurriría con `position: absolute` dentro del contenedor scrolleable.

**StatusMenu** — `position: fixed`, calcula su posición leyendo el anchor en cada scroll. Si el anchor sale del área visible, el menú se oculta. Arranca en `top: -9999` para que `useLayoutEffect` mida la altura real y decida si abre arriba o abajo sin parpadeo.

**Estado `bloqueada`** — no se guarda. Se calcula en runtime en `statusLogic.js` comparando las correlativas contra `effectiveStatus`. Lo que se persiste es el estado declarado; el efectivo puede diferir si hay correlativas incompletas.

**Sync** — debounce de 800ms con maxWait de 5s. En caso de error reintenta con backoff (5s → 15s → 30s). Si al loguearse los datos locales y los de la nube difieren, se muestra un prompt para elegir cuál conservar. Al cerrar la pestaña con cambios pendientes se dispara un `fetch` con `keepalive: true`.

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```
