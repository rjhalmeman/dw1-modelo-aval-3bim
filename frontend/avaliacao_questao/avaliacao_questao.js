
// Configuração da API, IP e porta.
const API_BASE_URL = 'http://localhost:3001';
let currentPersonId = null;
let operacao = null;

// Elementos do DOM
const form = document.getElementById('avaliacaoForm');
const searchId = document.getElementById('searchId');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const avaliacoesTableBody = document.getElementById('avaliacoesTableBody');
const messageContainer = document.getElementById('messageContainer');

// Carregar lista de avaliacoes ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarAvaliacoes();
});

// Event Listeners
btnBuscar.addEventListener('click', buscarAvaliacao);
btnIncluir.addEventListener('click', incluirAvaliacao);
btnAlterar.addEventListener('click', alterarAvaliacao);
btnExcluir.addEventListener('click', excluirAvaliacao);
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

// Função para buscar avaliacao por ID
async function buscarAvaliacao() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }
    bloquearCampos(false);
    //focus no campo searchId
    searchId.focus();
    try {
        const response = await fetch(`${API_BASE_URL}/avaliacao/${id}`);

        if (response.ok) {
            const avaliacao = await response.json();
            preencherFormulario(avaliacao);

            mostrarBotoes(true, false, true, true, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Avaliacao encontrada!', 'success');

        } else if (response.status === 404) {
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false); //mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Avaliacao não encontrada. Você pode incluir uma nova avaliacao.', 'info');
            bloquearCampos(false);//bloqueia a pk e libera os demais campos
            //enviar o foco para o campo de nome
        } else {
            throw new Error('Erro ao buscar avaliacao');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao buscar avaliacao', 'error');
    }
}

// Função para preencher formulário com dados da avaliacao
async function preencherFormulario(avaliacao) {
    currentPersonId = avaliacao.id_avaliacao;
    searchId.value = avaliacao.id_avaliacao;
    document.getElementById('descricao_avaliacao').value = avaliacao.descricao_avaliacao || '';

    // Formatação da data para input type="date"
    if (avaliacao.data_avaliacao) {
        const data = new Date(avaliacao.data_avaliacao);
        const dataFormatada = data.toISOString().split('T')[0];
        document.getElementById('data_avaliacao').value = dataFormatada;
    } else {
        document.getElementById('data_avaliacao').value = '';
    }

    // Preencher o select de professores
    try {
        const response = await fetch('http://localhost:3001/professor');
        if (!response.ok) throw new Error('Erro ao buscar professores');
        const professores = await response.json();

        const selectProfessor = document.getElementById('professor_pessoa_id_pessoa');
        selectProfessor.innerHTML = ''; // limpa antes de preencher

        // cria opção vazia
        const optionVazia = document.createElement('option');
        optionVazia.value = '';
        optionVazia.textContent = 'Selecione um professor';
        selectProfessor.appendChild(optionVazia);

        // popula com dados vindos da API
        professores.forEach(prof => {
            const option = document.createElement('option');
            option.value = prof.pessoa_id_pessoa;
            option.textContent = `${prof.mnemonico_professor} - ${prof.departamento_professor}`;
            if (avaliacao.professor_pessoa_id_pessoa === prof.pessoa_id_pessoa) {
                option.selected = true; // marca o professor da avaliação
            }
            selectProfessor.appendChild(option);
        });

    } catch (error) {
        console.error('Erro ao carregar professores:', error);
    }

    document.getElementById('porcentagem_tolerancia_avaliacao').value = avaliacao.porcentagem_tolerancia_avaliacao || 0;
}



// Função para incluir avaliacao
async function incluirAvaliacao() {

    mostrarMensagem('Digite os dados!', 'success');
    currentPersonId = searchId.value;
    // console.log('Incluir nova avaliacao - currentPersonId: ' + currentPersonId);
    limparFormulario();
    searchId.value = currentPersonId;
    bloquearCampos(true);

    mostrarBotoes(false, false, false, false, true, true); // mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('descricao_avaliacao').focus();
    operacao = 'incluir';
    // console.log('fim nova avaliacao - currentPersonId: ' + currentPersonId);
}

// Função para alterar avaliacao
async function alterarAvaliacao() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('descricao_avaliacao').focus();
    operacao = 'alterar';
}

// Função para excluir avaliacao
async function excluirAvaliacao() {
    mostrarMensagem('Excluindo avaliacao...', 'info');
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
    const avaliacao = {
        id_avaliacao: searchId.value,
        descricao_avaliacao: formData.get('descricao_avaliacao'),
        data_avaliacao: formData.get('data_avaliacao'),
        professor_pessoa_id_pessoa: formData.get('professor_pessoa_id_pessoa'),
        porcentagem_tolerancia_avaliacao: formData.get('porcentagem_tolerancia_avaliacao')        
    };
    let response = null;
    try {
        if (operacao === 'incluir') {
           // console.log('Incluindo nova avaliacao com dados:', avaliacao);

            response = await fetch(`${API_BASE_URL}/avaliacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(avaliacao)
            });
        } else if (operacao === 'alterar') {
            response = await fetch(`${API_BASE_URL}/avaliacao/${currentPersonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(avaliacao)
            });
        } else if (operacao === 'excluir') {
            // console.log('Excluindo avaliacao com ID:', currentPersonId);
            response = await fetch(`${API_BASE_URL}/avaliacao/${currentPersonId}`, {
                method: 'DELETE'
            });
            console.log('Avaliacao excluída' + response.status);
        }
        if (response.ok && (operacao === 'incluir' || operacao === 'alterar')) {
            const novaAvaliacao = await response.json();
            mostrarMensagem('Operação ' + operacao + ' realizada com sucesso!', 'success');
            limparFormulario();
            carregarAvaliacoes();

        } else if (operacao !== 'excluir') {
            const error = await response.json();
            mostrarMensagem(error.error || 'Erro ao incluir avaliacao', 'error');
        } else {
            mostrarMensagem('Avaliacao excluída com sucesso!', 'success');
            limparFormulario();
            carregarAvaliacoes();
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao incluir ou alterar a avaliacao', 'error');
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

// Função para carregar lista de avaliacao
async function carregarAvaliacoes() {
    try {
        const response = await fetch(`${API_BASE_URL}/avaliacao`);
        //    debugger
        if (response.ok) {
            const avaliacoes = await response.json();
            renderizarTabelaAvaliacoes(avaliacoes);
        } else {
            throw new Error('Erro ao carregar avaliacoes');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de avaliacoes', 'error');
    }
}

// Função para renderizar tabela de avaliacoes
function renderizarTabelaAvaliacoes(avaliacoes) {
    avaliacoesTableBody.innerHTML = '';

    avaliacoes.forEach(avaliacao => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>
                        <button class="btn-id" onclick="selecionarAvaliacao(${avaliacao.id_avaliacao})">
                            ${avaliacao.id_avaliacao}
                        </button>
                    </td>
                    <td>${avaliacao.descricao_avaliacao}</td>
                    <td> ${formatarData(avaliacao.data_avaliacao)}</td>
                    <td>${avaliacao.professor_pessoa_id_pessoa}</td>                    
                    <td>${avaliacao.porcentagem_tolerancia_avaliacao}</td>
                                 
                `;
        avaliacoesTableBody.appendChild(row);
    });
}

// Função para selecionar avaliacao da tabela
async function selecionarAvaliacao(id) {
    searchId.value = id;
    await buscarAvaliacao();
}
