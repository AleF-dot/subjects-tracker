# Tracker académico

Tracker visual de plan de estudios universitario. Permite seguir el estado de cada materia, visualizar correlatividades y gestionar el progreso a lo largo de la carrera.

## Stack

- React 19 + Vite
- CSS custom properties (sin librerías de UI)
- localStorage para persistencia

## Funcionalidades

- Grid de materias organizado por año (hasta 5 años)
- 5 estados por materia: `disponible`, `cursando`, `regular`, `aprobada`, `bloqueada`
- Estado `bloqueada` calculado automáticamente según correlativas
- Dos tipos de correlativas: para cursar y para aprobar (final)
- Flechas animadas que visualizan las correlativas de la materia seleccionada
- Filtro de flechas: todas / para cursar / para aprobar
- Dark mode
- Importar / exportar plan en JSON
- Scroll horizontal en mobile con clip correcto de flechas y menú

## Estructura

```
src/
├── components/
│   ├── ArrowOverlay.jsx   # SVG de flechas (position: fixed + clipPath dinámico)
│   ├── StatusMenu.jsx     # Menú desplegable de estado
│   ├── SubjectCard.jsx    # Card individual de materia
│   ├── YearColumn.jsx     # Columna por año
│   ├── Header.jsx
│   ├── Legend.jsx
│   ├── AddModal.jsx       # Modal agregar / editar materia
│   ├── InfoModal.jsx
│   ├── GlobalStyles.jsx   # CSS-in-JS global + keyframes
│   ├── Toast.jsx
│   ├── Dot.jsx
│   └── EmptyState.jsx
├── hooks/
│   ├── useArrows.js       # Lógica de cálculo y animación de flechas
│   ├── useCurriculumData.js
│   └── useToast.js
├── utils/
│   ├── arrowHelpers.js    # Geometría de flechas (buildPath, resolveArrowPoints)
│   ├── statusLogic.js     # Cálculo de estados bloqueados y permitidos
│   └── constants.js
└── context/
    └── ThemeContext.jsx
```

## Decisiones técnicas relevantes

### Flechas y clip horizontal

`ArrowOverlay` usa `position: fixed` con coordenadas en viewport space (vía `getBoundingClientRect`). El recorte en los bordes del scroll container se hace con un `<clipPath>` SVG con `clipPathUnits="userSpaceOnUse"`, cuyo rect se actualiza en cada scroll y resize para coincidir con el área visible del contenedor. Esto evita el parallax que ocurriría con `position: absolute` dentro del contenedor scrolleable.

### StatusMenu

Usa `position: fixed` y calcula su posición leyendo `getBoundingClientRect` del anchor en cada evento de scroll (window + contenedor horizontal). Si el anchor sale del área visible del contenedor, el menú se oculta (`top: -9999`). Arranca con `top: -9999` desde el primer render para que `useLayoutEffect` pueda medir la altura real del menú y calcular si debe abrirse arriba o abajo, sin ciclos extra de re-render.

### Correlativas y estado bloqueada

El estado `bloqueada` no se guarda — se calcula en runtime por `statusLogic.js` comparando las correlativas de cada materia contra `effectiveStatus`. Lo que se persiste en localStorage es el estado declarado (`cursando`, `regular`, etc.); el efectivo puede diferir si hay correlativas incompletas.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
