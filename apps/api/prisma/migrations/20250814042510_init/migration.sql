-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaDeConhecimento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "AreaDeConhecimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sinal" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "proposal_video_url" TEXT NOT NULL,
    "official_youtube_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "areaId" INTEGER NOT NULL,
    "proposerId" INTEGER NOT NULL,
    "moderatorId" INTEGER,

    CONSTRAINT "Sinal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AreaDeConhecimento_nome_key" ON "AreaDeConhecimento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Sinal_nome_key" ON "Sinal"("nome");

-- AddForeignKey
ALTER TABLE "Sinal" ADD CONSTRAINT "Sinal_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaDeConhecimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sinal" ADD CONSTRAINT "Sinal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sinal" ADD CONSTRAINT "Sinal_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
