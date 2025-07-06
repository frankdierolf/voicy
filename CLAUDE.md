# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
pnpm dev                 # Start development server on http://localhost:3000
pnpm build               # Build for production
pnpm preview             # Preview production build
pnpm generate            # Generate static site
```

### Code Quality
```bash
pnpm lint                # Run ESLint
pnpm typecheck           # TypeScript type checking
```

### Database
```bash
pnpm db:generate         # Generate database migrations (Drizzle ORM)
```

### Deployment
```bash
npx nuxthub deploy       # Deploy to NuxtHub (Cloudflare)
```

## Architecture Overview

### Tech Stack
- **Framework**: Nuxt 3 with TypeScript and Vue 3
- **UI**: Nuxt UI Pro (TailwindCSS-based component library)
- **Database**: SQLite via Cloudflare D1 with Drizzle ORM
- **AI Integration**: Vercel AI SDK v5 with Cloudflare Workers AI
- **Authentication**: GitHub OAuth via nuxt-auth-utils
- **Deployment**: NuxtHub (Cloudflare infrastructure)

### Directory Structure

#### `/app/` - Frontend Application
- **components/**: Vue components (navbar, modals, user menu)
- **composables/**: Shared Vue logic
  - `useChats.ts`: Chat management (CRUD operations)
  - `useLLM.ts`: AI chat functionality with Vercel AI SDK
  - `useHighlighter.ts`: Syntax highlighting for code blocks
- **pages/**: Application routes
  - `index.vue`: Home/chat page
  - `login.vue`: Authentication page
- **layouts/**: Page layout templates
- **middleware/**: Route middleware for auth
- **assets/css/**: Stylesheets including Tailwind config
- **types/**: TypeScript definitions

#### `/server/` - Backend Application
- **api/**: RESTful API endpoints
  - `chats.*.ts`: Chat CRUD operations
  - `chats/[id].*.ts`: Message operations within chats
- **database/**: Database configuration
  - `schema.ts`: Drizzle ORM schema (users, chats, messages)
  - `migrations/`: Generated SQL migrations
- **routes/**: Server routes
  - `auth/github.get.ts`: GitHub OAuth callback handler
- **utils/**: Server utilities
  - `db.ts`: Database connection helper

### Key Patterns

1. **API Routes**: Follow REST conventions with `.get.ts`, `.post.ts`, `.delete.ts` suffixes
2. **Database Access**: Use Drizzle ORM with type-safe queries via `useDrizzle()`
3. **Authentication**: Session-based auth with `requireUserSession()` helper
4. **AI Integration**: Stream responses using Vercel AI SDK with Workers AI provider
5. **State Management**: Use Vue composables for client-side state
6. **Error Handling**: Consistent error responses with proper HTTP status codes

### Database Schema
- **users**: GitHub OAuth user data (id, email, name, avatar, username)
- **chats**: User conversations (id, title, userId, createdAt)
- **messages**: Chat messages (id, chatId, role, content, createdAt)

### Important Configuration Files
- `nuxt.config.ts`: Main Nuxt configuration with module setup
- `drizzle.config.ts`: Database migration configuration
- `eslint.config.mjs`: Code style rules (no comma dangle, 1tbs brace style)
- `tsconfig.json`: TypeScript configuration

### Environment Variables Required
- `NUXT_SESSION_PASSWORD`: 32-character session secret
- `NUXT_OAUTH_GITHUB_CLIENT_ID`: GitHub OAuth app ID
- `NUXT_OAUTH_GITHUB_CLIENT_SECRET`: GitHub OAuth secret
- `OPENAI_API_KEY`: For voice transcription (mentioned in README but not implemented)

### Notes
- The README mentions voice input features (VoiceInput.vue, useVoiceRecording.ts, transcribe.post.ts) but these files are not present in the codebase
- Uses Cloudflare infrastructure extensively (Workers, D1 database, deployment)
- Privacy-focused design with no analytics or tracking
- Modern development setup with hot reload, TypeScript, and ESLint