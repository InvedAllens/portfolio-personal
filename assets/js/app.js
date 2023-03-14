
import{
    formulario
} from "./formulario.js"
(() => {
    document.addEventListener("DOMContentLoaded", () => {
        iniciarApp();
    });

    function iniciarApp() {
        const fecha = document.querySelector("#fecha");
        //const fechaActual=new Date();
        const year = new Date().getFullYear();
        obtenerMisDatos();
        let size = screen.width;
        fecha.innerHTML = year;
        if (size >= 768) {
            navegacionFija();
            navegacion();
        } else {
            navegacionMobile();
        }

        formulario();
        window.addEventListener('resize', function (event) {
            size = screen.width;
            if (size >= 768) {
                navegacionFija();
                navegacion();
            } else {
                navegacionMobile();
            }
        }, true);
        keyboard();
    }
    function obtenerMisDatos(){
        const presentacionNombre=document.querySelector(".presentacion__ocupacion");
        const presentacionDescripcion=document.querySelector(".presentacion__descripcion");
        const sobreMI=document.querySelector(".sobreMi");
        const sobreMiText=document.createElement("P");
        const nombreProyectos=document.querySelectorAll(".proyecto__nombre");
        const ProyectosTexto=document.querySelectorAll(".proyecto__texto");
        let i=0;
        sobreMI.appendChild(sobreMiText);
        fetch("/data.json").then((response)=>{
             const respuesta=response.json();
             respuesta.then((datos)=>{
                presentacionNombre.innerHTML=`${datos.presentacion["nombre"]} | <span>${datos.presentacion["ocupacion"]}</span>`;
                presentacionDescripcion.innerHTML=`${datos.presentacion.descripcion}`;
                sobreMiText.textContent=datos.sobreMi;
                nombreProyectos.forEach((proyectoNombre)=>{
                    proyectoNombre.textContent=datos.proyectos[i].nombre;
                    ProyectosTexto[i].textContent=datos.proyectos[i].descripcion;
                    i++;
                });
            })
            
            // presentacionNombre.value=response.json().nombre;
            // console.log(presentacionNombre);
        })

    }

    function navegacionFija() {
        const header = document.querySelector(".header");
        const sobreMi = document.querySelector("#sobreMi");
        const body = document.querySelector("body");
        window.addEventListener("scroll", e => {
            if (sobreMi.getBoundingClientRect().top < 0) {
                header.classList.add("fijo");
                body.classList.add("body-scroll");

            } else {
                header.classList.remove("fijo");
                body.classList.remove("body-scroll");
            }
        });
    }

    function navegacion() {
        const secciones = document.querySelectorAll(".seccion");
        const itemsNav = document.querySelectorAll(".enlace-nav");
        // const height = window.innerHeight * .1;
        let seccionActual;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    seccionActual = Array.from(itemsNav).find(item => item.dataset.url === entry.target.id);
                    console.log("seccion actual :"+seccionActual);
                    console.log("entry target :"+entry.target.id);
                    if (seccionActual) {
                        seccionActual.classList.add("activo");
                    }
                    for (const item of itemsNav) {
                        if (item != seccionActual) {
                            item.classList.remove("activo");
                        }
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '-17px 0px 0px 0px',
            threshold: 0.3
        });

        secciones.forEach(seccion => {observer.observe(seccion); });

    }

    
    function navegacionMobile() {
        const menu = document.querySelector(".menu-mobile");
        const nav = document.querySelector("#navegacion");
        menu.addEventListener("click", () => {
            nav.classList.toggle("d-none");
        });
    }

    function keyboard() {
        let keyBdNumber1;
        let keyBdNumber2;
        setInterval(() => {
            keyBdNumber1 = Math.round(Math.random() * 16);
            keyBdNumber2 = Math.round(Math.random() * 16);
            if (keyBdNumber1 != 0 && keyBdNumber2 != 0) {
                const tecla1 = document.querySelector(`#Rectangle${keyBdNumber1}`);
                tecla1.classList.toggle('typingKB');
                const tecla2 = document.querySelector(`#Rectangle${keyBdNumber2}`);
                tecla2.classList.toggle('typingKB');
            }
        }, 200)
    }

})();