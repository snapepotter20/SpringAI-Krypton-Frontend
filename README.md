<img width="1466" height="832" alt="Krypton-ss1" src="https://github.com/user-attachments/assets/eec52e1c-eb50-461f-8bb2-8c6f6afe0fb0" />
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
