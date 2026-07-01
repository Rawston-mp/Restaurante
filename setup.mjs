#!/usr/bin/env node

/**
 * setup.mjs — executa após clonar o projeto
 * Uso: node setup.mjs
 */
import { execSync } from "child_process";
import { existsSync, copyFileSync } from "fs";
import { randomBytes } from "crypto";

console.log("\n🍽️  Configurando Meu Restaurante...\n");

// 1. Copia .env.example → .env se não existir
if (!existsSync(".env")) {
    copyFileSync(".env.example", ".env");
    // Gera um SESSION_SECRET seguro automaticamente
    const secret = randomBytes(32).toString("hex");
    const { readFileSync, writeFileSync } = await
    import ("fs");
    const env = readFileSync(".env", "utf8").replace(
        "troque-por-uma-string-aleatoria-de-32-caracteres-minimo",
        secret
    );
    writeFileSync(".env", env);
    console.log("✅ .env criado com SESSION_SECRET gerado automaticamente");
} else {
    console.log("ℹ️  .env já existe — pulando");
}

// 2. Instala dependências
console.log("\n📦 Instalando dependências...");
execSync("npm install", { stdio: "inherit" });

// 3. Executa migração do banco
console.log("\n🗄️  Criando banco de dados...");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

// 4. Gera Prisma Client
console.log("\n⚙️  Gerando Prisma Client...");
execSync("npx prisma generate", { stdio: "inherit" });

// 5. Seed inicial
console.log("\n🌱 Populando banco com dados iniciais...");
try {
    process.env.TS_NODE_COMPILER_OPTIONS = '{"module":"CommonJS"}';
    execSync("npx ts-node prisma/seed.ts", { stdio: "inherit" });
} catch {
    console.log("⚠️  Seed ignorado (dados já existem ou erro)");
}

console.log(`
✨ Configuração concluída!

  Comandos disponíveis:
    npm run dev      → Servidor de desenvolvimento (http://localhost:3000)
    npm run build    → Build de produção
    npm run start    → Servidor de produção
    npm run db:studio → Prisma Studio (interface visual do banco)

  Acesso admin:
    URL:   http://localhost:3000/admin/login
    Email: admin@restaurante.com
    Senha: admin123  ← TROQUE NO PAINEL APÓS O PRIMEIRO LOGIN

`);