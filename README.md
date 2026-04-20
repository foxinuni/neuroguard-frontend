# NeuroGuard — Página Web (Dashboard)

> Documentación de la arquitectura, organización y tecnologías del dashboard web.

---

## Tabla de contenidos

1. [¿Qué es NeuroGuard?](#1-qué-es-neuroguard)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Páginas de la aplicación](#3-páginas-de-la-aplicación)
4. [Contextos globales](#4-contextos-globales)
5. [Componentes de UI](#5-componentes-de-ui)
6. [Componentes del Dashboard](#6-componentes-del-dashboard)
7. [Hooks personalizados](#7-hooks-personalizados)
8. [Librería de utilidades](#8-librería-de-utilidades)
9. [Librerías para gráficas](#9-librerías-para-gráficas)
10. [Stack tecnológico completo](#10-stack-tecnológico-completo)
11. [Flujo de datos en tiempo real](#11-flujo-de-datos-en-tiempo-real)
12. [Configuración e infraestructura](#12-configuración-e-infraestructura)

---

## 1. ¿Qué es NeuroGuard?

Es un sistema IoT clínico para **monitoreo continuo de pacientes con epilepsia**. Detecta en tiempo real crisis tónico-clónicas usando sensores fisiológicos y de movimiento en un wearable ESP32. El frontend React es la capa de visualización que se conecta con Firebase Firestore y muestra los datos del sensor.

**Usuarios objetivo:**
- Pacientes con epilepsia diagnosticada
- Familiares y cuidadores
- Neurólogos que requieren historial de eventos y métricas objetivas

---

## 2. Estructura del proyecto

```
neuroguard-frontend/
├── index.html                  ← Punto de entrada HTML (fuente de Inter, title "NeuroGuard — Dashboard")
├── vite.config.js              ← Configuración de Vite con plugin React y Tailwind
├── package.json                ← Dependencias del proyecto
├── eslint.config.js            ← Reglas ESLint para React Hooks y React Refresh
├── Dockerfile                  ← Imagen de producción (nginx para servir el build)
├── .env.example                ← Variables de entorno necesarias (Firebase keys)
├── .gitignore                  ← Excluye node_modules, dist, .env
├── .dockerignore               ← Excluye node_modules y archivos innecesarios del build Docker
├── public/
│   └── favicon.svg             ← Ícono de la aplicación
└── src/
    ├── main.jsx                ← Monta React en #root con BrowserRouter
    ├── App.jsx                 ← Enrutamiento principal de la SPA
    ├── index.css               ← Estilos globales (Tailwind v4 + tema NeuroGuard)
    ├── firebase.js             ← Inicialización de Firebase (Auth + Firestore)
    ├── assets/
    │   └── logo.png            ← Logo de NeuroGuard
    ├── contexts/               ← Estado global (React Context API)
    │   ├── AuthContext.jsx
    │   └── ThemeContext.jsx
    ├── components/
    │   ├── Layout.jsx          ← Shell del dashboard autenticado
    │   ├── ProtectedRoute.jsx  ← Guarda de rutas privadas
    │   ├── ui/                 ← Primitivos de UI reutilizables
    │   │   ├── Spinner.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Card.jsx
    │   │   └── ThemeToggle.jsx
    │   └── dashboard/          ← Widgets del panel médico
    │       ├── PatientHeader.jsx
    │       ├── VitalsRealtime.jsx
    │       ├── RealtimeCharts.jsx
    │       ├── CrisisSummaryCards.jsx
    │       ├── LastEventDetail.jsx
    │       ├── EventPhaseChart.jsx
    │       ├── HrSpo2PhaseChart.jsx
    │       ├── CrisisTrendBar.jsx
    │       └── CrisisDistributionPie.jsx
    ├── hooks/                  ← Conexión reactiva con Firestore
    │   ├── usePatientProfile.js
    │   ├── useLatestTelemetry.js
    │   ├── useTelemetryHistory.js
    │   ├── useEvents.js
    │   ├── useEventReadings.js
    │   └── useDeviceStatus.js
    ├── lib/                    ← Lógica analítica y utilidades
    │   ├── analytics.js
    │   ├── formatters.js
    │   └── userService.js
    └── pages/
        ├── HomePage.jsx
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── SetupDevicePage.jsx
        └── DashboardPage.jsx
```

---

## 3. Páginas de la aplicación

| Página | Ruta | Descripción |
|---|---|---|
| `HomePage.jsx` | `/` | Landing pública con presentación del sistema, features, CTA y footer |
| `LoginPage.jsx` | `/login` | Autenticación con email/contraseña o Google Sign-In |
| `RegisterPage.jsx` | `/register` | Registro de nuevo paciente + vinculación del dispositivo ESP32 |
| `SetupDevicePage.jsx` | `/setup-device` | Configuración inicial del ID del dispositivo (primer acceso) |
| `DashboardPage.jsx` | `/dashboard` | Panel principal de monitoreo (requiere autenticación) |

### Flujo de autenticación y navegación

```
Usuario abre app
      │
      ▼
AuthContext verifica estado Firebase Auth
      │
      ├── No autenticado ──────────────────────► /login
      │
      └── Autenticado
              │
              ├── Sin patientId (primer acceso) ► /setup-device
              │
              └── Con patientId ────────────────► /dashboard
```

---

## 4. Contextos globales

### `AuthContext.jsx`

Estado global de la sesión de usuario. Provee a toda la app:

| Valor / Función | Descripción |
|---|---|
| `user` | Objeto de usuario de Firebase Auth |
| `patientId` | ID del paciente en Firestore (`users/{uid}.patient_id`) |
| `displayName` | Nombre del usuario |
| `loading` | `true` mientras se verifica la sesión inicial |
| `logout()` | Cierra sesión en Firebase |
| `loginWithGoogle()` | Autenticación con popup de Google (OAuth 2.0) |
| `refreshProfile()` | Recarga el perfil desde Firestore |

Internamente escucha `onAuthStateChanged` de Firebase y lee el documento `users/{uid}` para obtener el `patient_id` y `display_name`.

### `ThemeContext.jsx`

Maneja el tema claro/oscuro:

- **Persistencia**: preferencia guardada en `localStorage` bajo la clave `ng-theme`
- **Implementación**: el modo oscuro es el predeterminado; el modo claro se activa añadiendo la clase `.light` al elemento `<html>`

---

## 5. Componentes de UI

Primitivos reutilizables en `src/components/ui/`:

| Componente | Descripción |
|---|---|
| `Spinner.jsx` | Anillo animado centrado con texto "Cargando…", usado mientras cargan datos o sesión |
| `Badge.jsx` | Etiqueta redondeada con clases Tailwind combinables (severidad, estado) |
| `Card.jsx` | Contenedor con bordes, sombra y soporte de modo claro. Acepta prop `glow` para efecto de brillo |
| `ThemeToggle.jsx` | Botón sol/luna que llama a `toggle()` de `ThemeContext`, con `aria-label` accesible |

---

## 6. Componentes del Dashboard

### `PatientHeader.jsx`

Barra superior del panel médico. Muestra:
- **Inicial y nombre** del paciente (desde perfil Firestore)
- **Tipo de epilepsia** registrado en el perfil
- **Indicador online/offline** del ESP32: círculo verde con animación `pulse-live` si está conectado, gris si está offline

### `VitalsRealtime.jsx`

Cuatro tarjetas con los signos vitales actuales, actualizadas con cada nueva lectura del sensor:

| Vital | Sensor | Unidad | Alerta visual |
|---|---|---|---|
| Frecuencia Cardíaca | MAX30102 | bpm | HR > 120 o `finger = false` |
| SpO₂ | MAX30102 | % | SpO₂ < 90 o `finger = false` |
| Acelerómetro (magnitud) | GY-85 ADXL345 | g | acc_mag > 2.0 |
| Giroscopio (magnitud) | GY-85 ITG3205 | °/s | gyro_mag > 150 |

Cuando se supera el umbral, la tarjeta cambia a fondo rojo. El texto "Sin contacto" aparece bajo HR y SpO₂ cuando `finger = false`.

### `RealtimeCharts.jsx`

Cuatro gráficas de área en tiempo real que representan los últimos ~2 minutos de datos:

| Gráfica | Color | Dominio Y |
|---|---|---|
| Frecuencia Cardíaca | Rojo `#EF4444` | 40–180 bpm |
| SpO₂ | Azul `#3B82F6` | 70–100% |
| Acelerómetro | Ámbar `#F59E0B` | 0–6 g |
| Giroscopio | Violeta `#8B5CF6` | 0–400 °/s |

Características:
- Degradado de relleno: `30% opacidad → 2%`
- Animación desactivada (`isAnimationActive={false}`) para evitar artefactos en tiempo real
- Eje X con hora formateada `HH:MM:SS`
- Colores de ejes y grid adaptativos al tema claro/oscuro

### `CrisisSummaryCards.jsx`

Tres tarjetas de estadísticas rápidas calculadas en el cliente:

- **Última Crisis**: tiempo transcurrido desde el evento más reciente (ej: "hace 3 horas")
- **Última Semana**: total de crisis en 7 días + número de prolongadas (> 2 minutos)
- **Último Mes**: total de crisis en 30 días + prolongadas

### `LastEventDetail.jsx`

Tarjeta detallada del evento seleccionado (por defecto el más reciente):

- Badge de severidad coloreado (`low` amarillo / `medium` naranja / `high` rojo)
- Fecha relativa humanizada con `date-fns`
- Duración formateada (ej: "1 min 30 seg")
- HR pico vs frecuencia basal (72 bpm por defecto)
- SpO₂ mínima durante la crisis
- % de actividad motora elevada

Si hay más de un evento, aparece un `<select>` para navegar entre todas las crisis del historial.

### `EventPhaseChart.jsx`

Gráfica de líneas con `acc_mag` y `gyro_mag` durante un evento específico, con regiones de fondo coloreadas por fase clínica:

| Fase | Color de fondo |
|---|---|
| `pre` — Pre-ictal | Azul claro |
| `tonic` — Tónica | Rojo claro |
| `clonic` — Clónica | Rojo más intenso |
| `post` — Post-ictal | Verde claro |

El eje X es tiempo en segundos desde el inicio del evento (t₀). Los datos provienen de `useEventReadings` filtrando por `crisis_id`.

### `HrSpo2PhaseChart.jsx`

Igual estructura de fases que `EventPhaseChart`, pero muestra la respuesta fisiológica:
- Línea roja: HR en bpm (eje Y izquierdo, 40–180)
- Línea azul: SpO₂ en % (eje Y derecho, 70–100)

Permite correlacionar visualmente la taquicardia ictal y la desaturación con las fases motoras.

### `CrisisTrendBar.jsx`

Gráfica de barras con doble serie que muestra la tendencia de crisis en las últimas 4 semanas:
- Barras de **total de crisis** por semana
- Barras de **crisis prolongadas** (> 120 segundos) superpuestas

Útil para detectar si el paciente está mejorando o empeorando en el tiempo.

### `CrisisDistributionPie.jsx`

Gráfico de dona que muestra la proporción de crisis **nocturnas** (22:00–06:00) vs **diurnas**. Debajo del gráfico se muestran las cifras absolutas y porcentajes. No renderiza si no hay eventos. La distribución nocturna es clínicamente relevante por el riesgo elevado de las crisis sin asistencia.

---

## 7. Hooks personalizados

Todos los hooks de datos usan `onSnapshot()` de Firestore para reactividad en tiempo real. Cuando el backend escribe en Firestore, el cliente React se actualiza automáticamente sin polling.

| Hook | Ruta en Firestore | Propósito |
|---|---|---|
| `useLatestTelemetry(patientId, deviceId)` | `patients/{id}/devices/{id}/latest/current` | Lectura más reciente del sensor (se actualiza cada ~500ms) |
| `useTelemetryHistory(telemetry)` | *(buffer en memoria)* | Acumula hasta 120 puntos únicos para las gráficas de área (~2 min) |
| `useEvents(patientId, maxEvents)` | `patients/{id}/events` | Lista de crisis detectadas, ordenadas por timestamp desc, límite 50 |
| `useEventReadings(patientId, deviceId, crisisId)` | `patients/{id}/devices/{id}/readings` | Lecturas históricas de una crisis específica (filtradas por `crisis_id`) |
| `useDeviceStatus(deviceId)` | `devices/{deviceId}` | Estado `online`/`offline` del ESP32 en tiempo real |
| `usePatientProfile(patientId)` | `patients/{patientId}` | Perfil clínico del paciente (nombre, tipo de epilepsia, deviceId) |

---

## 8. Librería de utilidades

### `lib/analytics.js`

Funciones de análisis sobre el array de eventos (sin consultas extra a Firestore):

| Función | Descripción |
|---|---|
| `computeWeeklyCounts(events, weeks)` | Divide el historial en N semanas y cuenta crisis totales + prolongadas por semana |
| `nightDayDistribution(events)` | Cuenta crisis nocturnas vs diurnas usando el campo `is_nocturnal` |
| `countCrises(events, days)` | Filtra por ventana temporal y cuenta totales + prolongadas (> 120s) |

### `lib/formatters.js`

| Función | Ejemplo de salida |
|---|---|
| `timeAgo(iso)` | "hace 3 horas", "hace 2 días" |
| `formatDuration(s)` | "1 min 30 seg", "45 seg" |
| `severityStyle(sev)` | Clases CSS para badge de color según severidad |
| `formatBpm(v)` | "138" |
| `formatSpo2(v)` | "87%" |
| `formatG(v)` | "3.1" |

Usa `date-fns` con locale `es` para los relativos de tiempo en español.

### `lib/userService.js`

- **`createUserProfile(uid, deviceId, displayName)`**: valida el `deviceId` contra el mapa fijo `DEVICE_TO_PATIENT` (`esp32_001` → `paciente_001`), luego escribe el documento `users/{uid}` en Firestore con `patient_id`, `device_id`, `display_name` y `created_at`.

---

## 9. Librerías para gráficas

La librería de gráficas es **[Recharts](https://recharts.org/)** (v3.x). Se usan cuatro tipos de chart distintos:

| Tipo Recharts | Componente que lo usa | Descripción |
|---|---|---|
| `AreaChart` | `RealtimeCharts` | Monitoreo continuo de HR, SpO₂, acc y gyro en tiempo real con degradado de relleno |
| `LineChart` + `ReferenceArea` | `EventPhaseChart`, `HrSpo2PhaseChart` | Evolución de señales durante las fases de una crisis, con regiones de fondo coloreadas |
| `BarChart` | `CrisisTrendBar` | Tendencia semanal de crisis totales vs prolongadas (doble serie de barras) |
| `PieChart` | `CrisisDistributionPie` | Distribución nocturna/diurna en formato dona con etiquetas de porcentaje |

### Características comunes de las gráficas

- **`isAnimationActive={false}`** en todas — evita artefactos visuales al actualizar datos en tiempo real
- **Tema dinámico** — los colores de ejes, grid, tooltips y rellenos cambian con `useTheme()`
- **`date-fns`** para formatear las etiquetas del eje X (`HH:MM:SS`)
- **`interval="preserveStartEnd"`** en el eje X para no saturar de etiquetas
- **Tooltips personalizados** con estilos definidos en `index.css` (clase `.recharts-tooltip-wrapper`)

---

## 10. Stack tecnológico completo

| Tecnología | Versión | Rol |
|---|---|---|
| **React** | 19 | Librería de UI principal |
| **Vite** | 8 | Bundler y servidor de desarrollo con HMR |
| **Tailwind CSS** | v4 | Estilos utilitarios (integrado como plugin de Vite, sin `tailwind.config.js`) |
| **Firebase JS SDK** | 12 | Autenticación (Auth) y base de datos en tiempo real (Firestore) |
| **Recharts** | 3 | Todas las gráficas del dashboard |
| **React Router** | 7 | Navegación entre páginas (SPA con `BrowserRouter`) |
| **date-fns** | 4 | Formateo y cálculo de fechas en español |
| **ESLint** | 9 | Linting con reglas para `react-hooks` y `react-refresh` |

### Herramientas de desarrollo

| Herramienta | Versión | Descripción |
|---|---|---|
| `@vitejs/plugin-react` | 6 | Plugin de React para Vite (usa Oxc para transformación JSX) |
| `@tailwindcss/vite` | 4 | Integración de Tailwind directamente en el pipeline de Vite |
| `globals` | 17 | Definiciones de variables globales para ESLint |

---

## 11. Flujo de datos en tiempo real

```
ESP32 (sensor wearable)
    │ MQTT/TLS · cada 500ms
    ▼
HiveMQ Cloud (broker)
    │ Suscripción wildcard
    ▼
Backend Python (Subscriber + CrisisDetector)
    │ Firebase Admin SDK
    ├──► Sobreescribe latest/current en Firestore  ─────────────────────────┐
    ├──► Guarda lectura en readings (submuestreo 1/5)                       │
    └──► Si detecta crisis → escribe en events ──────────────────────────┐  │
                                                                          │  │
Dashboard React                                                           │  │
    ├── useLatestTelemetry ◄──── onSnapshot(latest/current) ◄────────────┘  │
    │       │                                                                │
    │       ▼                                                                │
    ├── useTelemetryHistory (buffer 120 puntos en memoria)                   │
    │       │                                                                │
    │       ▼                                                                │
    │   RealtimeCharts + VitalsRealtime (se actualizan cada ~500ms)          │
    │                                                                        │
    └── useEvents ◄──────────────── onSnapshot(events) ◄────────────────────┘
            │
            ▼
        CrisisSummaryCards + LastEventDetail + CrisisTrendBar + CrisisDistributionPie
```

**Latencia total típica: 1–3 segundos** desde que el sensor captura el dato hasta que aparece en pantalla.

---

*NeuroGuard — Pontificia Universidad Javeriana · Proyecto IoT 2026*
