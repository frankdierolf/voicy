# 🎤 Voicy - Privacy-First Voice Chat

A secure, privacy-focused realtime chat application with voice input powered by AI transcription. Built with Nuxt 3, Nuxt UI Pro, and the Vercel AI SDK.

![Voicy Screenshot](https://img.shields.io/badge/Status-Live-green) ![Voice Input](https://img.shields.io/badge/Voice-Enabled-blue) ![Privacy](https://img.shields.io/badge/Privacy-First-orange)

## ✨ Features

### 🎙️ Voice Input
- **One-click voice recording** with microphone button
- **AI-powered transcription** using OpenAI Whisper
- **Real-time feedback** with recording indicators
- **Keyboard shortcuts** (hold spacebar to record)
- **Auto-stop safety** (30-second limit)

### 🔒 Privacy-Focused
- **Privacy-first design** with user security in mind
- **Transparent data handling** 
- **Secure voice processing** through OpenAI's API
- **No permanent voice storage** - audio processed and discarded

### 💬 Modern Chat Interface
- **Real-time messaging** with AI responses
- **Conversation management** (create, delete, search)
- **Dark/light mode** support
- **Responsive design** for all devices
- **GitHub authentication** integration

### 🚀 Technical Features
- **Nuxt 3** with TypeScript
- **Nuxt UI Pro** for beautiful components
- **Vercel AI SDK v5** for AI integration
- **NuxtHub** for deployment and database
- **Cloudflare Workers AI** for chat responses
- **OpenAI Whisper** for voice transcription

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) with TypeScript
- **UI Library**: [Nuxt UI Pro](https://ui.nuxt.com/pro)
- **AI SDK**: [Vercel AI SDK v5](https://sdk.vercel.ai/)
- **Voice Transcription**: [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text)
- **Chat AI**: [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- **Database**: NuxtHub (Cloudflare D1)
- **Deployment**: [NuxtHub](https://hub.nuxt.com/)
- **Authentication**: [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key for voice transcription

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/frankdierolf/voicy.git
   cd voicy
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your API keys to `.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NUXT_SESSION_PASSWORD=your_32_character_session_password
   NUXT_OAUTH_GITHUB_CLIENT_ID=your_github_client_id
   NUXT_OAUTH_GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Voice Input
1. **Click the microphone button** in any chat input field
2. **Allow microphone permissions** when prompted
3. **Speak your message** (button turns red while recording)
4. **Click again to stop** or wait for auto-stop (30s)
5. **Text appears automatically** in the input field
6. **Edit if needed** and send your message

### Keyboard Shortcuts
- **Hold Spacebar**: Start/stop voice recording (when not typing)
- **Ctrl/Cmd + C**: Create new conversation
- **Escape**: Cancel current recording

## ⚙️ Configuration

### OpenAI Whisper Setup
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your environment variables
3. Whisper supports 50+ languages automatically

### GitHub OAuth Setup
1. Create a GitHub OAuth App in your GitHub Developer Settings
2. Set the callback URL to `https://your-domain.com/auth/github`
3. Add client ID and secret to environment variables

### NuxtHub Deployment
1. Connect your repository to [NuxtHub](https://hub.nuxt.com/)
2. Add environment variables in the dashboard
3. Deploy automatically on git push

## 🔧 Development

### Project Structure
```
voicy/
├── app/
│   ├── components/        # Vue components
│   │   └── VoiceInput.vue # Voice recording component
│   ├── composables/       # Vue composables
│   │   └── useVoiceRecording.ts # Voice recording logic
│   ├── pages/            # Application pages
│   ├── layouts/          # Layout components
│   └── server/           # Server-side code
│       └── api/          # API endpoints
│           └── transcribe.post.ts # Voice transcription API
├── server/
│   ├── api/              # API routes
│   └── database/         # Database schema and migrations
└── public/               # Static assets
```

### Key Components
- **VoiceInput.vue**: Voice recording UI component
- **useVoiceRecording.ts**: Voice recording composable with MediaRecorder API
- **transcribe.post.ts**: OpenAI Whisper integration API endpoint

### Commands
```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm preview            # Preview production build

# Quality Assurance
pnpm lint               # Lint code
pnpm typecheck          # TypeScript checking

# Database
pnpm db:generate        # Generate database migrations

# Deployment
npx nuxthub deploy      # Deploy to NuxtHub
```

## 🔒 Privacy & Security

### Voice Data Handling
- **No permanent storage**: Voice recordings are processed and immediately discarded
- **Secure transmission**: All voice data sent over HTTPS to OpenAI
- **OpenAI compliance**: Follows OpenAI's data usage policies
- **User control**: Recording always requires explicit user action

### Data Protection
- **Session-based authentication** with secure session management
- **Environment variable protection** for API keys
- **HTTPS-only** in production
- **No tracking scripts** or analytics by default

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test` (when available)
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nuxt Team](https://nuxt.com/) for the amazing framework
- [Nuxt UI Team](https://ui.nuxt.com/) for the beautiful components
- [Vercel](https://vercel.com/) for the AI SDK
- [OpenAI](https://openai.com/) for Whisper transcription
- [Cloudflare](https://cloudflare.com/) for Workers AI

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/frankdierolf/voicy/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🚀 Roadmap

- [ ] End-to-end encryption for messages
- [ ] Voice message recording and playback
- [ ] Multi-language voice recognition
- [ ] Custom voice commands
- [ ] Mobile app (React Native/Flutter)
- [ ] Voice-to-voice AI conversations
- [ ] Advanced privacy controls

---

**Made with ❤️ for privacy-conscious users who want the convenience of voice input without compromising their data.**