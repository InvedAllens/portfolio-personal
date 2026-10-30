<?php 
    namespace MVC;

    class Router{
        public $rutasGET=[];
        public $rutasPOST=[];
        //rutas que requieren haber iniciado sesion
        protected $rutasProtegidas=['/citas','/api/citas'];
        //rutas que ademas requieren ser administrador
        protected $rutasAdmin=['/admin','/servicios','/servicios/crear','/servicios/actualizar',
                               '/servicios/eliminar','/api/borrar-cita'];
        
        //establece una funcion para una url (esto para un metodo get/cargar pagina )
        public function get($url,$fn){
            $this->rutasGET[$url]=$fn;
        }
        public function post($url,$fn){
            $this->rutasPOST[$url]=$fn;
        }

        //inicia la sesion una sola vez, con una cookie mas segura
        protected function iniciarSesion(){
            if(session_status()===PHP_SESSION_NONE){
                $https=(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off')
                    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')==='https');
                session_set_cookie_params([
                    'path'=>'/',
                    'httponly'=>true,
                    'secure'=>$https,
                    'samesite'=>'Lax'
                ]);
                session_start();
            }
        }

        //devuelve solo la ruta (sin ?parametros), por ejemplo /admin?fecha=2024-01-01 => /admin
        protected function urlActual(){
            $path=parse_url($_SERVER['REQUEST_URI'] ?? '/',PHP_URL_PATH);
            if(!is_string($path) || $path===''){
                $path='/';
            }
            if($path!=='/'){
                $path=rtrim($path,'/');
                if($path===''){ $path='/'; }
            }
            return $path==='/' ? '/login' : $path;
        }

        //niega el acceso y DETIENE la ejecucion (sin esto el controlador seguiria ejecutandose)
        protected function denegar($esApi,$codigo,$redireccion){
            if($esApi){
                http_response_code($codigo);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error'=>$codigo===401 ? 'Debes iniciar sesion' : 'No tienes permisos']);
            }else{
                header('Location:'.$redireccion);
            }
            exit;
        }

        //ejecuta las funciones dependiendo la url y el metodo asociado
        public function comprobarRutas(){
            $this->iniciarSesion();
            $autenticado=$_SESSION['login'] ?? null;
            $esAdmin=isset($_SESSION['admin']);
            $fn=null;

            //se obtienen la url (sin parametros) y el metodo a traves del server 
            $urlActual=$this->urlActual();
            $metodo=$_SERVER['REQUEST_METHOD'];
            $esApi=strpos($urlActual,'/api/')===0;

            $requiereAdmin=in_array($urlActual,$this->rutasAdmin,true);
            $requiereLogin=$requiereAdmin || in_array($urlActual,$this->rutasProtegidas,true);
            if($requiereLogin && !$autenticado){
                $this->denegar($esApi,401,'/login');
            }
            if($requiereAdmin && !$esAdmin){
                $this->denegar($esApi,403,'/citas');
            }
            
            //solo si es un metodo get, se obtiene la funcion del arreglo para ejecutarlo posteriormente
            if($metodo=='GET'){
                $fn= $this->rutasGET[$urlActual] ?? null;
            }elseif($metodo=='POST'){
                $fn= $this->rutasPOST[$urlActual] ?? null;
            }
            //si existe la url se utiliza un callback a la funcion asosciada a la url y metodo
            if($fn){
                call_user_func($fn,$this);
            }else{
                http_response_code(404);
                echo 'pagina no encontrada';
            }
        }
        public function render($view,$datos=[]){
            foreach($datos as $key=>$value):
                $$key=$value;
            endforeach;
            ob_start();
            include __DIR__."/views/$view.php";
            $contenido=ob_get_clean();
            include __DIR__.'/views/layout.php';
            
        }
    }
