# InnovaTube - Backend

Este es el backend de **InnovaTube**, una aplicación web que permite buscar videos de YouTube, iniciar sesión, registrarse, recuperar contraseña y guardar favoritos. 
Este backend maneja la autenticación, persistencia de favoritos, y responde a peticiones del frontend.

---

## Funcionalidades

- Registro, inicio de sesión de usuarios y recuperación de contraseña
- Autenticación con JWT
- API REST para:
  - Usuarios
  - Favoritos
- Cifrado de contraseñas 
- Validación de tokens
- Middleware para proteger rutas privadas
- MongoDB como base de datos
- Validacion de reCAPTCHAT
- Despliegue en Railway

---

## 🛠 Tecnologías

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/) 
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Railway](https://railway.app/) (Hosting)

---

## 📦 Instalación

```bash
# Clona el repositorio
git clone https://github.com/Pedro-Calderon/Backend
cd Backend

# Instala dependencias
npm install

# Crea un archivo .env en la raiz.
 .env

en el archivo .env agregas tus claves, Ejemplo:

PORT=5000
MONGODB_URI=clave_Mongo
JWT_SECRET=clave_secreta
