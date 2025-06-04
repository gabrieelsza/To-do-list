const adicionar = document.querySelector('#adicionar')
const adicionarInput = document.querySelector('#adicionar-input')
const listaTarefas = document.querySelector('#listas-tarefas')
const editar = document.querySelector('#form-editar')
const editarTarefas = document.querySelector('#editar-input')
const acoes = document.querySelector("#acoes")
const addTarefa = document.querySelector('.btn-adicionar')
const pesquisarTarefa = document.querySelector('.btn-pesquisar')
const cancelEditBtn = document.querySelector('#cancelar-edicao')
const pesquisarInput = document.querySelector('#pesquisar-input')

console.log(pesquisarInput)

let antigoValorInput; 

const salvarTarefa = (text, done = 0, save = 1) => {
    const tarefas = document.createElement("div"); 
    tarefas.classList.add("tarefas")

    const tarefasTitulo = document.createElement("p");
    tarefasTitulo.innerText = text; 
    tarefas.appendChild(tarefasTitulo)

    const feito = document.createElement("button");
    feito.classList.add("feito")
    feito.innerHTML =   '<i class="fa-solid fa-check"></i>'
    tarefas.appendChild(feito)

    const editTarefa = document.createElement("button"); 
    editTarefa.classList.add("editar")
    editTarefa.innerHTML =  '<i class="fa-solid fa-pen-to-square"></i>'
    tarefas.appendChild(editTarefa)

    const remover = document.createElement("button");
    remover.classList.add("apagar")
    remover.innerHTML =    '<i class="fa-solid fa-trash"></i>'
    tarefas.appendChild(remover)

    if (done) {
        tarefas.classList.add("done")
    }

    if (save) {
        salvarTarefas({text, done})
    }

    listaTarefas.appendChild(tarefas)

    adicionarInput.value = ""
    adicionarInput.focus();  
}

const toggleFormsAdicionar = () => {
    adicionar.classList.toggle("hide")
};

const toggleFormsPesquisar = () => {
    pesquisar.classList.toggle("hide-pesquisar");
};

const toggleForms = () => {
    editar.classList.toggle("hide")
    listaTarefas.classList.toggle("hide")
}

const novoValorInput = (text) => {
    const tarefas = document.querySelectorAll(".tarefas")

    tarefas.forEach((tarefa) => {
        let tituloTarefa = tarefa.querySelector("p") 

        console.log(tituloTarefa, text); 

        if(tituloTarefa.innerText === antigoValorInput) {
           tituloTarefa.innerText = text;
           
        novaTarefaLocalStorage(antigoValorInput, text)
        }
    })
}

const getPesquisarValorTarefa = (pesquisar) => {
    const tarefas = document.querySelectorAll(".tarefas")

    tarefas.forEach((tarefa) => {
        let tituloTarefa = tarefa.querySelector("p").innerText.toLowerCase();  

        const normalizeValorPesquisar = pesquisar.toLowerCase(); 
        tarefa.style.display = "flex";
        
        if(!tituloTarefa.includes(normalizeValorPesquisar)) {
            tarefa.style.display = "none";
        }
    });
}

addTarefa.addEventListener("click", (e) => {
    toggleFormsAdicionar();  
});

pesquisarTarefa.addEventListener("click", (e) => {
    toggleFormsPesquisar();  
});

adicionar.addEventListener("submit", (e) => {
    e.preventDefault()

    const inputValue = adicionarInput.value;

    if (inputValue) {
        salvarTarefa(inputValue)
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target; 
    const parentEl = targetEl.closest("div");
    let tituloTarefa;

    if ( parentEl && parentEl.querySelector("p")) {
        tituloTarefa = parentEl.querySelector("p").innerText || "";
    }

    if(targetEl.classList.contains("feito")) {
        parentEl.classList.toggle("done");  

        novoStatusTexto(tituloTarefa); 
    }
    
    if(targetEl.classList.contains("apagar")) {
        parentEl.remove()

        removerTarefasLocalStorage(tituloTarefa)
    }

    if(targetEl.classList.contains("editar")) {
        toggleForms()

        editarTarefas.value = tituloTarefa; 
        antigoValorInput = tituloTarefa; 
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editar.addEventListener("submit", (e) => { 
    e.preventDefault()
    
    const editarValorInput = editarTarefas.value; 

    console.log(editarValorInput)
    
    if (editarValorInput) {
        novoValorInput(editarValorInput);
    }

    toggleForms()
})

pesquisarInput.addEventListener("keyup", (e) => {
    
    const pesquisar = e.target.value
    
    getPesquisarValorTarefa(pesquisar); 
}); 

const getTarefaLocalStorage = () => {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || []; 

    return tarefas; 
}

const salvarTarefas = (tarefa) => {
    const tarefas = getTarefaLocalStorage(); 

    tarefas.push(tarefa); 

    localStorage.setItem("tarefas", JSON.stringify(tarefas)); 
}

const carregarTarefas = (tarefa) => {
    const tarefas = getTarefaLocalStorage(); 
    
    tarefas.forEach((tarefa) => {
        salvarTarefa(tarefa.text, tarefa.done, 0); 
    }); 
}

const removerTarefasLocalStorage = (textoTarefa) => {
    const tarefas = getTarefaLocalStorage(); 
    
    const filtrarTarefas = tarefas.filter((tarefa) => tarefa.text !== textoTarefa)
    
    localStorage.setItem("tarefas", JSON.stringify(filtrarTarefas)); 
}

const novoStatusTexto = (textoTarefa) => {
    const tarefas = getTarefaLocalStorage(); 
    
    tarefas.map((tarefa) => 
        tarefa.text === textoTarefa ? (tarefa.done = !tarefa.done) : null

    ); 
    
    localStorage.setItem("tarefas", JSON.stringify(tarefas)); 
}

const novaTarefaLocalStorage = (antigoTarefa, novaTarefa) => {
    const tarefas = getTarefaLocalStorage(); 
    
    tarefas.map((tarefa) => 
        tarefa.text === antigoTarefa ? (tarefa.done = novaTarefa) : null
    ); 
    
    localStorage.setItem("tarefas", JSON.stringify(tarefas)); 
}

carregarTarefas(); 