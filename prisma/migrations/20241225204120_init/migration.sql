-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "data_nascimento" DATE,
    "email" TEXT,
    "telefone" TEXT,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laudos" (
    "id" UUID NOT NULL,
    "paciente_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "diagnostico" TEXT,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arquivos" (
    "id" UUID NOT NULL,
    "laudo_id" UUID NOT NULL,
    "nome_original" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "tamanho" BIGINT NOT NULL,
    "path" TEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_crp_key" ON "usuarios"("crp");

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laudos" ADD CONSTRAINT "laudos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laudos" ADD CONSTRAINT "laudos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_laudo_id_fkey" FOREIGN KEY ("laudo_id") REFERENCES "laudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
