const mensajesError={
    nombre:{
        valueMissing:"Este campo no puede estar vacio",
    },
    email:{
        valueMissing:"Este campo no puede estar vacio",
        typeMismatch:"El correo no es valido"
    },
    asunto:{
        valueMissing:"Este campo no puede estar vacio",
        patternMismatch:"Al menos 6 caracteres, máximo 12, debe contener una letra minúscula, una letra mayúscula, un número y no puede contener caracteres especiales."
    },
    mensaje:{
        valueMissing:"Este campo no puede estar vacio"
    }

    
};
// const verificarTipoInput={
//     nacimiento:(e)=>{validarEdad(e);}
// }
export function validarInput(e){

    const tipoInput=e.target.dataset.tipo;
    // if(verificarTipoInput[tipoInput]){
    //     verificarTipoInput[tipoInput](e);
    // }
    if(e.target.validity.valid){
        e.target.parentElement.classList.remove("input-container--invalid");
        console.log(e.target.validity);
    }else{
        e.target.parentElement.classList.add("input-container--invalid");
        e.target.parentElement.querySelector(".input-message-error").innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e73d3d" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg> `+mostrarMensajeError(tipoInput,e.target);
    }
}

function mostrarMensajeError(tipoInput,input){
    //console.log(mensajesError);
    console.log(input.validity);
    console.log(input.value);
    let mensajes='';
    console.log(mensajesError[tipoInput])
    for(const [clave,valor] of Object.entries(mensajesError[tipoInput])){
            if(input.validity[clave]){
                mensajes=valor;
            }
        
    }
    //console.log(mensajes);
    return mensajes;
}

