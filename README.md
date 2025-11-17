Este repositorio es la base para el Trabajo Práctico de la materia **Desarrollo de Software (DDS)** de la carrera **Ingeniería en Sistemas de Información** de la **UTN FRBA**. Se trata de un **monorepo** que integra una aplicación frontend con Create React App y un backend con Express, facilitando el desarrollo y la gestión de ambos proyectos en un único entorno.

## 📦 Estructura del Proyecto

El monorepo está organizado de la siguiente manera:

```
.
├── packages/
│   ├── backend/        # Servidor Express.js
│   └── frontend/       # Aplicación React (Create React App)
├── package.json        # Configuración del monorepo (root)
├── README.md           # Este archivo
└── .env.example        # Ejemplo de configuración de variables de entorno
```

## ⚙️ Paquetes

Este monorepo utiliza **`npm workspaces`** para gestionar los diferentes paquetes.

### Backend (`packages/backend`)

El backend está construido con Express.js y utiliza las siguientes dependencias:

- **`express`**: El framework web para Node.js, utilizado para construir la API.
- **`cors`**: Middleware para Express que habilita Cross-Origin Resource Sharing (CORS), necesario para permitir que el frontend acceda al backend desde un origen diferente.
- **`dotenv`**: Carga variables de entorno desde un archivo `.env` en `process.env`. Es crucial para configurar el puerto del servidor y los orígenes permitidos.

La idea es dar lo mínimo para levantar el servidor, y que durante el desarrollo del TP se vayan agregando las dependencias necesarias.

### Frontend (`packages/frontend`)

El frontend es una aplicación de React generada con Create React App.

## 🚀 Inicio Rápido

Seguí estos pasos para poner en marcha el proyecto:

### 1\. Instalación de Dependencias

Desde la raíz del monorepo, ejecutá:

```bash
npm install
```

Esto instalará todas las dependencias para la raíz y para los paquetes `frontend` y `backend`.

### 2\. Configuración de Variables de Entorno

Crea un archivo `.env` en el directorio `packages/backend`. Puedes usar el archivo `.env.example` como plantilla.

```
# packages/backend/.env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
SERVER_PORT=3001
```

- **`ALLOWED_ORIGINS`**: Define los orígenes permitidos para las solicitudes CORS. Asegurate de incluir la URL donde se ejecuta tu frontend (por defecto, `http://localhost:3000` para Create React App). Cuando se haga el despliegue en nube acá se deberá incluir la URL donde se desplegó el frontend.
- **`SERVER_PORT`**: El puerto en el que se ejecutará el servidor backend (ej. `8000`).

### 3\. Ejecución de la Aplicación

Podés iniciar el frontend y el backend por separado o ambos a la vez:

#### Ejecutar el Backend

```bash
npm run start:backend
```

Para el desarrollo con reinicio automático:

```bash
npm run dev:backend
```

#### Ejecutar el Frontend

```bash
npm run start:frontend
```

#### Ejecutar Ambos (Desarrollo)

Para iniciar el backend en modo `dev` y el frontend simultáneamente, usá:

```bash
npm run start:dev
```

## 🚀 Flujo de Trabajo y Convenciones del Proyecto

Convenciones que seguimos para el desarrollo, control de versiones y gestión de commits.

### 🏗️ Gitflow: Convención de Ramas

Este flujo de trabajo se basa en las ramas **`main`** y **`develop`**, con el apoyo de ramas de **`feature`** y **`hotfix`**.

#### 🌿 Ramas Principales

- **`main`**: Esta es la rama **principal**. Cualquier cambio aquí debe venir de la rama `develop` (o de un `hotfix`) y siempre a través de un **Pull Request** (PR), se realizará luego de cada **entrega del TP**.

- **`develop`**: Esta es la rama de **desarrollo**. Es la rama de trabajo principal donde se integran todos los nuevos _features_. Al finalizar una entrega, `develop` se fusiona con `main`.

#### 🌳 Ramas de Apoyo

- **`feature/<nombre-del-feature>`**: Para desarrollar una nueva funcionalidad (ya sea para el frontend o el backend), se crea una rama a partir de `develop`. El nombre de la rama debe ser descriptivo.
  - **Ejemplos**: `feature/endpoints-pedido`, `feature/home-front`.
  - **Creación**:
    ```bash
    git checkout develop && git checkout -b feature/<nombre-del-feature>
    ```
  - **Integración**: Al terminar el _feature_, se crea un **PR** a `develop`.

- **`hotfix/<nombre-del-hotfix>`**: Se crea una rama a partir de **`main`** para corregir un _bug_ crítico que se haya. El _hotfix_ se fusiona tanto con `main` (para la corrección inmediata) como con `develop` (para que el _bug_ no reaparezca).
  - **Creación**:
    ```bash
    git checkout main && git checkout -b hotfix/<nombre-del-hotfix>
    ```
  - **Integración**: Al terminar, se fusiona con `main` y luego con `develop`.

---

### ✍️ Convención de Commits

Cada mensaje de _commit_ debe tener un **tipo**, un **ámbito** y una **descripción**.

#### Formato

El formato general es: `<tipo>(<ámbito>): <descripción>`

#### Tipos (Obligatorio)

- **`feat`**: Una **nueva funcionalidad**. Ejemplo: `feat: agregar catalogo`
- **`fix`**: Una **corrección de un _bug_**. Ejemplo: `fix: corregir error de login`
- **`docs`**: Cambios en la **documentación**. Ejemplo: `docs: actualizar README BACKEND`
- **`style`**: Cambios que no afectan el código (formato, espacios, etc.). Ejemplo: `style: formatear codigo con prettier`
- **`refactor`**: Refactorización de código sin cambiar la funcionalidad. Ejemplo: `refactor: modularizar funciones de validacion`
- **`test`**: Agregar o corregir **tests**. Ejemplo: `test: agregar tests para la api de productos`

#### Ámbito (Opcional)

El ámbito identifica la parte del **monorepo** que se modificó.

- **`backend`**
- **`frontend`**
- **`general`** (cuando afecta a ambos o a la configuración general)

**Ejemplos con ámbito:**

- `feat(backend): agregar endpoint para estado`
- `fix(frontend): corregir error de renderizado en el carrito`
- `feat(general): conexión con endpoints producto`

#### Descripción (Obligatorio)

- Debe ser **concisa** (menos de 50 caracteres).
- Debe comenzar con una letra **minúscula**.
- Debe estar en **modo imperativo**, como una orden.
- No debe terminar con un punto.

**Ejemplo Completo**
Un buen mensaje de _commit_ se vería así:

`feat(frontend): agregar catalogo de productos`
