# ⚡ FlyRank AI Streaming Chat Interface (FE-06 Capstone)

A production-grade, highly resilient streaming AI chat interface built with **Next.js 15 (App Router)**, **Vercel AI SDK**, **Google Gemini Free Tier (with Multi-Provider Architecture)**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Features & Engineering Highlights

### 1. Token-by-Token Streaming
- Utilizes `streamText` from the Vercel AI SDK to stream real-time Server-Sent Events (SSE) with minimal time-to-first-token.
- Server-side route handler (`src/app/api/chat/route.ts`) handles multi-turn conversation payloads and keeps all API keys strictly secured on the server.

### 2. Resilient Stop Button Lifecycle ("Buttons with a Brain")
- Stopping mid-stream preserves all partially emitted tokens in the conversation history.
- The input immediately re-enables and unlocks the interface for subsequent prompts without state corruption or broken turns.
- Action button implements 5 distinct states:
  - **Idle**: Empty input, disabled state.
  - **Ready**: High-intent glow when prompt text is present.
  - **Thinking**: Pulsing spinner awaiting the first streamed token.
  - **Streaming**: Active stop generation trigger with smooth micro-interaction.
  - **Stopped / Error**: Instant recovery for immediate continuation.

### 3. Smart Auto-Scroll & Scroll-Up Detection
- **Pinned when at bottom**: Automatically tracks streaming tokens if the user is within 80px of the bottom.
- **Instant unpin on scroll up**: If the user scrolls up to read earlier responses while tokens are actively streaming, auto-scroll releases instantly.
- **Floating "Jump to Latest" Affordance**: Displays a floating pill with a live unread pulse indicator when new tokens stream while scrolled up.

### 4. Smooth Thinking-to-Token Handoff
- Thinking indicator uses Framer Motion layout animations to transition fluidly into the first streamed token without visual jumps or blank frames.

### 5. Stream-Safe Markdown & Code Rendering
- Streaming markdown repair balances unclosed code fences (` ``` `) and dangling tags mid-stream.
- Syntax-highlighted code blocks with language header and one-click copy-to-clipboard functionality.
- Formatted tables with horizontal scroll containers, blockquotes, ordered/unordered lists, and external links.

### 6. Centralized Model Configuration Module (`src/lib/ai/config.ts`)
- Isolates system prompt, generation hyperparameters, and supported model catalog in one well-commented module.
- Ready for immediate extension in **FE-07** (tool calling, structured outputs, multi-modal attachments).
- Supports Google Gemini free tier (`gemini-3.6-flash`, `gemini-3.7-flash`, `gemini-3.5-flash`), Anthropic Claude (`claude-3-5-sonnet`), and OpenAI (`gpt-4o-mini`).

### 7. Multi-Turn State Persistence
- Syncs full conversation state with `localStorage`, preventing data loss on page refresh.
- Includes conversation export to clean Markdown format and a clear history trigger.

### 8. Responsive Mobile UX
- Responsive design tailored for mobile screens with `100dvh` dynamic viewport height support, touch-friendly targets, and auto-resizing textarea.

---

## 🏗️ Project Architecture

```
├── .env.example                     # Environment variable template
├── .env.local                       # Server-side API keys
├── package.json                     # Project dependencies & scripts
├── tailwind.config.ts               # Tailwind CSS theme & animations
├── tsconfig.json                    # TypeScript compiler configuration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts         # Server-side streaming Route Handler
│   │   ├── globals.css              # Custom styling & scrollbar design
│   │   ├── layout.tsx               # Root layout & mobile viewport config
│   │   └── page.tsx                 # Main application page
│   ├── components/
│   │   └── chat/
│   │       ├── ChatContainer.tsx    # Primary chat coordinator
│   │       ├── ChatHeader.tsx       # Model picker, streaming pulse, actions
│   │       ├── ChatInput.tsx        # Auto-resizing textarea & 5-state button
│   │       ├── MarkdownRenderer.tsx # Stream-safe markdown & code blocks
│   │       ├── MessageItem.tsx      # User/Assistant bubble & avatars
│   │       ├── MessageList.tsx      # Conversation list & starter prompts
│   │       ├── ScrollToBottom.tsx   # Floating scroll-to-bottom button
│   │       └── ThinkingIndicator.tsx# Animated thinking handoff
│   ├── hooks/
│   │   ├── useAutoScroll.ts         # Scroll pinning & unpin heuristics
│   │   └── useChatPersistence.ts    # Safe local storage synchronization
│   └── lib/
│       ├── ai/
│       │   ├── config.ts            # Centralized system prompt & models
│       │   └── models.ts            # Provider factory (Gemini, Claude, OpenAI)
│       └── utils.ts                 # Class merging & markdown sanitizer
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd "Streaming AI chat interface"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Google Gemini API key:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Evaluation Checklist Verification

- [x] **Responses visibly stream token by token**: Verified via Server-Sent Events from `streamText`.
- [x] **Generation can be stopped mid-stream**: Stop button aborts generation, keeps partial tokens, re-enables input, and allows subsequent messages.
- [x] **Conversation state survives multiple turns**: Multi-turn history preserved in memory and synced to `localStorage`.
- [x] **API key lives server-side only**: Environment variables are accessed exclusively in server route handlers.
- [x] **Usable at phone width**: Verified at 375px+ with dynamic viewport height and responsive layout.
- [x] **Clean Model Config Module**: `src/lib/ai/config.ts` prepared for FE-07 extension.

---

## 📄 License
MIT © FlyRank AI Internship
