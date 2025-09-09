const API_BASE_URL = 'http://localhost:3001';


const disponiveisList = document.getElementById("disponiveis-list");
const avaliacaoList = document.getElementById("avaliacao-list");
const avaliacaoContainer = document.getElementById("avaliacao");
const disponiveisContainer = document.getElementById("disponiveis");

let avaliacaoId = null;
// Carregar lista de avaliacoes ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    selectAvaliacoes();
    carregarQuestoesAvaliacao(avaliacaoId);
   // carregarAvaliacoes();
   carregarQuestoes(); //todas as questões
});


function salvarQuestoesDaAvaliacao() {
    alert('Salvando questões da avaliação...');
    if (!avaliacaoId) {
        mostrarMensagem('Selecione uma avaliação antes de salvar', 'error');
        return;
    }

    const questoesIds = Array.from(avaliacaoList.children).map(item => item.getAttribute('data-id'));

    fetch(`${API_BASE_URL}/avaliacaoHasQuestao/${avaliacaoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ questoes: questoesIds })
    })
    .then(response => {
        if (response.ok) {
            mostrarMensagem('Questões salvas com sucesso!', 'success');
        } else {
            throw new Error('Erro ao salvar questões');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao salvar questões', 'error');
    });
}

async function selectAvaliacoes() {
    try {
        const response = await fetch(`${API_BASE_URL}/avaliacao`);
        if (response.ok) {
            const avaliacoes = await response.json();
            const select = document.getElementById('avaliacaoSelect');
            select.innerHTML = '<option value="">Selecione uma avaliação</option>'; // Limpa e adiciona opção padrão

            avaliacoes.forEach(avaliacao => {
                const option = document.createElement('option');
                option.value = avaliacao.id_avaliacao;
                option.textContent = avaliacao.descricao_avaliacao;
                select.appendChild(option);
            });

            // Adiciona listener para carregar questões da avaliação selecionada
            select.addEventListener('change', async (event) => {
                avaliacaoId = event.target.value;
                if (avaliacaoId) {
                    await carregarQuestoesAvaliacao(avaliacaoId);
                } else {
                    avaliacaoList.innerHTML = ''; // Limpa a lista se nenhuma avaliação for selecionada
                }
            });
        } else {
            throw new Error('Erro ao carregar avaliações');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de avaliações', 'error');
    }
}

// Função para carregar questões da avaliação selecionada
async function carregarQuestoesAvaliacao(avaliacaoId) {
    try {
        let rotaAvaliacaoHasQuestao = API_BASE_URL + '/avaliacaoHasQuestao/' + avaliacaoId;
        const response = await fetch(rotaAvaliacaoHasQuestao);
        if (response.ok) {
            const questoes = await response.json();
            avaliacaoList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            questoes.forEach(questao => {
                const div = document.createElement('div');
                div.className = 'questao';
                div.setAttribute('draggable', 'false'); // Não permite arrastar questões já na avaliação
                div.setAttribute('data-id', questao.id_questao);
                div.textContent = questao.texto_questao;

                // Adiciona botão de excluir
                const btn = document.createElement('button');
                btn.textContent = 'X';
                btn.addEventListener('click', () => {
                    div.remove();
                    // Reativa o item original na lista de disponíveis
                    const originalItem = document.querySelector(`#disponiveis-list .questao[data-id="${questao.id_questao}"]`);
                    if (originalItem) {
                        originalItem.style.display = 'flex';
                    }
                });

                div.appendChild(btn);
                avaliacaoList.appendChild(div);
            });
        } else {
            throw new Error('Erro ao carregar questões da avaliação');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar questões da avaliação', 'error');
    }
}

async function carregarQuestoes(){
    try {
        const response = await fetch(`${API_BASE_URL}/questao`);
        if (response.ok) {
            const questoes = await response.json();
            disponiveisList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
            
          questoes.forEach(questao => {
                const div = document.createElement('div');
                div.className = 'questao';
                div.setAttribute('draggable', 'true');
                div.setAttribute('data-id', questao.id_questao);
                div.textContent = questao.texto_questao;

                // Adiciona event listeners para drag and drop
                addDragListeners(div);

                disponiveisList.appendChild(div);
            }); 
        } else {
            throw new Error('Erro ao carregar questões');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de questões', 'error');
    }
}   
                

// Função para mostrar mensagens ao usuário
function mostrarMensagem(mensagem, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = mensagem;
    mensagemDiv.className = tipo; // 'success' ou 'error'
    setTimeout(() => {
        mensagemDiv.textContent = '';
        mensagemDiv.className = '';
    }, 3000);
}
// Função para carregar lista de avaliacao
async function carregarAvaliacoes() {
    try {
        const response = await fetch(`${API_BASE_URL}/avaliacao`);
        //    debugger
        if (response.ok) {
            const avaliacoes = await response.json();
            avaliacaoList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            avaliacoes.forEach(avaliacao => {
                const div = document.createElement('div');
                div.className = 'questao';
                div.setAttribute('draggable', 'true');
                div.setAttribute('data-id', avaliacao.id_avaliacao);
                div.textContent = avaliacao.descricao_avaliacao;

                // Adiciona event listeners para drag and drop
                addDragListeners(div);

                disponiveisList.appendChild(div);
            });



        } else {
            throw new Error('Erro ao carregar avaliacoes');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de avaliacoes', 'error');
    }
}

let draggedItem = null;

// Adiciona event listeners para todos os itens
function addDragListeners(item) {
    item.addEventListener("dragstart", e => {
        draggedItem = item;
        e.dataTransfer.setData("text/plain", item.getAttribute("data-id"));
        item.classList.add("dragging");
        setTimeout(() => item.style.display = "none", 0);
    });

    item.addEventListener("dragend", e => {
        item.classList.remove("dragging");
        setTimeout(() => {
            item.style.display = "flex";
            draggedItem = null;
        }, 0);
    });
}

// Inicializa os listeners para as questões iniciais
document.querySelectorAll(".questao").forEach(item => {
    addDragListeners(item);
});

// Configura os containers
const containers = [avaliacaoContainer, disponiveisContainer];

containers.forEach(container => {
    container.addEventListener("dragover", e => {
        e.preventDefault();
        container.classList.add("over");
    });

    container.addEventListener("dragleave", () => {
        container.classList.remove("over");
    });

    container.addEventListener("drop", e => {
        e.preventDefault();
        container.classList.remove("over");

        if (draggedItem) {
            // Se estiver soltando no container de avaliação
            if (container.id === "avaliacao") {
                // Verifica se a questão já existe na avaliação
                const existingQuestion = Array.from(avaliacaoList.children).find(
                    item => item.getAttribute("data-id") === draggedItem.getAttribute("data-id")
                );

                if (!existingQuestion) {
                    const clone = draggedItem.cloneNode(true);
                    clone.setAttribute("draggable", "false");
                    clone.style.display = "flex";

                    // Adiciona botão de excluir
                    const btn = document.createElement("button");
                    btn.textContent = "X";
                    btn.addEventListener("click", () => {
                        clone.remove();
                        // Reativa o item original na lista de disponíveis
                        const originalItem = document.querySelector(`#disponiveis-list .questao[data-id="${draggedItem.getAttribute("data-id")}"]`);
                        if (originalItem) {
                            originalItem.style.display = "flex";
                        }
                    });

                    clone.appendChild(btn);
                    avaliacaoList.appendChild(clone);
                }
            }
        }
    });
});

// Impede que o evento de drop seja propagado para elementos pais
document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => e.preventDefault());