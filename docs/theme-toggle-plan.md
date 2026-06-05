# Theme Toggle — Spec

Agregar selector de tema (claro/oscuro/sistema) usando el sistema de theming M3 de Angular Material v21.

## Stack
- Angular Material M3 (`mat.define-theme()`) — CSS custom properties `--mat-sys-*`
- Angular Signals para estado reactivo del tema
- `localStorage` para persistencia
- `prefers-color-scheme` media query para modo sistema

## Arquitectura

### ThemeService (`src/app/services/theme.service.ts`)
- `preference: Signal<ThemePreference>` — `'light' | 'dark' | 'system'`
- `effective: Signal<'light' | 'dark'>` — tema efectivo (nunca `'system'`)
- `osDark: Signal<boolean>` — sigue `prefers-color-scheme` en tiempo real
- Persiste preferencia en `localStorage` key `theme-preference`
- Aplica/remueve clase `.dark` en `<html>` mediante `effect()`
- Actualiza `<meta name="theme-color">` según tema activo
- Usa `effect()` de Angular para reaccionar automáticamente

### Temas M3 (`src/styles.scss`)
```scss
$light-theme: mat.define-theme((color: (theme-type: light, primary: mat.$violet-palette)));
$dark-theme: mat.define-theme((color: (theme-type: dark, primary: mat.$violet-palette)));
html { @include mat.all-component-themes($light-theme); }
html.dark { @include mat.all-component-themes($dark-theme); }
```

### UI — Toggle en toolbar
- Botón `mat-icon-button` en toolbar
- Icono dinámico según preferencia: `light_mode` / `dark_mode` / `brightness_auto`
- Al hacer click: cicla `light → dark → system → light`
- Tooltip indicando modo actual

### Estilos custom (`src/app/app.scss`)
Reemplazar colores hardcodeados por CSS custom properties de Material:
| Antes | Después |
|-------|---------|
| `#e8def8` | `var(--mat-sys-primary-container)` |
| `#1d192b` | `var(--mat-sys-on-primary-container)` |
| `#fff` | `var(--mat-sys-surface)` |
| `#333` | `var(--mat-sys-on-surface)` |
| `#666` | `var(--mat-sys-on-surface-variant)` |
| `#ccc` | `var(--mat-sys-outline)` |
| `#e0e0e0` | `var(--mat-sys-outline-variant)` |
| `#673ab7` | `var(--mat-sys-primary)` |
| `#fff` (texto) | `var(--mat-sys-on-primary)` |

### Anti-flash
Script inline en `index.html` que lee `localStorage` y aplica clase `.dark` antes de que Angular bootstrapee.

## Archivos a modificar/crear
| Archivo | Acción |
|---------|--------|
| `docs/theme-toggle-plan.md` | CREAR (este documento) |
| `src/app/services/theme.service.ts` | CREAR |
| `src/styles.scss` | MODIFICAR |
| `src/app/app.ts` | MODIFICAR |
| `src/app/app.html` | MODIFICAR |
| `src/app/app.scss` | MODIFICAR |
| `src/index.html` | MODIFICAR |
