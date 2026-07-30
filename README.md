# Krypton Frontend

React + Vite chat UI for the Spring AI Ollama backend.

## Run

```bash
npm install
npm run dev
```

Keep the Spring Boot backend running on `http://localhost:8080`. Vite proxies `/api` to that backend, so the app calls:

```text
GET /api/ollama/{message}
```
