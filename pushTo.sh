#!/bin/bash

# Obtém o nome da pasta atual
current_folder=$(basename "$PWD")

# Nome padrão do repositório remoto
default_remote="https://github.com/rjhalmeman/$current_folder"

clear
git status
echo ""
echo $default_remote
echo

# Verifica se o git está instalado
if ! command -v git &> /dev/null
then
    echo "O Git não está instalado. Por favor, instale o Git antes de continuar."
    exit
fi

# Adiciona todas as alterações ao índice do Git
git add .

# Obtém a data e hora atual e formata para o formato desejado
timestamp=$(date +"%d/%m/%Y - %H:%M:%S")

# Verifica se foi fornecido um parâmetro adicional para a mensagem de commit
if [ $# -eq 0 ]; then
    # Se não houver parâmetros, usa apenas a data/hora
    commit_message="$timestamp"
else
    # Se houver parâmetros, concatena a data/hora com a mensagem fornecida
    commit_message="$timestamp - $*"
fi

# Realiza um commit com a mensagem
git commit -m "$commit_message"

# Faz o push para o repositório remoto padrão no GitHub
git push "$default_remote"