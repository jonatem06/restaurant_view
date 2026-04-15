# Frontend POS para Restaurante

Sistema de Punto de Venta (POS) desarrollado con React, Vite y Tailwind CSS.

## 🚀 Tecnologías
- **React 18** + **Vite**
- **Tailwind CSS** para el diseño
- **Axios** para peticiones API
- **React Router DOM** para navegación
- **Recharts** para visualización de datos
- **Socket.io-client** para actualizaciones en tiempo real (Cocina)
- **Lucide React** para iconografía

## 🛠️ Configuración

1.  Instalar dependencias:
    ```bash
    npm install
    ```
2.  Configurar variables de entorno:
    Crea un archivo `.env` basado en `.env.example`.
    ```env
    VITE_API_URL=http://localhost:3000
    ```
3.  Iniciar en modo desarrollo:
    ```bash
    npm run dev
    ```

## 🐳 Dockerización

El proyecto está listo para ser desplegado con Docker:

```bash
docker-compose up --build
```

## 📂 Estructura del Proyecto
- `src/api`: Configuración de Axios e interceptores.
- `src/components`: Componentes reutilizables y Layout.
- `src/context`: Contexto de autenticación.
- `src/pages`: Vistas principales (Dashboard, POS, Cocina, etc.).
- `src/services`: Capa de servicios para comunicación con el backend.

## 🔑 Roles y Accesos
- **Gerente**: Acceso total (Dashboard, Personal, Productos, Finanzas, POS, Cocina).
- **Vendedor**: Acceso a POS.
- **Cocina**: Acceso a Monitor de Cocina.

