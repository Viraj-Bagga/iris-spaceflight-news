<p align="center">
  <img src="docs/iris-avatar.png" width="120" alt="Iris, the bot's avatar">
</p>

<h1 align="center">Iris</h1>

<p align="center">
  A Discord bot that watches spaceflight news for AFROTC i5 squadrons.<br>
  <a href="https://viraj-bagga.github.io/iris-spaceflight-news/"><b>Landing page</b></a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#running-it">Run it</a>
</p>

Every ten minutes Iris pulls new articles, keeps the ones that matter to Space Force-track cadets, writes a two to three line summary, and posts it to every server that has installed it.

![The Iris landing page: the Iris character above the IRIS wordmark and an "Add Iris to your server" button](docs/screenshots/hero.png)

## How it works

The pipeline is a LangGraph graph in `main.py`. The Discord side is in `bot.py`.

```mermaid
flowchart LR
    A["Spaceflight News API v4<br/>new since last run"] --> B["Dedup against SQLite<br/>URL is unique"]
    B --> C["Full text<br/>Jina Reader"]
    C --> D["Relevance grade + summary<br/>gpt-4o-mini, JSON mode"]
    D --> E["Post to every<br/>registered channel"]
```

1. **fetch** pulls the latest articles and keeps only ones published since the last run that aren't already in the database. The first run looks back 15 minutes so it doesn't dump a backlog.
2. **get_md** fetches each article's full text through Jina Reader.
3. **decision_model** asks gpt-4o-mini, in JSON mode, whether the article is relevant (military space, leadership, aerospace engineering, national security) and, if so, for a short summary. Failures are skipped, not posted.
4. **bot.py** runs the graph off the event loop every 10 minutes and posts each approved article to every registered channel.

## Multi-tenant by design

Each article is fetched and graded once, then fanned out to every server. Adding servers adds Discord messages, not model calls, so the LLM cost stays flat as more squadrons install it.

- `/setup #channel` picks where news is posted. It requires the Manage Server permission.
- When the bot is removed from a server, that server's row is deleted.

## Running it

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add OPENAI_API_KEY, JINA_API_KEY, DISCORD_BOT_TOKEN
python3 bot.py
```

The bot creates `space_articles.db` on first run. Invite it with the URL in `website/src/lib/constants.ts`, then run `/setup` in your server.

## Website

`website/` is the landing page squadrons use to add the bot: Vite, React, TypeScript, Tailwind and Framer Motion. It deploys to GitHub Pages from `main` on every change (`.github/workflows/pages.yml`).

| How it works | Setup |
| --- | --- |
| ![The three-step How it works section](docs/screenshots/how-it-works.png) | ![The Setup section with a preview of an Iris post in Discord](docs/screenshots/setup.png) |

<p align="center">
  <img src="docs/screenshots/phone-hero.png" width="220" alt="The landing page hero on a phone">
  &nbsp;
  <img src="docs/screenshots/phone-setup.png" width="220" alt="The setup section on a phone">
</p>

```bash
cd website && npm install && npm run dev
```

The screenshots are captured from a production build by `scripts/screenshots.mjs` (`.github/workflows/screenshots.yml`).

## Status

The bot runs locally. Next up: [always-on hosting](../../issues/3) and [tracking how many squadrons have installed it](../../issues/4).
