const main = document.querySelector(".main"), //div principal
main_input = document.querySelector(".main-input"), //input
input_txt = main_input.querySelector(".input-txt"), //Aviso de carregamento
input = main_input.querySelector("input"), // cidade digitada
localBtn = main_input.querySelector("button"),//botao geolocalizaçao
main_clima = main.querySelector(".main-clima"),//Resultado
wIcon = main_clima.querySelector("img"),//icone do clima
voltarBtn = main.querySelector("header i");//botão voltar

let api;

input.addEventListener("keyup", e =>{
    // Configuração do enter quando não estiver vazio
    if(e.key == "Enter" && input.value != ""){
        requestApi(input.value);
    }
});

localBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // Caso navegado não aceite geolocalização
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Seu navegador não aceita a API de geolocalização");
    }
});

function requestApi(city){//puxando os dados da API
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f36a2c515c8a6f8ded1d58e2ac6b5301`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // puxando da API LAT e LOG para geolocalização
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=f36a2c515c8a6f8ded1d58e2ac6b5301`;
    fetchData();
}



function onError(error){
    // Caso aconteça algum erro na geolocalização
    input_txt.innerText = error.message;
    input_txt.classList.add("ERRO!");
}

function fetchData(){
    input_txt.innerText = "Recebendo os detalhes do clima";
    input_txt.classList.add("Aguarde");
    
 // função chamando weatherDetails e passando função como argumento
 
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        input_txt.innerText = "Algo está errado!";
        input_txt.classList.replace("Aguarde", "ERRO");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){ // Caso nome da cidade esteja errado
        input_txt.classList.replace("Aguarde", "ERRO");
        input_txt.innerText = `${input.value} isn't a valid city name`;
    }else{
        //Solicitar as informações da API OPENWEATHER
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp} = info.main;
        const {temp_min} = info.main;
        const {temp_max} = info.main;

        // usar icones de acordo com o resultado das informações de tempo
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        //Passando o clima para os elementos
        
        main_clima.querySelector(".temperatura .numero").innerText = Math.floor(temp);
        main_clima.querySelector(".clima").innerText = description;
        main_clima.querySelector(".local span").innerText = `${city}, ${country}`;
        main_clima.querySelector(".temperatura .numero-2").innerText = Math.floor(temp_min);
        main_clima.querySelector(".temperatura .numero-3").innerText = Math.floor(temp_max);
        input_txt.classList.remove("pending", "error");
        input_txt.innerText = "";
        input.value = "";
        main.classList.add("active");
    }
}


//Ativar o botão de voltar

voltarBtn.addEventListener("click", ()=>{
    main.classList.remove("active");
});
