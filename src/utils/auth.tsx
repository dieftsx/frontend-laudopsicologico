import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export async function createUser(userData: {
  nome: string;
  email: string;
  senha: string;
  crp: string;
}) {
  // Verifica se o email já existe
  const existingUser = await prisma.usuario.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new Error('Email já está em uso');
  }

  // Hash da senha
  const senhaHash = await bcrypt.hash(userData.senha, 10);

  // Criar o usuário
  const novoUsuario = await prisma.usuario.create({
    data: {
      nome: userData.nome,
      email: userData.email,
      senhaHash: senhaHash,
      crp: userData.crp,
    },
  });

  // Retorna o usuário sem a senha
  const { senhaHash: _, ...usuarioSemSenha } = novoUsuario;
  return usuarioSemSenha;
}

// Função para verificar login
export async function verificarLogin(email: string, senha: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

  if (!senhaValida) {
    throw new Error('Senha incorreta');
  }

  const { senhaHash: _, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}