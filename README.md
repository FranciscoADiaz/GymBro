# 🏋️‍♂️ Sistema de Gestión para Gimnasios (SaaS)

> Una plataforma integral diseñada para modernizar la administración de gimnasios, gestionando socios, membresías y pagos de forma eficiente.

![En desarrollo](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)
![MERN](https://img.shields.io/badge/Stack-MERN-blue)

## 📖 Descripción del Proyecto

Este proyecto es un **Sistema de Gestión (SaaS)** construido desde cero utilizando el stack **MERN** (MongoDB, Express, React, Node.js). El objetivo es proveer una herramienta segura y escalable para que los dueños de gimnasios puedan administrar su negocio.

Actualmente, el proyecto se encuentra en una etapa activa de desarrollo, con el núcleo de seguridad y arquitectura ya implementado.

## 🚀 Tecnologías Utilizadas

El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** para asegurar escalabilidad y mantenimiento.

### Backend
- **Node.js & Express:** Servidor RESTful API.
- **MongoDB Atlas:** Base de datos NoSQL en la nube.
- **Mongoose:** Modelado de datos (ODM).
- **JWT (JSON Web Tokens):** Manejo de sesiones y seguridad.
- **Bcryptjs:** Hashing de contraseñas.

### Frontend
- **React.js:** Librería de UI.
- **Vite:** Entorno de desarrollo rápido.
- **Context API:** Manejo del estado global (AuthContext).
- **Axios:** Consumo de API.
- **CSS Modules:** Estilizado modular.

---

## ⚙️ Funcionalidades (Roadmap)

### ✅ Fase 1: Core & Seguridad (Completado)
- [x] Conexión a Base de Datos (MongoDB Atlas).
- [x] **Autenticación Robusta:** Registro e Inicio de Sesión.
- [x] Protección de rutas (Middleware en Back y ProtectedRoute en Front).
- [x] Encriptación de contraseñas y validación de tokens.
- [x] Roles de usuario (Administrador/Dueño).

### 🚧 Fase 2: Gestión de Socios (En Progreso)
- [ ] CRUD de Socios (Alta, Baja y Modificación).
- [ ] Subida de fotos de perfil.
- [ ] Buscador y filtros de estado (Activo/Deudor).

### 🔜 Próximos Pasos
- Gestión de Membresías y Pagos.
- Dashboard con métricas y reportes.
- Control de Asistencia.

---

## 🛠️ Instalación y Configuración Local

Si deseas correr este proyecto en tu máquina local, sigue estos pasos:

### 1. Clonar el repositorio
git clone https://github.com/FranciscoADiaz/GymBro.git
cd [NOMBRE-DEL-REPO]


### 2. Configurar Backend
cd backend
npm install

### 3. Crea un archivo .env en la carpeta /backend con las siguientes variables:
PORT=
DB_CONNECTION=
JWT_SECRET=

### Iniciar servidor
npm run dev

### 4. Configurar Frontend
cd frontend
npm install

### Crea un archivo .env en la carpeta /frontend para conectar con el backend:
VITE_API_URL=http://localhost:4000/api

### Iniciar el servidor
npm run dev


### Estructura del proyecto
El proyecto está organizado como un Monorepo (Frontend y Backend en el mismo repositorio para facilitar la gestión):
/
├── backend/         # API, Modelos, Controladores (Node/Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
│
├── frontend/        # Interfaz de Usuario (React + Vite)
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── main.jsx
│
└── README.md

### AUTOR: Diaz Francisco Ariel

