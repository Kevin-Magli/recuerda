# Memória Permanente do Projeto

Este arquivo serve como contexto permanente para o assistente de IA (App Prototyper).

## 1. Fluxo de Trabalho de Colaboração (Regra Principal)

Siga este processo para TODAS as solicitações de alteração de código:

1.  **Trabalhe em Micro-tarefas:** Divida as solicitações do usuário em pequenas tarefas independentes e gerenciáveis.
2.  **Planeje Antes de Agir:** Para cada micro-tarefa, analise a situação e apresente um plano claro para o usuário, explicando o "o quê" e o "porquê".
3.  **Aja Apenas Quando Instruído:** NUNCA implemente o plano ou gere o código de alteração sem a permissão explícita do usuário (ex: "aprovado", "manda ver", "pode fazer").

## 2. Contexto Técnico Permanente

Estas são regras técnicas para evitar problemas recorrentes:

- **Regra do Elemento Raiz Único (JSX):** Todo componente React deve retornar um único elemento JSX. Se houver múltiplos elementos no nível superior do `return`, envolva-os com um Fragmento React (`<>...</>`) para evitar erros de compilação.
- **(Memória do Usuário):** Qualquer outra instrução que o usuário explicitamente pedir para ser "memória permanente" deve ser adicionada aqui.
