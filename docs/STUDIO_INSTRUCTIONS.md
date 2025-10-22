# Memória Permanente do Projeto

Este arquivo serve como contexto permanente para o assistente de IA (App Prototyper).

## 1. Princípio Reitor: Simplicidade de MVP (Mínimo Produto Viável)

**Regra Suprema:** Este projeto é um MVP. O objetivo principal é ter uma aplicação funcional para ser apresentada e, eventualmente, lançada. A complexidade deve ser evitada a todo custo.

- **Priorize a Simplicidade:** Para qualquer funcionalidade, a primeira pergunta deve ser: "Qual é a maneira mais simples e direta de fazer isso funcionar?". Soluções complexas ou "elegantes" que introduzam riscos de instabilidade ou dependam de configurações frágeis (como regras de segurança complexas do Firestore) devem ser descartadas em favor de abordagens mais simples e robustas.
- **Funcionalidade > Automação Total:** Se uma automação completa é difícil ou arriscada, prefira uma solução semi-manual que funcione de forma confiável (por exemplo, exibir instruções para o admin em vez de tentar executar uma ação complexa que falha).
- **Evolução Gradual:** Aprimoramentos e otimizações podem e devem ser feitos com o tempo, *após* o lançamento do MVP. O foco agora é construir uma base sólida e funcional.

## 2. Fluxo de Trabalho de Colaboração (Regra Principal)

Siga este processo para TODAS as solicitações de alteração de código:

1.  **Trabalhe em Micro-tarefas:** Divida as solicitações do usuário em pequenas tarefas independentes e gerenciáveis.
2.  **Planeje Antes de Agir:** Para cada micro-tarefa, analise a situação e apresente um plano claro para o usuário, explicando o "o quê" e o "porquê".
3.  **Aja Apenas Quando Instruído:** NUNCA implemente o plano ou gere o código de alteração sem a permissão explícita do usuário (ex: "aprovado", "manda ver", "pode fazer").

## 3. Contexto Técnico e de Projeto

Estas são regras e informações para guiar o desenvolvimento.

### 3.1 Regras Técnicas Permanentes

- **Regra do Elemento Raiz Único (JSX):** Todo componente React deve retornar um único elemento JSX. Se houver múltiplos elementos no nível superior do `return`, envolva-os com um Fragmento React (`<>...</>`) para evitar erros de compilação.

### 3.2 Features Restantes do MVP

Aqui está um resumo das principais funcionalidades que ainda precisam ser implementadas para concluir o MVP:

- **Poderes de Admin:**
    - Mudar a role de um usuário (ex: para afiliado).
    - Editar memoriais que não pertencem a ele.
    - Ver estatísticas gerais da plataforma.

- **Dashboard SaaS (Customizado por Role):**
    - Apresentar um dashboard diferente para usuários normais, administradores e afiliados, mostrando métricas e funções relevantes para cada um.

- **Sistema de Afiliados (Funerárias):**
    - Criação de usuários afiliados com comissionamento.
    - Interface para pagamentos manuais (QR Code PIX, upload de comprovante).
    - Página pública (landing page) padronizada para cada funerária/afiliado.
    - Área no site para listar as funerárias parceiras.

- **Alterações Visuais Finais:**
    - Ajustar o design das páginas principais para corresponder a um modelo visual final.

- **Integração com Firebase Storage:**
    - Substituir o sistema de upload de imagens local pelo serviço do Firebase Storage.

### 3.3 Prioridade de Implementação

- **Regra de Prioridade Máxima:** A integração com o **Firebase Storage** (finalização da galeria e outros uploads) deve ser a **ÚLTIMA feature a ser implementada** no escopo do MVP. Todas as outras funcionalidades devem ser desenvolvidas antes dela.
