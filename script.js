const teclas = document.querySelectorAll(".key")
const displayNumeral = document.querySelector(".display .numeral")
const displayOperacao = document.querySelector(".display .operacao")
let ultimoDigito = '0'

//Quando a calculadora virtual é clicada
teclas.forEach(function(tecla) {
    tecla.addEventListener("click", function() {
        teclaClick(tecla)
    })
})

// Verifica se a tecla pressionada é numérica, um operador matemático ou a tecla de delete ou backspace
document.addEventListener('keydown', function(event) {
    var key = event.key;
    
    if (/^[0-9+\-*/.=/]$/.test(key) || key === 'Backspace' || key === 'Delete' || key === 'Enter') {
        if(key === 'Enter') key = '='


        teclas.forEach(function(tecla){
            if(tecla.dataset.key == key) {
                teclaClick(tecla)
            }

        })
    }
});

function teclaClick(tecla){

    tecla.classList.add("click")

    setDisplay(tecla.innerHTML)

    setTimeout(function() {
        tecla.classList.remove('click');
    }, 350);
}

function setDisplay(tecla){

    let tempAtual = displayNumeral.innerHTML
    let temp = tempAtual + tecla

    let regexNum = /^\d*\.?\d+$|^\.$/;
    let regexOpe = /[\+\-\x\/]/;

    if(tempAtual.length > 15 && regexNum.test(tecla)) return

    if(regexOpe.test(ultimoDigito) || (ultimoDigito == "=" && regexNum.test(tecla)) || tempAtual == "e") tempAtual = "0"
    if(ultimoDigito == "=") displayOperacao.innerHTML = ""

    if(regexNum.test(tecla) && (temp.split('.').length - 1) <= 1) displayNumeral.innerHTML = tempAtual === "0" ?  tecla : temp
    else if(tecla == "DEL") displayNumeral.innerHTML = displayNumeral.innerHTML.length === 1 ? "0" : displayNumeral.innerHTML.slice(0, -1)
    else if(regexOpe.test(tecla)) displayOperacao.innerHTML += temp
    else if(tecla == "RESET") {
        displayNumeral.innerHTML = "0"
        displayOperacao.innerHTML = ""
    }
    else if(tecla == "="){
        displayOperacao.innerHTML += displayNumeral.innerHTML + tecla
        let expressao = displayOperacao.innerHTML.replace('x', '*');
        expressao = expressao.slice(0, -1)
        let resultado = calcularExpressao(expressao)
        if(resultado.toString().length > 15) resultado = "e"
        displayNumeral.innerHTML = resultado
    }

    ultimoDigito = tecla

}

function calcularExpressao(expressao) {
    // Remove espaços em branco da expressão
    expressao = expressao.replace(/\s/g, '');
  
    // Identifica e calcula as operações de multiplicação e divisão
    let numeros = expressao.split(/[\+\-\*\/]/).map(parseFloat);
    let operadores = expressao.replace(/[0-9\.]/g, '').split('');
    let i = 0;
    while (i < operadores.length) {
      if (operadores[i] === '*' || operadores[i] === '/') {
        const operador = operadores[i];
        const num1 = numeros[i];
        const num2 = numeros[i+1];
        const resultado = operador === '*' ? num1 * num2 : num1 / num2;
        numeros.splice(i, 2, resultado);
        operadores.splice(i, 1);
      } else {
        i++;
      }
    }
  
    // Identifica e calcula as operações de adição e subtração
    let resultado = numeros[0];
    for (let j = 0; j < operadores.length; j++) {
      const operador = operadores[j];
      const numero = numeros[j+1];
      resultado = operador === '+' ? resultado + numero : resultado - numero;
    }
  
    return resultado;
  }
  
  