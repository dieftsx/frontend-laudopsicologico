import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Criar um novo laudo
export async function criarLaudo(data: {
  pacienteId: string;
  usuarioId: string;
  diagnostico: string;
}) {
  const novoLaudo = await prisma.laudo.create({
    data: {
      paciente: {
        connect: { id: data.pacienteId }
      },
      usuario: {
        connect: { id: data.usuarioId }
      },
      diagnostico: data.diagnostico,
      status: 'rascunho'
    },
    include: {
      paciente: true,
      usuario: true
    }
  })
  return novoLaudo
}

// Buscar todos os laudos de um usuário
export async function buscarLaudos(usuarioId: string) {
  const laudos = await prisma.laudo.findMany({
    where: {
      usuarioId: usuarioId
    },
    include: {
      paciente: true,
      arquivos: true
    }
  })
  return laudos
}