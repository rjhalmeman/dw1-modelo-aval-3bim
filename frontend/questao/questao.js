
// Configuração da API, IP e porta.
const API_BASE_URL = 'http://localhost:3001';
let currentPersonId = null;
let operacao = null;

// Elementos do DOM
const form = document.getElementById('questaoForm');
const searchId = document.getElementById('searchId');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const questoesTableBody = document.getElementById('questoesTableBody');
const messageContainer = document.getElementById('messageContainer');

// Carregar lista de questoes ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarQuestoes();
});

// Event Listeners
btnBuscar.addEventListener('click', buscarQuestao);
btnIncluir.addEventListener('click', incluirQuestao);
btnAlterar.addEventListener('click', alterarQuestao);
btnExcluir.addEventListener('click', excluirQuestao);
btnCancelar.addEventListener('click', cancelarOperacao);
btnSalvar.addEventListener('click', salvarOperacao);

mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
bloquearCampos(false);//libera pk e bloqueia os demais campos

// Função para mostrar mensagens
function mostrarMensagem(texto, tipo = 'info') {
    messageContainer.innerHTML = `<div class="message ${tipo}">${texto}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}

function bloquearCampos(bloquearPrimeiro) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach((input, index) => {
        if (index === 0) {
            // Primeiro elemento - bloqueia se bloquearPrimeiro for true, libera se for false
            input.disabled = bloquearPrimeiro;
        } else {
            // Demais elementos - faz o oposto do primeiro
            input.disabled = !bloquearPrimeiro;
        }
    });
}

// Função para limpar formulário
function limparFormulario() {
    form.reset();
}


function mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar) {
    btnBuscar.style.display = btBuscar ? 'inline-block' : 'none';
    btnIncluir.style.display = btIncluir ? 'inline-block' : 'none';
    btnAlterar.style.display = btAlterar ? 'inline-block' : 'none';
    btnExcluir.style.display = btExcluir ? 'inline-block' : 'none';
    btnSalvar.style.display = btSalvar ? 'inline-block' : 'none';
    btnCancelar.style.display = btCancelar ? 'inline-block' : 'none';
}

// Função para formatar data para exibição
function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para converter data para formato ISO
function converterDataParaISO(dataString) {
    if (!dataString) return null;
    return new Date(dataString).toISOString();
}

// Função para buscar questao por ID
async function buscarQuestao() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }
    bloquearCampos(false);
    //focus no campo searchId
    searchId.focus();
    try {
        const response = await fetch(`${API_BASE_URL}/questao/${id}`);

        if (response.ok) {
            const questao = await response.json();
            preencherFormulario(questao);

            mostrarBotoes(true, false, true, true, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Questao encontrada!', 'success');

        } else if (response.status === 404) {
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false); //mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Questao não encontrada. Você pode incluir uma nova questao.', 'info');
            bloquearCampos(false);//bloqueia a pk e libera os demais campos
            //enviar o foco para o campo de nome
        } else {
            throw new Error('Erro ao buscar questao');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao buscar questao', 'error');
    }
}

// Função para preencher formulário com dados da questao
function preencherFormulario(questao) {
    currentPersonId = questao.id_questao;
    searchId.value = questao.id_questao;
    document.getElementById('texto_questao').value = questao.texto_questao || '';
    document.getElementById('texto_questao').value = questao.texto_questao || '';
    document.getElementById('nota_maxima_questao').value = questao.nota_maxima_questao || '';
    document.getElementById('texto_complementar_questao').value = questao.texto_complementar_questao || '';   
}


// Função para incluir questao
async function incluirQuestao() {

    mostrarMensagem('Digite os dados!', 'success');
    currentPersonId = searchId.value;
    // console.log('Incluir nova questao - currentPersonId: ' + currentPersonId);
    limparFormulario();
    searchId.value = currentPersonId;
    bloquearCampos(true);

    mostrarBotoes(false, false, false, false, true, true); // mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('texto_questao').focus();
    operacao = 'incluir';
    // console.log('fim nova questao - currentPersonId: ' + currentPersonId);
}

// Função para alterar questao
async function alterarQuestao() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('texto_questao').focus();
    operacao = 'alterar';
}

// Função para excluir questao
async function excluirQuestao() {
    mostrarMensagem('Excluindo questao...', 'info');
    currentPersonId = searchId.value;
    //bloquear searchId
    searchId.disabled = true;
    bloquearCampos(false); // libera os demais campos
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)           
    operacao = 'excluir';
}

async function salvarOperacao() {
    console.log('Operação:', operacao + ' - currentPersonId: ' + currentPersonId + ' - searchId: ' + searchId.value);

    const formData = new FormData(form);
    const questao = {
        id_questao: searchId.value,
        texto_questao: formData.get('texto_questao'),
        nota_maxima_questao: formData.get('nota_maxima_questao'),
        texto_complementar_questao: formData.get('texto_complementar_questao')        
    };
    let response = null;
    try {
        if (operacao === 'incluir') {
            response = await fetch(`${API_BASE_URL}/questao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questao)
            });
        } else if (operacao === 'alterar') {
            response = await fetch(`${API_BASE_URL}/questao/${currentPersonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questao)
            });
        } else if (operacao === 'excluir') {
            // console.log('Excluindo questao com ID:', currentPersonId);
            response = await fetch(`${API_BASE_URL}/questao/${currentPersonId}`, {
                method: 'DELETE'
            });
            console.log('Questao excluída' + response.status);
        }
        if (response.ok && (operacao === 'incluir' || operacao === 'alterar')) {
            const novaQuestao = await response.json();
            mostrarMensagem('Operação ' + operacao + ' realizada com sucesso!', 'success');
            limparFormulario();
            carregarQuestoes();

        } else if (operacao !== 'excluir') {
            const error = await response.json();
            mostrarMensagem(error.error || 'Erro ao incluir questao', 'error');
        } else {
            mostrarMensagem('Questao excluída com sucesso!', 'success');
            limparFormulario();
            carregarQuestoes();
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao incluir ou alterar a questao', 'error');
    }

    mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false);//libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
}

// Função para cancelar operação
function cancelarOperacao() {
    limparFormulario();
    mostrarBotoes(true, false, false, false, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    bloquearCampos(false);//libera pk e bloqueia os demais campos
    document.getElementById('searchId').focus();
    mostrarMensagem('Operação cancelada', 'info');
}

// Função para carregar lista de questoes
async function carregarQuestoes() {
    try {
        const response = await fetch(`${API_BASE_URL}/questao`);
    //    debugger
        if (response.ok) {
            const questoes = await response.json();
            renderizarTabelaQuestoes(questoes);
        } else {
            throw new Error('Erro ao carregar questoes');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de questoes', 'error');
    }
}

// Função para renderizar tabela de questoes
function renderizarTabelaQuestoes(questoes) {
    questoesTableBody.innerHTML = '';

    questoes.forEach(questao => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>
                        <button class="btn-id" onclick="selecionarQuestao(${questao.id_questao})">
                            ${questao.id_questao}
                        </button>
                    </td>
                    <td>${questao.texto_questao}</td>
                    <td>${questao.nota_maxima_questao}</td>
                    <td>${questao.texto_complementar_questao}</td>
                                 
                `;
        questoesTableBody.appendChild(row);
    });
}

// Função para selecionar questao da tabela
async function selecionarQuestao(id) {
    searchId.value = id;
    await buscarQuestao();
}
