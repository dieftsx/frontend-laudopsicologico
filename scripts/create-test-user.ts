import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const senha = await hash('senha123', 10)
  
  const usuario = await prisma.usuario.create({
    data: {
      email: 'teste@exemplo.com',
      senha: senha,
      nome: 'Usuário Teste'
    }
  })

  console.log('Usuário de teste criado:', usuario)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 