# Godot Forge

Godot Forge is an interactive 2D game development tutorial. Its 22 modules take learners from character and asset creation through game systems, a physics quiz, and a final game. Lessons include playable Phaser demos, saved progress, and English, Simplified Chinese, and Malay text.

## Run locally

You need Node.js 20 or newer, npm, and an internet connection for the published artwork and audio.

```sh
git clone https://github.com/kenken64/aicuber-2d-game-dev-tutorial.git
cd aicuber-2d-game-dev-tutorial
cp tutorial-web-app/.env.example tutorial-web-app/.env
cd tutorial-web-app
npm ci
npm start
```

Open [http://localhost:3000](http://localhost:3000). The tutorial and its playable modules can run without configuring AI services. To use image generation and storyline voice generation, set `OPENAI_API_KEY` in `tutorial-web-app/.env` and restart the app.

For text and design requests, set `OPENROUTER_API_KEY` and optionally `OPENROUTER_MODEL` (default `openai/gpt-4o-mini`) in `tutorial-web-app/.env` or Railway service variables. The server calls OpenRouter directly. Image and voice generation still use `OPENAI_API_KEY`.

## Modules and project layout

The [web app](tutorial-web-app/README.md) serves the landing page, API, and 22 modules. The sibling module folders contain lessons for character and asset creation, storyline and tilemap design, spawning and AI, controls and physics, achievements and leaderboards, local and online multiplayer, the final cutscene, credits, a quiz, Godot setup, and the final game. See the web app README for the full module list and API details.

| Path | Purpose |
| --- | --- |
| [`tutorial-web-app/`](tutorial-web-app/) | Landing page, Node server, DuckDB persistence, and tests |
| Module folders such as [`character-creation/`](character-creation/) and [`parallax-tiling-map/`](parallax-tiling-map/) | Individual lesson pages and game demos |
| [`upload_spaces_assets.py`](upload_spaces_assets.py) | Incremental DigitalOcean Spaces media upload |
| [`SPACES_PUBLIC_URLS.json`](SPACES_PUBLIC_URLS.json) | Public URL manifest read by the server |

## Media and saved data

The published images and cached storyline voice files are hosted in the `godot-forge` DigitalOcean Spaces bucket in `sgp1`. The URL manifest currently lists 204 images and 7 MP3 files. The app loads published media directly from Spaces. The bucket must allow the app's origin for `GET` and `HEAD`; `http://localhost:3000` is configured for local development. Add your deployed app origin to the bucket's CORS rule before deploying.

Media binaries, local `.env` files, dependencies, and generated output are excluded from Git by [`.gitignore`](.gitignore). The URL manifest and upload script remain in Git. Newly generated learner assets and voice lines are stored locally until they are uploaded; run the [upload workflow](UPLOAD_ASSETS.md) and restart the server to publish them. The uploader checks file content and skips unchanged public objects.

Learner progress and asset metadata are kept in DuckDB. The default local storage directory is `tutorial-web-app/storage/`; set `APP_STORAGE_DIR` or use `RAILWAY_VOLUME_MOUNT_PATH` for persistent deployment storage. A fresh clone starts with a new local database and no saved learner records.

## Tests

From `tutorial-web-app/`:

```sh
npm test
npm run test:modules
npm run test:storyline-voice
npm run test:marketplace-auth
```

The module browser and marketplace authentication tests use Chrome. Additional module-specific test commands are listed in [`tutorial-web-app/package.json`](tutorial-web-app/package.json).

## AI CUBER marketplace deployment

The AI CUBER catalog item is `2d-game-dev-tutorial`, titled **2D Game Development Tutorial**, with the standard 10,000 AI credit monthly workflow price. Users install it in Marketplace and launch it from My Workflows. Deploy both this service and the corresponding catalog/launch configuration in `2ndBrain.ceo`.

Create a separate Railway service from this repository, with the repository root as its root directory. `railway.json` installs the web app dependencies and starts the server on Railway's `PORT`. Use one replica and a persistent volume mounted at `/data`; set `APP_STORAGE_DIR=/data`. DuckDB supports this single-process deployment. Back up the volume to retain progress and generated assets. The service needs outbound access to the published DigitalOcean Spaces assets and AI CUBER's verification endpoint.

Set these variables on the tutorial service:

| Variable | Value |
| --- | --- |
| `MARKETPLACE_AUTH_REQUIRED` | `true` |
| `APP_ORIGIN` | The tutorial's public HTTPS origin, without a trailing slash |
| `GAME_DEV_TUTORIAL_SESSION_SECRET` | A random secret of at least 32 bytes, shared with AI CUBER |
| `MARKETPLACE_LAUNCH_VERIFY_URL` | `https://YOUR-AICUBER-DOMAIN/api/marketplace/launch-session/verify` |
| `MARKETPLACE_LAUNCH_VERIFY_SECRET` | The same secret of at least 32 bytes configured in AI CUBER |
| `APP_STORAGE_DIR` | `/data` |

On AI CUBER, set `GAME_DEV_TUTORIAL_URL=https://YOUR-TUTORIAL-DOMAIN/api/2ndbrain/launch`, the matching `GAME_DEV_TUTORIAL_SESSION_SECRET`, and `MARKETPLACE_LAUNCH_VERIFY_SECRET`. Generate secrets with `openssl rand -hex 32`; store them in service variables. Optional AI generation and cloud editor variables are listed in `tutorial-web-app/.env.example`; leave provisioning disabled unless its separate infrastructure is configured.

Signed launch tokens are exchanged for an HttpOnly, SameSite=Lax session cookie and redirected to `/` to remove the token from the address bar. Cookies use Secure on HTTPS. Launch tokens can be exchanged once per running process; the replay cache resets on restart. Sessions last up to eight hours, retaining the original issue time for logout revocation. Each protected HTTP request verifies the account and installation with AI CUBER; verification failures deny access. Open pages recheck every minute and WebSockets every 30 seconds. `/api/health` remains public and returns only readiness in marketplace mode.

Saved learner progress, checkpoints, quiz answers, and cloud workspace IDs use an account-derived ID enforced by the server. Existing generated-asset libraries remain shared among installed tutorial users; this integration does not make those libraries private. Browser multiplayer uses the session cookie. Exported native Godot clients and the separate cloud editor cannot join protected WebSockets without forwarding an authenticated cookie; their standalone multiplayer flow remains available outside marketplace mode.

For standalone local use, leave `MARKETPLACE_AUTH_REQUIRED=false` and the session secret empty. Configuring a session secret enables authentication even if the flag is omitted. Incomplete marketplace configuration stops startup.
