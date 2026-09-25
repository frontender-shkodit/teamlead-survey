# Анкета 2 — Тимлид: состояние проекта и потребности

Локально: `npm install`, затем `npm run dev`.
Проверка production build: `npm run build`.

## GitHub Pages
Загрузите содержимое папки в корень нового репозитория (ветка `main`). Затем: Settings → Pages → Source → GitHub Actions. Workflow сам установит зависимости, соберёт проект и опубликует `dist`.

В `vite.config.ts` установлен `base: './'`, поэтому имя GitHub-репозитория прописывать не нужно.
