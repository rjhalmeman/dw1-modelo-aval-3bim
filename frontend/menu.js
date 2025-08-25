function handleUserAction(action) {
  if (action === "gerenciar-conta") {
    alert("Redirecionando para a página de Gerenciar Conta...");
    // window.location.href = "/gerenciar-conta";
  } else if (action === "sair") {
    alert("Desconectando...");
    // logout();
  }
}

// A função 'logout' original
function logout() {
  alert("Desconectando...");
  // window.location.href = "/login";
}