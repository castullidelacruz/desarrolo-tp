INFORME DE DESPLIEGUE – BACKEND Y FRONTEND 
1. Introducción 
Este documento detalla paso a paso el proceso de despliegue del backend (Render) y frontend (Netlify) del proyecto, incluyendo configuración de variables de entorno, ajustes en el código, manejo de CORS y otros aspectos técnicos relevantes. También se incluyen los prompts de IA utilizados durante el proceso de soporte. 
2. Despliegue del Backend en Render 
• Se creó un nuevo Web Service en Render apuntando al repositorio GitHub del proyecto (carpeta /packages/backend). 
• Build Command: npm install 
• Start Command: npm start --workspace=backend 
• Node Version: 22.x 
• Se agregaron las variables de entorno: 
ALLOWED_ORIGINS=http://localhost:3000,https://dynamic-daffodil-ec5633.netlify.app
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=dfasvgc3f
CLOUDINARY_API_KEY=545938111418335
CLOUDINARY_API_SECRET=_gh3U2yH38rP_JjFztAeuIw2LGk
• Se verificó correctamente en el log: “MongoDB is connected”. 
3. Despliegue del Frontend en Netlify 
• Se subió el proyecto a un repositorio personal de GitHub para evitar limitaciones de organización. • Netlify detectó automáticamente el workspace “packages/frontend”.
• Build Command: npm --workspace frontend run build 
• Publish Directory: packages/frontend/build 
• Se agregó variable de entorno: 
- REACT_APP_API_URL=https://backend-dds.onrender.com 
• Se realizó deploy exitoso y verificación manual. 
4. Conexión Frontend ↔ Backend 
• En el frontend se utiliza apiCall.js apuntando a process.env.REACT_APP_API_URL. • En producción el frontend hace requests a: 
https://backend-dds.onrender.com 
• Backend respondió correctamente luego de habilitar el dominio Netlify en CORS. 

5. Prompts de IA utilizados 
Para el deploy el requerimiento es el siguiente: “Despliegue del aplicativo en la nube (Backend + Frontend). Documentación acerca del despliegue del aplicativo que contenga el detalle de los pasos a seguir para desplegar el aplicativo por primera vez y por cada vez que se quiere subir a producción una nueva release . Render como Cloud Application Platform para el despliegue de nuestro Backend (se pueden utilizar algunas otras alternativas, a criterio del equipo y en común acuerdo con el equipo docente). Netlify como plataforma para despliegue de nuestro Frontend (se pueden utilizar algunas otras alternativas, a criterio del equipo y en común acuerdo con el equipo docente)”
Estos prompts se usaron para guiar el proceso de debugging y despliegue mediante IA. 
6. Conclusión 
Ambos servicios quedaron correctamente desplegados: 
• Backend operativo: https://backend-dds.onrender.com 
• Frontend operativo: https://dynamic-daffodil-ec5633.netlify.app/
El sistema funciona correctamente con base de datos remota, Cloudinary habilitado y comunicación segura entre servicios.
