# AI Agent Service

Simple AI coding assistant service.

## Features

- Code analysis
- Chat interface
- Code completion (TODO)
- Refactoring suggestions (TODO)

## API Endpoints

- `POST /analyze` - Analyze code
- `POST /chat` - Chat with AI
- `POST /complete` - Code completion
- `POST /refactor` - Refactor code
- `GET /health` - Health check

## Setup

```bash
npm install
cp .env.example .env
# Add your OpenAI API key or configure local LLM
npm run dev
```

## Integration Options

1. **OpenAI API**: Set `OPENAI_API_KEY` in `.env`
2. **Local LLM**: Use Ollama or similar, set `LOCAL_LLM_URL`

## TODO

- [ ] Implement OpenAI integration
- [ ] Add local LLM support (Ollama)
- [ ] Implement code completion
- [ ] Add syntax checking
- [ ] Implement refactoring logic
