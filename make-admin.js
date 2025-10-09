// Este script define um usuário como administrador no Firebase.
// USO:
// 1. Defina a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS para o caminho do seu arquivo de chave de serviço.
//    (Baixe a chave de: Console do Firebase > Configurações do Projeto > Contas de Serviço > Gerar nova chave privada)
// 2. Verifique se você está autenticado no Firebase CLI (`firebase login`).
// 3. Rode o script: node make-admin.js seu-email@exemplo.com

const admin = require('firebase-admin');

// Configuração do Firebase - Colada diretamente aqui para evitar erros de importação
const firebaseConfig = {
  "projectId": "studio-5819073523-156bd",
  "appId": "1:333068583551:web:6c3a909613be29a464354a",
  "apiKey": "AIzaSyC_C0TCec5bEqmATptvH6U_BPmsZufDlr0",
  "authDomain": "studio-5819073523-156bd.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "333068583551"
};

// Pega o email da linha de comando
const email = process.argv[2];

if (!email) {
  console.error('Erro: Forneça um endereço de e-mail como argumento.');
  console.error('Uso: node make-admin.js seu-email@exemplo.com');
  process.exit(1);
}

try {
  // Inicializa o SDK Admin com o Project ID explícito
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: firebaseConfig.projectId,
  });
  console.log(`SDK Admin inicializado para o projeto: ${firebaseConfig.projectId}.`);
} catch (e) {
  console.error("Falha na inicialização do SDK Admin.");
  console.error("Verifique se a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS está definida corretamente.");
  console.error(e);
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