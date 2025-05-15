
# Guía de Instalación y Prueba de PsyCare API

## Requisitos

-   Node.js (versión LTS recomendada)
-   npm (viene con Node.js)
-   PostgreSQL
-   Git

## Comandos de Instalación

```
# Clonar el repositorio  
git clone https://github.com/ninoxander/psycare-api.git  
cd psycare-api  
  
# Instalar dependencias  
npm install  
  
# Configurar variables de entorno (crear archivo .env)  
echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/psycare_db\"" > .env  
echo "JWT_SECRET=\"tu_clave_secreta_jwt\"" >> .env  
echo "PORT=3000" >> .env  
  
# Generar cliente Prisma y ejecutar migraciones  
npx prisma generate  
npx prisma migrate dev --name init  
  
# Iniciar el servidor  
npm start
```

## Configuración Inicial en Bruno

1.  Abre Bruno y crea una nueva colección:
    -   Nombre: "PsyCare API"
    -   URL Base:  [http://localhost:3000](http://localhost:3000/)
2.  Crea una variable de entorno para el token JWT:
    -   Nombre:  `token`
    -   Valor: (Inicialmente vacío, se llenará después de la autenticación)

## Solicitudes para Probar la API

### 1. Verificar que el Servidor está Funcionando

```
GET http://localhost:3000  

```

-   **Nombre**: Verificar Servidor
-   **Método**: GET
-   **URL**: {{base_url}}
-   **Headers**: Ninguno

### 2. Registrar un Usuario (Signup)

```
POST http://localhost:3000/signup  

```

-   **Nombre**: Registrar Usuario
-   **Método**: POST
-   **URL**: {{base_url}}/signup
-   **Headers**:
    -   Content-Type: application/json
-   **Body**  (JSON):
    
    ```
    {  
      "name": "Usuario Prueba",  
      "email": "test@example.com",  
      "password": "password123"  
    }
    ```
    

### 3. Iniciar Sesión (Login)

```
POST http://localhost:3000/login  

```

-   **Nombre**: Iniciar Sesión
-   **Método**: POST
-   **URL**: {{base_url}}/login
-   **Headers**:
    -   Content-Type: application/json
-   **Body**  (JSON):
    
    ```
    {  
      "email": "test@example.com",  
      "password": "password123"  
    }
    ```
    
-   **Tests**  (Script para guardar el token):
    
    ```
    // Guardar el token JWT en la variable de entorno  
    const response = bru.response;  
    if (response.status === 200 && response.body.token) {  
      bru.setEnvVar("token", response.body.token);  
    }
    ```
    

### 4. Usar Credenciales de Prueba Existentes

```
POST http://localhost:3000/login  

```

-   **Nombre**: Login con Credenciales de Prueba
-   **Método**: POST
-   **URL**: {{base_url}}/login
-   **Headers**:
    -   Content-Type: application/json
-   **Body**  (JSON):
    
    ```
    {  
      "email": "pinki@pai.mlp",  
      "password": "mynameispinkiepie"  
    }
    ```
    
-   **Tests**  (Script para guardar el token):
    
    ```
    // Guardar el token JWT en la variable de entorno  
    const response = bru.response;  
    if (response.status === 200 && response.body.token) {  
      bru.setEnvVar("token", response.body.token);  
    }
    ```
    

### 5. Acceder a un Endpoint Protegido

```
GET http://localhost:3000/users  

```

-   **Nombre**: Obtener Información de Usuario
-   **Método**: GET
-   **URL**: {{base_url}}/users
-   **Headers**:
    -   Authorization: Bearer {{token}}

### 6. Acceder a la Documentación Swagger

Para acceder a la documentación Swagger, simplemente abre tu navegador y visita:

```
http://localhost:3000/api-docs  

```

## Organización de Carpetas en Bruno

Puedes organizar tus solicitudes en carpetas para una mejor estructura:

-   **Autenticación**
    -   Registrar Usuario
    -   Iniciar Sesión
    -   Login con Credenciales de Prueba
-   **Usuarios**
    -   Obtener Información de Usuario
-   **Sistema**
    -   Verificar Servidor

## Notas sobre Autenticación

Todos los endpoints protegidos en PsyCare API requieren un token JWT en el encabezado de autorización. 
Bruno maneja esto automáticamente usando la variable de entorno  `token`  que configuramos en los scripts 
de prueba.