# appsalon_mvc

Sistema de gestión y control de citas para un salón o barbería, hecho con **PHP (MVC propio)**, **MySQL/MariaDB**, **JavaScript** y **Sass + Gulp**.

<img src="https://user-images.githubusercontent.com/56383926/224258932-d47ec520-8f38-4522-8a59-3249db697385.png" width="500"/>

[appsalon captura tablet](https://user-images.githubusercontent.com/56383926/224258932-d47ec520-8f38-4522-8a59-3249db697385.png)

> **Nota:** GitHub Pages no ejecuta PHP. Para verla funcionando en línea hace falta un hosting con PHP y MySQL (ver "Despliegue en alwaysdata" más abajo).

## Funciones

- Registro, confirmación de cuenta por correo, login y recuperación de contraseña.
- Clientes: eligen servicios, fecha y hora y reservan su cita (de lunes a viernes, de 9 a 19 h).
- Administrador: consulta las citas por fecha, elimina citas y administra el catálogo de servicios (crear, editar, eliminar).

## Requisitos

- PHP 7.4 o superior (probado con 8.3) con las extensiones `mysqli`, `mbstring`, `openssl` y `curl`
- MySQL 5.7+ / MariaDB 10.3+
- [Composer](https://getcomposer.org/)
- Node.js 18+ (solo si vas a modificar los archivos de `src/`: Sass y JS)

## Ejecutarla en tu computadora

```bash
# 1. dependencias de PHP
composer install

# 2. base de datos
mysql -u root -p -e "CREATE DATABASE appsalon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
mysql -u root -p appsalon < database/schema.sql

# 3. configuracion: copia el ejemplo y pon tus datos
cp .env.example .env

# 4. servidor de desarrollo -> http://localhost:3000
composer start
```

Mientras `MAIL_HOST` esté vacío en el `.env`, **no se envían correos**: el enlace de confirmación/recuperación se escribe en el log de errores de PHP (la terminal donde corre `composer start`). Cópialo en el navegador para confirmar la cuenta.

Para volver administrador a un usuario ya registrado y confirmado:

```sql
UPDATE usuarios SET admin = 1, confirmado = 1 WHERE email = 'tu@correo.com';
```

## Variables de entorno (`.env`)

| Variable | Descripción |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_BD` | Conexión a la base de datos |
| `APP_URL` | URL pública de la app, se usa en los enlaces de los correos (ej. `https://mi-sitio.com`) |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_ENCRYPTION`, `MAIL_FROM` | Servidor SMTP. Si `MAIL_HOST` está vacío no se envían correos |
| `APP_DEBUG` | `true` muestra el detalle de errores de conexión (solo en desarrollo) |

El archivo `.env` **nunca** se sube a GitHub (está en `.gitignore`).

## Modificar estilos y JavaScript

El código fuente está en `src/` y se compila hacia `build/` (que es lo que sirve la app):

```bash
npm install
npm run gulp     # compila y se queda observando cambios
npm run build    # compila una sola vez
```

## Despliegue en alwaysdata

1. **Base de datos** (panel de alwaysdata → *Bases de datos → MySQL*): usa la base que ya tienes (`[cuenta]_...`) o crea una. Abre [phpMyAdmin](https://phpmyadmin.alwaysdata.com/) e importa `database/schema.sql`. El servidor es `mysql-[cuenta].alwaysdata.net`, puerto 3306.
2. **Subir los archivos** por SFTP/FTP o SSH a la carpeta `www/` de tu cuenta (o la que uses como raíz del sitio). El `.zip` de esta versión ya incluye la carpeta `vendor/`; si subes desde Git, ejecuta `composer install --no-dev` por SSH.
3. **Crear el archivo `.env`** en esa misma carpeta (puedes crearlo por SSH con `nano .env`, o subir `.env.example` y renombrarlo). Ejemplo:
   ```
   DB_HOST=mysql-TU_CUENTA.alwaysdata.net
   DB_PORT=3306
   DB_USER=TU_USUARIO_MYSQL
   DB_PASS=TU_CLAVE_MYSQL
   DB_BD=TU_CUENTA_appsalon
   APP_URL=https://TU_SITIO.alwaysdata.net
   ```
4. **Sitio** (*Web → Sitios*): tipo **PHP**, directorio raíz = la carpeta donde subiste `index.php`, y versión de PHP 8.1 o superior (*Entorno → PHP*).
5. El `.htaccess` incluido ya redirige las rutas a `index.php` y **bloquea** el acceso web a `.env`, `vendor/`, `includes/`, etc. Comprueba que `https://TU_SITIO.alwaysdata.net/.env` responda *403 Forbidden*.
6. Si algo falla, revisa el log de PHP en `~/admin/logs/php/php.log` y, mientras depuras, pon `APP_DEBUG=true` en el `.env`.

## Estructura

```
index.php          rutas de la aplicación
Router.php         enrutador + control de acceso (login / admin)
controllers/       lógica de cada pantalla y de la API JSON
models/            ActiveRecord y modelos (Usuario, Servicio, Cita, ...)
views/             plantillas PHP
classes/Email.php  envío de correos (PHPMailer)
includes/          configuración, conexión a BD y funciones auxiliares
database/          esquema SQL
src/               código fuente Sass y JS  ->  build/ (compilado con Gulp)
```
