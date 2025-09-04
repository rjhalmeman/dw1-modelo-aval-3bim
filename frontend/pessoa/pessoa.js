
// Configuração da API, IP e porta.
const API_BASE_URL = 'http://localhost:3001';
let currentPersonId = null;
let operacao = null;

// Elementos do DOM
const form = document.getElementById('pessoaForm');
const searchId = document.getElementById('searchId');
const btnBuscar = document.getElementById('btnBuscar');
const btnIncluir = document.getElementById('btnIncluir');
const btnAlterar = document.getElementById('btnAlterar');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');
const pessoasTableBody = document.getElementById('pessoasTableBody');
const messageContainer = document.getElementById('messageContainer');

// Carregar lista de pessoas ao inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarPessoas();
});

// Event Listeners
btnBuscar.addEventListener('click', buscarPessoa);
btnIncluir.addEventListener('click', incluirPessoa);
btnAlterar.addEventListener('click', alterarPessoa);
btnExcluir.addEventListener('click', excluirPessoa);
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
    const inputs = document.querySelectorAll('input, select,checkbox'); // Seleciona todos os inputs e selects do DOCUMENTO
    inputs.forEach((input, index) => {
        // console.log(`Input ${index}: ${input.name}, disabled: ${input.disabled}`);
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
    document.getElementById('mnemonicoProfessor').value = '';
    document.getElementById('departamentoProfessor').value = '';
    document.getElementById('checkboxAvaliador').checked = false;    
    document.getElementById('checkboxAvaliado').checked = false;
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

async function funcaoEhProfessor(pessoaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/professor/${pessoaId}`);

        if (response.status === 404) {
            return { ehProfessor: false };
        }

        if (response.status === 200) {
            const professorData = await response.json();
            return {
                ehProfessor: true, // CORREÇÃO: era "pessoa_id_pessoa: true"
                mnemonico: professorData.mnemonico_professor, // CORREÇÃO: usar o nome correto do campo
                departamento: professorData.departamento_professor // CORREÇÃO: usar o nome correto do campo
            };
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na requisição:', errorData.error);
            return { ehProfessor: false };
        }

    } catch (error) {
        console.error('Erro ao verificar se é professor:', error);
        return { ehProfessor: false };
    }
}



// Função para buscar pessoa por ID
async function buscarPessoa() {
    const id = searchId.value.trim();
    if (!id) {
        mostrarMensagem('Digite um ID para buscar', 'warning');
        return;
    }

    bloquearCampos(false);
    searchId.focus();
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa/${id}`);

        if (response.ok) {
            const pessoa = await response.json();
            preencherFormulario(pessoa);

            mostrarBotoes(true, false, true, true, false, false);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Pessoa encontrada!', 'success');

        } else if (response.status === 404) {
            limparFormulario();
            searchId.value = id;
            mostrarBotoes(true, true, false, false, false, false); //mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
            mostrarMensagem('Pessoa não encontrada. Você pode incluir uma nova pessoa.', 'info');
            bloquearCampos(false);//bloqueia a pk e libera os demais campos
            //enviar o foco para o campo de nome
        } else {
            throw new Error('Erro ao buscar pessoa');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao buscar pessoa', 'error');
    }

    // Verifica se a pessoa é professor
    const oProfessor = await funcaoEhProfessor(id);

    if (oProfessor.ehProfessor) {
        // alert('É professor: ' + oProfessor.ehProfessor + ' - ' + oProfessor.mnemonico + ' - ' + oProfessor.departamento);
        document.getElementById('checkboxProfessor').checked = true;
        document.getElementById('mnemonicoProfessor').value = oProfessor.mnemonico;
        document.getElementById('departamentoProfessor').value = oProfessor.departamento;
    } else {
        // Não é professor
        document.getElementById('checkboxProfessor').checked = false;
        document.getElementById('mnemonicoProfessor').value = '';
        document.getElementById('departamentoProfessor').value = '';
    }

    //Verifica se a pessoa é avaliador
    try {
        const responseAvaliador = await fetch(`${API_BASE_URL}/avaliador/${id}`);
        if (responseAvaliador.status === 200) {
            document.getElementById('checkboxAvaliador').checked = true;
        } else {
            document.getElementById('checkboxAvaliador').checked = false;
        }
    } catch (error) {
        console.error('Erro ao verificar se é avaliador:', error);
        document.getElementById('checkboxAvaliador').checked = false;
    }

    //Verifica se a pessoa é avaliado
    try {
        const responseAvaliado = await fetch(`${API_BASE_URL}/avaliado/${id}`);
        if (responseAvaliado.status === 200) {
            document.getElementById('checkboxAvaliado').checked = true;
        } else {
            document.getElementById('checkboxAvaliado').checked = false;
        }
    } catch (error) {
        console.error('Erro ao verificar se é avaliado:', error);
        document.getElementById('checkboxAvaliado').checked = false;
    }
}

// Função para preencher formulário com dados da pessoa
function preencherFormulario(pessoa) {
    currentPersonId = pessoa.id_pessoa;
    searchId.value = pessoa.id_pessoa;
    document.getElementById('nome_pessoa').value = pessoa.nome_pessoa || '';
    document.getElementById('email_pessoa').value = pessoa.email_pessoa || '';
    document.getElementById('senha_pessoa').value = pessoa.senha_pessoa || '';
    document.getElementById('primeiro_acesso_pessoa').value = pessoa.primeiro_acesso_pessoa ? 'true' : 'false';

    // Formatação da data para input type="date"
    if (pessoa.data_nascimento) {
        const data = new Date(pessoa.data_nascimento);
        const dataFormatada = data.toISOString().split('T')[0];
        document.getElementById('data_nascimento').value = dataFormatada;
    } else {
        document.getElementById('data_nascimento').value = '';
    }
}


// Função para incluir pessoa
async function incluirPessoa() {

    mostrarMensagem('Digite os dados!', 'success');
    currentPersonId = searchId.value;
    // console.log('Incluir nova pessoa - currentPersonId: ' + currentPersonId);
    limparFormulario();
    searchId.value = currentPersonId;
    bloquearCampos(true);

    mostrarBotoes(false, false, false, false, true, true); // mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_pessoa').focus();
    operacao = 'incluir';
    // console.log('fim nova pessoa - currentPersonId: ' + currentPersonId);
}

// Função para alterar pessoa
async function alterarPessoa() {
    mostrarMensagem('Digite os dados!', 'success');
    bloquearCampos(true);
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)
    document.getElementById('nome_pessoa').focus();
    operacao = 'alterar';
}

