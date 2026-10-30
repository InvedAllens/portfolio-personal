<?php

    use MVC\Router;
    use Controllers\LoginController;
    use Controllers\ClienteController;
    use Controllers\APIController;
    use Controllers\AdminController;
    use Controllers\ServicioController;

    //servidor de desarrollo de PHP (php -S): entrega directamente los archivos de /build (css, js, imagenes)
    //en Apache esto lo hace el servidor web con el .htaccess
    if(PHP_SAPI==='cli-server'){
        $rutaArchivo=parse_url($_SERVER['REQUEST_URI'] ?? '/',PHP_URL_PATH);
        if(is_string($rutaArchivo) && strpos($rutaArchivo,'/build/')===0 && strpos($rutaArchivo,'..')===false
            && is_file(__DIR__.$rutaArchivo)){
            return false;
        }
    }

    require_once __DIR__.'/includes/app.php';
    $router=new Router();
    //rutas para el login 
    $router->get('/login',[LoginController::class,"login"]);
    $router->post('/login',[LoginController::class,"login"]);
    $router->get('/logout',[LoginController::class,"logout"]);
    //rutas para recuperar contraseña
    $router->get('/olvide',[LoginController::class,"olvide"]);
    $router->post('/olvide',[LoginController::class,"olvide"]);
    //recuperar cuenta
    $router->get('/recuperar',[LoginController::class,"recuperar"]);
    $router->post('/recuperar',[LoginController::class,"recuperar"]);
    //Crear cuenta
    $router->get('/registrarse',[LoginController::class,"crearCuenta"]);
    $router->post('/registrarse',[LoginController::class,"crearCuenta"]);

    $router->get('/confirmar-cuenta',[LoginController::class,"confirmar"]);
    $router->get('/mensaje',[LoginController::class,"mensaje"]);

    //admin
    //$router->get('/citas',[ClienteController::class,"inicio"]);

    //Area privada del cliente
    $router->get('/citas',[ClienteController::class,"inicio"]);

    //Area privada del admin
    $router->get('/admin',[AdminController::class,"inicio"]);

    //Servicios del API 
    $router->get('/api/servicios',[APIController::class,"index"]);
    $router->post('/api/citas',[APIController::class,'guardar']);
    $router->post('/api/borrar-cita',[APIController::class,'borrar']);
    //CRUD servicios
    $router->get('/servicios',[ServicioController::class,'index']);
    $router->get('/servicios/crear',[ServicioController::class,'crear']);
    $router->post('/servicios/crear',[ServicioController::class,'crear']);
    $router->get('/servicios/actualizar',[ServicioController::class,'actualizar']);
    $router->post('/servicios/actualizar',[ServicioController::class,'actualizar']);
    $router->post('/servicios/eliminar',[ServicioController::class,'eliminar']);

    $router->comprobarRutas();
