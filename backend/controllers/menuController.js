app.get('/abrirMenu', (req, res) => {
    console.log('Rota abrir - Menu Acessando menu.html');
    res.sendFile(path.join(__dirname, '../frontend/menu.html'));
});

app.get('/inicio', (req, res) => {
    console.log('rota menu/inicio - Acessando index.html');
    res.sendFile(path.join(__dirname, '../index.html'));
});

let mnemonicoProfessorGlobal = null;
// Rota de menu (protege via cookie) - checkAuth 
app.get('/usuarioLogado', (req, res) => {
    console.log('Acessando rota /usuarioLogado');
    const nome = req.cookies.usuarioLogado;
    if (nome) {
        res.json({ status: 'ok', nome, mnemonicoProfessor: mnemonicoProfessorGlobal });
    } else {
        res.json({ status: 'nao_logado' });
    }
});


