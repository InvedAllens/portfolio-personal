import {validarInput} from "./validaciones.js";
(()=>{
    document.addEventListener("DOMContentLoaded",()=>{
        iniciarApp();
    });

    function iniciarApp(){
        const fecha=document.querySelector("#fecha");
        //const fechaActual=new Date();
        const year=new Date().getFullYear();
        let size=screen.width;
        console.log(size>=768);
        fecha.innerHTML=year;
        if(size>=768){
            navegacionFija();
            navegacion();
        }else{
            navegacionMobile();
        }
        
        formulario();
        window.addEventListener('resize', function(event) {
            size=screen.width;
            if(size>=768){
                navegacionFija();
                navegacion();
            }else{
                navegacionMobile();
            }
        },true);
        keyboard();
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
            rootMargin:'-17px 0px 0px 0px',
            threshold:0.6
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
    const form=document.querySelector("#formulario");
    form.addEventListener("submit",manejarSubmit);
    }
    async function manejarSubmit(event){
        event.preventDefault();
        const modal =document.querySelector(".modal");
        const cerrarModal=document.querySelector(".cerrar-modal");
        const modalContenido=document.querySelector(".modal__contenedor");
        const modalBody=document.createElement("DIV");
        modalBody.classList.add("modal__contenido");
        modalContenido.appendChild(modalBody);

        const loader=document.createElement("DIV");
        const circle1=document.createElement("DIV");
        circle1.classList.add("circle1");
        const circle2=document.createElement("DIV");
        circle2.classList.add("circle2");
        const circle3=document.createElement("DIV");
        circle3.classList.add("circle3");
        loader.appendChild(circle1);
        loader.appendChild(circle2);
        loader.appendChild(circle3);

        modalBody.appendChild(loader);

        loader.classList.add("animacion-modal");

        let mensaje=document.createElement("P");
        mensaje.style.padding="1rem";
        const iconoResponse=document.createElement("DIV");
        const botonCerrarModal=document.createElement("DIV");
        botonCerrarModal.classList.add("btn-cerrar-modal");
        botonCerrarModal.textContent="Cerrar";
        botonCerrarModal.style.color="#1f1d2e";
        botonCerrarModal.style.fontWeight="500";

        botonCerrarModal.addEventListener("click",()=>{
            modal.style.visibility="hidden";
            modalContenido.removeChild(modalBody);
        });
       
        cerrarModal.addEventListener("click",()=>{
            modal.style.visibility="hidden";
            modalContenido.removeChild(modalBody);
        });
        modal.style.visibility="visible";
        modal.style.zindex="100";
        modal.style.opacity="1";

        const formulario=new FormData(this);
        let response;
        //conexion con formspree para enviar mensajes 
        response= await fetch(this.action,{
            method:this.method,
            body:formulario,
            headers:{
                'Accept':'application/json'
            }
        });
    
        if(response.ok){
            setTimeout(()=>{
                modalBody.removeChild(loader);
                iconoResponse.classList.add("icono-success");
                modalBody.appendChild(iconoResponse);  
                mensaje.textContent="Gracias por contactarme, respondere lo mas pronto que me sea posible ";
                modalBody.append(mensaje);
                modalBody.appendChild(botonCerrarModal);
            },1500);
            this.reset();
        }else{
            setTimeout(()=>{
                modalBody.removeChild(loader);
                iconoResponse.classList.add("icono-failed");
                modalBody.appendChild(iconoResponse);              
                mensaje.textContent="Hubo un problema con el envio del mensaje :/, intenta enviarme desde otra fuente o intenta nuevamente"
                modalBody.appendChild(mensaje);
                modalBody.appendChild(botonCerrarModal);
                this.reset();
            },1500);
            
        }
    }
    function navegacionMobile(){
        const menu=document.querySelector(".menu-mobile");
        const nav=document.querySelector("#navegacion");
        menu.addEventListener("click",()=>{
            console.log("haz hecho click sobre el menu");
            nav.classList.toggle("d-none");
        });
    }
    function keyboard(){
        let keyBdNumber1;
        let keyBdNumber2;
        setInterval(()=>{
            keyBdNumber1=Math.round(Math.random()*16);
            keyBdNumber2=Math.round(Math.random()*16);
            if(keyBdNumber1!=0 && keyBdNumber2!=0){
                const tecla1=document.querySelector(`#Rectangle${keyBdNumber1}`);
                tecla1.classList.toggle('typingKB');
                const tecla2=document.querySelector(`#Rectangle${keyBdNumber2}`);
                tecla2.classList.toggle('typingKB');   
            }
        },200)
    }

})();