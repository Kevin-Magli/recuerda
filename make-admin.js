// Este script define um usuário como administrador no Firebase.
// USO:
// 1. Verifique se você está autenticado no Firebase CLI (`firebase login`).
// 2. Verifique se o seu projeto está selecionado (`firebase use <project_id>`).
// 3. Rode o script: node make-admin.js seu-email@exemplo.com

const admin = require('firebase-admin');

// INICIALIZAÇÃO:
// O SDK Admin precisa das credenciais do seu projeto.
// A maneira mais fácil é definir a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS
// para o caminho do seu arquivo de chave de serviço.
// Baixe a chave de: Console do Firebase > Configurações do Projeto > Contas de Serviço > Gerar nova chave privada.
// OU, se estiver rodando em um ambiente Google (como o Cloud Shell), ele pode encontrar as credenciais automaticamente.

try {
  admin.initializeApp();
  console.log("SDK Admin inicializado com credenciais de ambiente padrão.");
} catch (e) {
  console.error("Falha na inicialização padrão. Você precisa configurar as credenciais.");
  console.error("Consulte: https://firebase.google.com/docs/admin/setup#initialize-sdk");
  process.exit(1);
}


// Pega o email da linha de comando
const email = process.argv[2];

if (!email) {
  console.error('Erro: Forneça um endereço de e-mail como argumento.');
  console.error('Uso: node make-admin.js seu-email@exemplo.com');
  process.exit(1);
}

console.log(`Tentando tornar "${email}" um administrador...`);

// Inicia o processo para definir a custom claim
admin.auth().getUserByEmail(email)
  .then((user) => {
    console.log(`Usuário encontrado: ${user.uid}`);
    return admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
  })
  .then(() => {
    console.log(`\nSucesso! O usuário "${email}" agora é um administrador.`);
    console.log("Faça logout e login novamente no aplicativo para ver as alterações.");
    process.exit(0);
  })
  .catch((error) => {
    if (error.code === 'auth/user-not-found') {
      console.error(`Erro: Usuário com e-mail "${email}" não encontrado.`);
    } else {
      console.error('Ocorreu um erro inesperado:');
      console.error(error);
    }
    process.exit(1);
  });
