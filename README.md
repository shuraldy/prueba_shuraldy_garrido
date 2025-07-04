Para iniciar el proyecto en el backend:
-estar en el directorio backend
-ejecutar en la consola las migraciones:
php artisan migrate
en las migraciones tambien se hace la modificacion del la tabla usuario
-ejecuatar los seedes, aca se crean los 5 usuarios de prueba que pedian:
-php artisan db:seed --class=UserSeeder
configurar las variables de entorno:
modificar el archivo .env.example a .env y en la linea 22 reemplazar por
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=prueba2
DB_USERNAME=root
DB_PASSWORD=
- guardar
- levantar el servidor con php artisan serve

para iniciar el frontend

-estar en el repositorio de frontend y ejecutar:
ng serve
