# Imóveis Archanjo

Plataforma web para corretores de imóveis: cadastro com aprovação de admin,
publicação de imóveis com fotos reais e catálogo público — construída com
Next.js + Supabase (Postgres + Auth + Storage reais, não é protótipo local).

## 1. Criar o projeto no Supabase (gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New Project**, escolha um nome (ex: `imoveis-archanjo`) e uma senha
   para o banco (guarde-a, mas ela não é usada aqui) e a região mais próxima
   (`South America (São Paulo)`).
3. Aguarde o projeto ser provisionado (~2 minutos).

## 2. Rodar o schema do banco

1. No painel do Supabase, abra **SQL Editor** → **New query**.
2. Copie todo o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql),
   cole e clique em **Run**.
3. Repita o processo com [`supabase/seed.sql`](supabase/seed.sql) (dados iniciais:
   depoimentos de exemplo e configuração do site).

Isso cria as tabelas, as regras de segurança (RLS), os buckets de upload de
fotos/avatares e a função que transforma o **primeiro usuário cadastrado** em
administrador automaticamente.

## 3. (Recomendado para testar rápido) Desativar confirmação de e-mail

Por padrão o Supabase exige que o usuário confirme o e-mail antes de logar.
Para testar localmente sem configurar um serviço de e-mail:

**Authentication → Providers → Email → desmarque "Confirm email"** e salve.

(Você pode reativar isso quando for para produção e configurar um provedor de
e-mail próprio.)

## 4. Configurar as variáveis de ambiente

1. Em **Project Settings → API**, copie:
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ nunca exponha essa chave publicamente)
2. Copie `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## 6. Testando o fluxo completo

1. Acesse **/cadastro** e crie sua conta (use seus dados reais de corretor).
   Como é o primeiro cadastro do sistema, você vira **administrador aprovado**
   automaticamente.
2. Faça login em **/login** → você cai no **/admin**.
3. Em outra aba (ou navegador anônimo), crie um segundo cadastro em
   **/cadastro** — esse fica **pendente**.
4. No admin, vá em **Corretores** e aprove o segundo usuário.
5. Faça login com o segundo usuário → acesse **/painel** → **Novo imóvel**,
   preencha os dados e envie fotos reais (elas vão para o Supabase Storage).
6. Acesse **/imoveis** sem estar logado — o imóvel deve aparecer no catálogo
   público.
7. No admin, em **Imóveis**, teste remover o imóvel do catálogo e confirme que
   ele some de `/imoveis`.
8. Na home (`/`), envie um depoimento pelo formulário — ele só aparece depois
   de aprovado em **Admin → Depoimentos**.
9. Reinicie o servidor (`Ctrl+C` e `npm run dev` de novo) e confirme que tudo
   continua lá — prova de que os dados são persistidos de verdade no Postgres,
   não em memória/localStorage.

## O que já está pronto (Fase 1)

- Autenticação real (Supabase Auth, senha nunca em texto puro).
- Primeiro usuário = admin automático; demais corretores ficam pendentes até
  aprovação.
- Painel do corretor: CRUD de imóveis com upload de múltiplas fotos/vídeos
  reais, edição de perfil com foto.
- Painel do admin: aprovar/reprovar/bloquear corretores, moderar imóveis
  (ocultar/excluir), aprovar depoimentos, métricas gerais.
- Catálogo público com filtros (tipo, cidade, preço, quartos), busca e
  ordenação, sem precisar de login.
- Página de detalhe do imóvel com galeria, mapa e contato direto por
  WhatsApp/telefone com o corretor responsável.
- Home com contadores animados, seção de lançamentos e depoimentos.
- Tema escuro com detalhes em neon rosa/dourado.

## O que fica para depois (Fase 2)

- Tela de configurações visuais (trocar logo, cores e nome do site sem mexer
  em código).
- Página pública individual por corretor (`/corretor/[nome]`).
- Upload de vídeo de destaque na home (hoje aceita só imagem de capa).
- Deploy na Vercel + conexão do domínio próprio (`imoveisarchanjo.com.br`) —
  o passo a passo de DNS será entregue quando formos publicar.

## Stack

- **Next.js (App Router) + TypeScript** — frontend e backend no mesmo projeto.
- **Supabase** — Postgres real, autenticação com hash seguro de senha e
  armazenamento de arquivos (fotos/vídeos) compatível com S3.
- **Tailwind CSS** — tema visual customizado.
- **zod** — validação de formulários no servidor.
