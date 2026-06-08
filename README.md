# GourmetOS

Sistema de gestión para restaurante con backend en Node.js/Express y frontend en React/Vite.

## Requisitos

- Node.js 18+
- npm 9+
- MySQL Server
- Git

## 1. Clonar el repositorio

```bash
git clone https://github.com/Kairuzpdm/GourmetOS.git
cd GourmetOS
```

## 2. Crear la base de datos

Importa el script SQL incluido en la raíz del proyecto:

```bash
mysql -u TU_USUARIO -p < database.sql
```

Si prefieres usar phpMyAdmin o MySQL Workbench, ejecuta el contenido de `database.sql` en una base nueva llamada `restaurante_db`.

## 3. Configurar variables de entorno del backend

Crea un archivo `.env` dentro de `backend/` con la configuración de tu base de datos:

```env
DB_HOST=localhost
DB_USER=TU_USUARIO
DB_PASSWORD=TU_PASSWORD
DB_NAME=restaurante_db
PORT=3000
```

## 4. Instalar dependencias

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

## 5. Ejecutar la aplicación

Inicia el backend:

```bash
cd backend
npm run dev
```

Inicia el frontend en otra terminal:

```bash
cd frontend
npm run dev
```

El frontend quedará disponible en `http://localhost:5173` y la API en `http://localhost:3000`.

## 6. Acceso de prueba

El script `database.sql` incluye cuentas de ejemplo. Puedes iniciar sesión con:

- Usuario: `admin`
- Contraseña: `admin123`

## 7. Scripts útiles

Backend:
- `npm run dev` → inicia el servidor con nodemon
- `npm start` → inicia el servidor en modo normal

Frontend:
- `npm run dev` → inicia el servidor de desarrollo
- `npm run build` → genera la versión de producción
- `npm run preview` → previsualiza el build
