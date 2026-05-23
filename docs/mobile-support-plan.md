# Mobile Support & PWA — Plan de Implementación

## Objetivo
Agregar soporte responsive para dispositivos móviles y capacidad de instalación como PWA al Social Engagement Dashboard.

## Cambios Realizados

### 1. Sidenav Responsive con Hamburguesa
- **Archivos:** `src/app/app.ts`, `src/app/app.html`, `src/app/app.scss`
- Uso de `BreakpointObserver` de `@angular/cdk/layout` para detectar viewport < 768px
- Señal `isMobile()` y `sidenavOpened()` para control reactivo
- **Desktop (≥768px):** `mode="side"` con sidenav siempre abierto
- **Mobile (<768px):** `mode="over"` con sidenav cerrado por defecto, controlado por botón hamburguesa en la toolbar
- Botón `mat-icon-button` con icono `menu` en la toolbar para toggle

### 2. CSS Responsive (SCSS)
- **Archivo:** `src/app/app.scss` (renombrado de `.css`)
- `@media (max-width: 767.98px)`:
  - Altura del toolbar: 56px (vs 64px en desktop)
  - Padding del contenido: 12px (vs 24px en desktop)
- Clase `.table-container` con `overflow-x: auto` para scroll horizontal en tablas
- Estilos para formulario de settings: `max-width: 480px`, inputs full-width

### 3. Tablas Responsive
- **Archivos:** `src/app/pages/executions/executions.ts`, `src/app/pages/comments/comments.ts`
- Tablas envueltas en `<div class="table-container">` con scroll horizontal en mobile

### 4. Formulario de Settings
- **Archivo:** `src/app/pages/settings/settings.ts`
- Clases CSS `.settings-form`, `.form-field`, `.save-button`
- Inputs full-width con `box-sizing: border-box`
- Label semi-bold, inputs con borde y border-radius

### 5. PWA (Progressive Web App)
- **Dependencia:** `@angular/service-worker@^21.2.13`
- **Archivos nuevos:**
  - `src/manifest.webmanifest` — nombre, íconos, theme_color, display standalone
  - `src/ngsw-config.json` — cacheo de assets (app, fonts)
  - `public/icon-192x192.png` — icono PWA 192x192
  - `public/icon-512x512.png` — icono PWA 512x512
  - `scripts/generate-icons.cjs` — script Node.js para regenerar íconos
- **Archivos modificados:**
  - `angular.json` — `"serviceWorker": "src/ngsw-config.json"` agregado
  - `src/app/app.config.ts` — `provideServiceWorker()` agregado (solo en prod)
  - `src/index.html` — theme-color meta, manifest link, apple-touch-icon

### 6. Migración CSS → SCSS
- `src/app/app.css` → `src/app/app.scss`
- `src/styles.css` → `src/styles.scss`
- `angular.json` actualizado para apuntar a `styles.scss`

## Breakpoint
- **768px** (tablet landscape / portrait breakpoint)
- Desktop: ≥ 768px — sidenav fijo siempre visible
- Mobile: < 768px — sidenav overlay con hamburguesa

## Archivos Modificados
| Archivo | Tipo |
|---------|------|
| `src/app/app.ts` | Modificado |
| `src/app/app.html` | Modificado |
| `src/app/app.scss` | Nuevo (renombrado) |
| `src/styles.scss` | Nuevo (renombrado) |
| `src/app/app.config.ts` | Modificado |
| `src/app/app.spec.ts` | Modificado |
| `src/index.html` | Modificado |
| `src/app/pages/executions/executions.ts` | Modificado |
| `src/app/pages/comments/comments.ts` | Modificado |
| `src/app/pages/settings/settings.ts` | Modificado |
| `angular.json` | Modificado |
| `src/manifest.webmanifest` | Nuevo |
| `src/ngsw-config.json` | Nuevo |
| `public/icon-192x192.png` | Nuevo |
| `public/icon-512x512.png` | Nuevo |
| `scripts/generate-icons.cjs` | Nuevo |
| `docs/mobile-support-plan.md` | Este archivo |
