import { createUser } from '../utils/auth';

async function criarUsuarioTeste() {
  try {
    const novoUsuario = await createUser({
      nome: "Dieferson",
      email: "teste@example.com",
      senha: "Senha123!",
      crp: "12345"
    });
    
    console.log('Usuário criado com sucesso:', novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
}

criarUsuarioTeste();