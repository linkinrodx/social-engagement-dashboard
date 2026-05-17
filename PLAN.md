# Social Engagement Dashboard — Plan del Proyecto

## Objetivo

Dashboard web para monitorear y administrar el bot de Facebook (Social Engagement Automation), construido con **Angular 21+** y conectado a **Supabase** (misma base de datos del bot).

## Stack Tecnológico

| Componente | Versión / Herramienta |
|-----------|----------------------|
| Framework | Angular 21.2+ (standalone components) |
| UI | Angular Material 21 |
| Lenguaje | TypeScript 5.9 |
| Backend | Supabase (REST API / PostgREST) |
| HTTP | Fetch API (nativo, mismo approach que el bot) |
| Shell | Signals, Reactive Forms, Router |

## Skills de Agente Instalados

Instalados localmente en `.agents/skills/`:

| Skill | Propósito |
|-------|-----------|
| `angular-component` | Componentes standalone |
| `angular-signals` | Signals y reactive context |
| `angular-routing` | Lazy loading y navegación |
| `angular-http` | HTTP client y comunicación API |
| `angular-forms` | Formularios reactivos |
| `angular-material` | Angular Material UI |
| `supabase` | Supabase Auth, RLS, queries |

## Tablas de Supabase Usadas

| Tabla | Operaciones en el Dashboard |
|-------|---------------------------|
| `execution_logs` | Listar historial de ejecuciones |
| `commented_posts` | Ver posts comentados |
| `daily_comment_count` | Mostrar contador del día en Dashboard |
| `settings` | Leer y actualizar configuración del bot |

## Estructura del Proyecto

```
social-engagement-dashboard/
├── .agents/skills/           # Skills locales del agente
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── dashboard/    # Resumen general
│   │   │   ├── executions/   # Historial de ejecuciones
│   │   │   ├── comments/     # Posts comentados
│   │   │   └── settings/     # Configuración del bot
│   │   ├── services/
│   │   │   └── supabase.service.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   ├── main.ts
│   ├── index.html
│   └── styles.css
├── PLAN.md
├── angular.json
└── package.json
```

## Rutas del Dashboard

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/dashboard` | Dashboard | KPIs: comentarios hoy, última ejecución, total ejecuciones |
| `/executions` | Ejecuciones | Tabla con historial completo de ejecuciones del bot |
| `/comments` | Comentarios | Lista de posts comentados |
| `/settings` | Configuración | Formulario para editar settings del bot |

## Conexión a Supabase

El dashboard usa la **misma instancia de Supabase** que el bot (`ghznkyqfgsupbndnucuc`). Las credenciales se configuran via `environment.ts`.

Endpoints REST usados:
- `GET /rest/v1/settings?limit=1`
- `GET /rest/v1/execution_logs?order=started_at.desc&limit=N`
- `GET /rest/v1/commented_posts?order=commented_at.desc&limit=N`
- `GET /rest/v1/daily_comment_count?date=eq.HOY`
- `PATCH /rest/v1/settings?id=eq.ID`

## Pasos Realizados

1. ✅ Creación del proyecto con `ng new` (standalone, routing)
2. ✅ Instalación de npm packages (`@angular/material`, `@angular/cdk`)
3. ✅ Instalación de skills del agente (7 skills locales)
4. ✅ Inicialización de repositorio git
5. ✅ Configuración de Angular Material (theme, animaciones, iconos)
6. ✅ Creación de servicio Supabase con tipados
7. ✅ Creación de 4 páginas lazy-loaded con componentes standalone
8. ✅ Configuración de rutas con lazy loading
9. ✅ Layout con toolbar + sidebar navigation

## Pendientes / Próximos Pasos

- [ ] Configurar `SUPABASE_URL` y `SUPABASE_ANON_KEY` en environments
- [ ] Conectar al repositorio remoto
- [ ] Añadir RLS a las tablas de Supabase (actualmente todas expuestas)
- [ ] Build y deploy