// Função para excluir pessoa
async function excluirPessoa() {
    mostrarMensagem('Excluindo pessoa...', 'info');
    currentPersonId = searchId.value;
    //bloquear searchId
    searchId.disabled = true;
    bloquearCampos(false); // libera os demais campos
    mostrarBotoes(false, false, false, false, true, true);// mostrarBotoes(btBuscar, btIncluir, btAlterar, btExcluir, btSalvar, btCancelar)           
    operacao = 'excluir';
}

async function salvarOperacao() {
    //console.log('Operação:', operacao + ' - currentPersonId: ' + currentPersonId + ' - searchId: ' + searchId.value);

    const formData = new FormData(form);
    const pessoa = {
        id_pessoa: searchId.value,
        nome_pessoa: formData.get('nome_pessoa'),
        email_pessoa: formData.get('email_pessoa'),
        senha_pessoa: formData.get('senha_pessoa'),
        primeiro_acesso_pessoa: formData.get('primeiro_acesso_pessoa') === 'true',
        data_nascimento: formData.get('data_nascimento') || null
    };

    let professor = null;
    if (document.getElementById('checkboxProfessor').checked) {
        professor = {
            pessoa_id_pessoa: pessoa.id_pessoa,
            mnemonico_professor: document.getElementById('mnemonicoProfessor').value,
            departamento_professor: document.getElementById('departamentoProfessor').value
        }
    }

    // é avaliador
    let ehAvaliador = document.getElementById('checkboxAvaliador').checked; //true ou false

    // é avaliado
    let ehAvaliado = document.getElementById('checkboxAvaliado').checked; //true ou false

    let responseProfessor = null;
    let responsePessoa = null;
    try {
        if (operacao === 'incluir') {
            responseProfessor = await fetch(`${API_BASE_URL}/pessoa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pessoa)
            });
            responsePessoa = responseProfessor;
            if (document.getElementById('checkboxProfessor').checked) {
                responseProfessor = await fetch(`${API_BASE_URL}/professor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(professor)
                });
            }
            let responseAvaliador = null;
            if (ehAvaliador) {
                const avaliador = {
                    pessoa_id_pessoa: pessoa.id_pessoa
                };
                responseAvaliador = await fetch(`${API_BASE_URL}/avaliador`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(avaliador)
                });
            }

            let responseAvaliado = null;
            if (ehAvaliado) {
                const avaliado = {
                    pessoa_id_pessoa: pessoa.id_pessoa
                };
                responseAvaliado = await fetch(`${API_BASE_URL}/avaliado`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(avaliado)
                });
            }

        } else if (operacao === 'alterar') {
            responseProfessor = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pessoa)
            });
            responsePessoa = responseProfessor;

            if (ehAvaliador) {
                //se DEIXOU de ser avaliador, excluir da tabela avaliador
                const caminhoRota = `${API_BASE_URL}/avaliador/${currentPersonId}`;

                let respObterAvaliador = await fetch(caminhoRota);
                //    console.log('Resposta ao obter avaliador ao alterar pessoa: ' + respObterAvaliador.status);
                let avaliador = null;
                if (respObterAvaliador.status === 404) {
                    //incluir avaliador
                    avaliador = {
                        pessoa_id_pessoa: pessoa.id_pessoa
                    }
                };
                
                respObterAvaliador = await fetch(`${API_BASE_URL}/avaliador`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(avaliador)
                });
            } else {
                //se DEIXOU de ser avaliador, excluir da tabela avaliador
                const caminhoRota = `${API_BASE_URL}/avaliador/${currentPersonId}`;
                let respObterAvaliador = await fetch(caminhoRota);
                // console.log('Resposta ao obter avaliador para exclusão: ' + respObterAvaliador.status);
                if (respObterAvaliador.status === 200) {
                    //existe, pode excluir
                    respObterAvaliador = await fetch(caminhoRota, {
                        method: 'DELETE'
                    });
                }
            }

             if (ehAvaliado) {
                //se DEIXOU de ser avaliado, excluir da tabela avaliado
                const caminhoRota = `${API_BASE_URL}/avaliado/${currentPersonId}`;

                let respObterAvaliado = await fetch(caminhoRota);
                //    console.log('Resposta ao obter avaliado ao alterar pessoa: ' + respObterAvaliado.status);
                let avaliado = null;
                if (respObterAvaliado.status === 404) {
                    //incluir avaliado
                    avaliado = {
                        pessoa_id_pessoa: pessoa.id_pessoa
                    }
                };
                respObterAvaliado = await fetch(`${API_BASE_URL}/avaliado`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(avaliado)
                });
            } else {
                //se DEIXOU de ser avaliado, excluir da tabela avaliado
                const caminhoRota = `${API_BASE_URL}/avaliado/${currentPersonId}`;
                let respObterAvaliado = await fetch(caminhoRota);
                // console.log('Resposta ao obter avaliado para exclusão: ' + respObterAvaliado.status);
                if (respObterAvaliado.status === 200) {
                    //existe, pode excluir
                    respObterAvaliado = await fetch(caminhoRota, {
                        method: 'DELETE'
                    });
                }
            }


            if (document.getElementById('checkboxProfessor').checked) {
                //   console.log('Vai alterar professor: ' + JSON.stringify(professor));
                const caminhoRota = `${API_BASE_URL}/professor/${currentPersonId}`;
                //console.log('Caminho da rota para professor: ' + caminhoRota);
                //obter o professor para ver se existe
                const respObterProfessor = await fetch(caminhoRota);
                if (respObterProfessor.status === 404) {
                    //não existe, incluir       
                    responseProfessor = await fetch(`${API_BASE_URL}/professor`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(professor)
                    });
                } else {
                    //já existe, alterar
                    responseProfessor = await fetch(caminhoRota, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(professor)
                    });
                }
            } else {
                //se DEIXOU de ser professor, excluir da tabela professor
                const caminhoRota = `${API_BASE_URL}/professor/${currentPersonId}`;
                const respObterProfessor = await fetch(caminhoRota);
                //    console.log('Resposta ao obter professor para exclusão: ' + respObterProfessor.status);
                if (respObterProfessor.status === 200) {
                    //existe, pode excluir
                    responseProfessor = await fetch(caminhoRota, {
                        method: 'DELETE'
                    });
                }
            }
        } else if (operacao === 'excluir') {
            //se é avaliador, excluir da tabela avaliador primeiro
            let responseAvaliador = null;
            const caminhoRotaAvaliador = `${API_BASE_URL}/avaliador/${currentPersonId}`;
            const respObterAvaliador = await fetch(caminhoRotaAvaliador);
            //console.log('Resposta ao obter avaliador para exclusão: ' + respObterAvaliador.status);
            if (respObterAvaliador.status === 200) {
                //existe, pode excluir
                responseAvaliador = await fetch(caminhoRotaAvaliador, {
                    method: 'DELETE'
                });
            }

             //se é avaliado, excluir da tabela avaliado primeiro
            let responseAvaliado = null;
            const caminhoRotaAvaliado = `${API_BASE_URL}/avaliado/${currentPersonId}`;
            const respObterAvaliado = await fetch(caminhoRotaAvaliado);
            //console.log('Resposta ao obter avaliado para exclusão: ' + respObterAvaliado.status);
            if (respObterAvaliado.status === 200) {
                //existe, pode excluir
                responseAvaliado = await fetch(caminhoRotaAvaliado, {
                    method: 'DELETE'
                });
            }


            //verificar se é professor, se for, excluir da tabela professor primeiro
            const caminhoRota = `${API_BASE_URL}/professor/${currentPersonId}`;
            const respObterProfessor = await fetch(caminhoRota);
            //    console.log('Resposta ao obter professor para exclusão: ' + respObterProfessor.status);
            if (respObterProfessor.status === 200) {
                //existe, pode excluir
                responseProfessor = await fetch(caminhoRota, {
                    method: 'DELETE'
                });
            }
            //agora exclui da tabela pessoa
            // console.log('Excluindo pessoa com ID:', currentPersonId);
            responseProfessor = await fetch(`${API_BASE_URL}/pessoa/${currentPersonId}`, {
                method: 'DELETE'
            });
            responsePessoa = responseProfessor;
            //  console.log('Pessoa excluída' + responseProfessor.status);
        }

        if (responsePessoa.ok && (operacao === 'incluir' || operacao === 'alterar')) {

            mostrarMensagem('Operação ' + operacao + ' realizada com sucesso!', 'success');
            limparFormulario();
            carregarPessoas();

        } else if (operacao !== 'excluir') {
            const error = await responsePessoa.json();
            mostrarMensagem(error.error || 'Erro ao incluir pessoa', 'error');
        } else {
            mostrarMensagem('Pessoa excluída com sucesso!', 'success');
            limparFormulario();
            carregarPessoas();
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao incluir ou alterar a pessoa', 'error');
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

// Função para carregar lista de pessoas
async function carregarPessoas() {
    try {
        const response = await fetch(`${API_BASE_URL}/pessoa`);

        if (response.ok) {
            const pessoas = await response.json();
            renderizarTabelaPessoas(pessoas);
        } else {
            throw new Error('Erro ao carregar pessoas');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao carregar lista de pessoas', 'error');
    }
}

// Função para renderizar tabela de pessoas
function renderizarTabelaPessoas(pessoas) {
    pessoasTableBody.innerHTML = '';

    pessoas.forEach(pessoa => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>
                        <button class="btn-id" onclick="selecionarPessoa(${pessoa.id_pessoa})">
                            ${pessoa.id_pessoa}
                        </button>
                    </td>
                    <td>${pessoa.nome_pessoa}</td>
                    <td>${pessoa.email_pessoa}</td>
                    <td>${pessoa.primeiro_acesso_pessoa ? 'Sim' : 'Não'}</td>
                    <td>${formatarData(pessoa.data_nascimento)}</td>                 
                `;
        pessoasTableBody.appendChild(row);
    });
}

// Função para selecionar pessoa da tabela
async function selecionarPessoa(id) {
    searchId.value = id;
    await buscarPessoa();
}
