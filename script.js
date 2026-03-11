const formulario = document.getElementById("cepForm");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    //sanitização de dados
    const cep = document.getElementById("cep").value.replace(/\D/g, "");
    if (cep.length != 8) {
        alert("por favor, digite o CEP com 8 digitos apenas");
        return;

    }
    resultado.innerHTML = "buscando...";
    try {
        const endereco = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await endereco.json();
        if (dados.error) {
            resultado.innerHTML("CEP inválido.")
        } else {
            resultado.innerHTML = "Rua: " + dados.logradouro + "<br>" + "Bairro: " + dados.bairro + "<br> Cidade:" + dados.localidade + "-" + dados.uf;
            const cidade = dados.localidade;
            const dadosGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json&countryCode=BR`);
            const dadosGeoJson = await dadosGeo.json;
            if (dadosGeoJson.results && dadosGeoJson.results.length > 0) {
                const { latitude, longitude } = dadosGeoJson.results[0];
                //console.log(latitude);
                //console.log(longitude);
                const clima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const climaJson = await clima.json();
                
            } else {
                console.log("não entrou")
            }

            //https://api.open-meteo.com/v1/forecast?latitude=-27.2142&longitude=-49.6431&current_weather=true
        };
    } catch (error) {
        resultado.innerHTML("Erro ao consultar o CEP.")

    }

}); 