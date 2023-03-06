import {validarInput} from "./validaciones.js";
(()=>{
    document.addEventListener("DOMContentLoaded",()=>{
        iniciarApp();
    });
    function iniciarApp(){
        const fecha=document.querySelector("#fecha");
        //const fechaActual=new Date();
        const year=new Date().getFullYear();
        fecha.innerHTML=year;
        navegacion();
        navegacionFija();
        formulario();
    }
    function navegacionFija(){
        const header=document.querySelector(".header");
        const sobreMi=document.querySelector("#sobreMi");
        const body=document.querySelector("body");
        window.addEventListener("scroll",e=>{
            if(sobreMi.getBoundingClientRect().top<0){
                header.classList.add("fijo");
                body.classList.add("body-scroll");

            }else{
                header.classList.remove("fijo");
                body.classList.remove("body-scroll");
            }
        });
    }

    function navegacion(){
        const secciones=document.querySelectorAll(".seccion");
        const itemsNav=document.querySelectorAll(".enlace-nav");
        const height=window.innerHeight*.1;
        let seccionActual;

        const observer=new IntersectionObserver((entries,observer)=>{
            entries.forEach(entry =>{
                if(entry.isIntersecting){
                    console.log(entry.target)
                    seccionActual=Array.from(itemsNav).find(item => item.dataset.url===entry.target.id);
                    console.log(seccionActual);
                    if(seccionActual){
                        seccionActual.classList.add("activo");
                    }               
                    for(const item of itemsNav){
                        if(item!=seccionActual){
                            item.classList.remove("activo");
                        }
                    } 
                }
            });
        },{
            root:null,
            rootMargin:'-20px 0px 0px 0px',
            threshold:0.7
        });

        secciones.forEach(seccion => observer.observe(seccion));
        
    }

    function formulario(){
        const inputs=document.querySelectorAll("input");
        inputs.forEach(input =>{
        input.addEventListener("blur",validarInput);
        const textsarea=document.querySelectorAll("textarea");
        textsarea.forEach(textarea=>{
            textarea.addEventListener("blur",validarInput);
        });
    });
    }

})();