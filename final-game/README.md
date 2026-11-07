# Final Game starter kit

`build_starter_kit.py` makes a Godot 4 project ZIP for the Web Editor. It selects every published media file under lesson module directories from `SPACES_PUBLIC_URLS.json`, excluding the `originals/` source-art folders. It also adds the example character animation coordinate JSON files. The kit is organized by module under `assets/` and contains an `asset_catalog.json` with source URLs and SHA-256 hashes.

The shared kit is built from lesson media. Learner-generated characters, bosses, and asset packs in the Final Game library are separate and are not included in this common ZIP.

Build and verify locally:

```sh
python3 final-game/build_starter_kit.py --download-missing
unzip -t final-game/dist/godot-forge-starter-v1.zip
```

The local archive is available through `GET /api/final-game/starter-kit` when the tutorial server runs. If no local archive is present, that endpoint redirects to the published ZIP in the existing `godot-forge` Space. To publish a new version, upload the versioned ZIP with a Spaces-enabled AWS CLI profile:

```sh
aws s3 cp final-game/dist/godot-forge-starter-v1.zip \
  s3://godot-forge/2d-game-development/final-game/starter/godot-forge-starter-v1.zip \
  --endpoint-url https://sgp1.digitaloceanspaces.com \
  --region us-east-1 \
  --profile digitalocean \
  --acl public-read \
  --content-type application/zip \
  --content-disposition 'attachment; filename="godot-forge-starter-v1.zip"'
```

The published ZIP is at `https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/final-game/starter/godot-forge-starter-v1.zip`. Set `GODOT_STARTER_KIT_URL` only to override this URL. The existing general media uploader does not select ZIP files.

The Final Game page supports either a locally installed Godot 4 editor or the Learn Godot Web Editor cloud workspace. For local use, download and extract the common ZIP, then import `project.godot` in Godot's Project Manager. The cloud workspace seeds each learner's persistent server project from the same ZIP automatically. The copies do not sync: download a changed cloud project ZIP to continue it locally, and back up local project folders separately.

The page's nine-section build guide is in `guide.js`. It takes learners from the welcome scene through assets, one level, player movement, items, enemies, UI, shop, achievements, leaderboard, ending, local co-op, and online play. `writing.js` turns the Godot 4 examples into short writing tasks with prompts, hints, partial outlines, checkpoints, and independent changes. The student's place is saved in browser local storage. Students create a minimal `Game.gd` autoload before writing `Player.gd`, then expand Game in the pickup section. The full scripts appear as collapsed references only after the matching writing and change tasks are completed; the primary flow has no full-file copy button. Section 3 includes `GamepadBindings.gd` for device-specific stick, D-pad, and button actions; Section 6 assigns the first pad to P1 in solo play or P2 in local co-op, with a second pad available for P1. The online guest sends those same actions to the host. The online example uses the two-peer relay at `/ws/final-game`, implemented in `tutorial-web-app/final-game-rooms.mjs`. The shared starter ZIP intentionally remains a blank project so learners build the scenes and scripts themselves.

`walkthrough.js` and `function-details.js` supply execution flow, symbol explanations, and statement-level function notes for every complete reference. Learners can click a name, select one identifier, or use the selector beside the code. The writing checklist is self-reported: students confirm each step after testing in Godot; the site does not inspect the cloud project automatically.

The cloud editor image sets `FM_HOME=/config/project`, so students can use the Kclient Files control to upload their own saved PNG and JSON files into the project. For cloud-to-cloud multiplayer, the relay must be deployed on a URL reachable by both Godot workspaces; `localhost` in the copied code only works when Godot and the tutorial app run on the same machine.

## Godot 4 sample build: corrections and troubleshooting

The reference scripts and lesson steps were exercised while assembling a local sample with Godot 4.7.2. The shared starter ZIP remains a starting project; it is not the finished sample. The following corrections are included in the guide:

- **`Identifier not found: Game`:** create `scripts/Game.gd` first and register it as an Autoload named `Game` in Project Settings → Globals before attaching scripts that reference it. If project settings were changed outside the open editor, reload the project so the editor picks up the autoload.
- **Credits fail to parse:** the JavaScript template must preserve the `\n` escapes in the GDScript string. Type each `\n` inside the quoted Godot string; do not insert a literal line break inside an ordinary quoted string.
- **Cannot infer the type of `local_coop`:** `p2` and `online` are dynamic scene references. Declare `var local_coop: bool = ...` instead of using `:=` for that expression.
- **Player 1 cannot move past the starting point:** a hidden, inactive Player2 is still a physics body. `Main.gd` adds collision exceptions in both directions so the two players do not block each other. Water ignores inactive heroes as well.
- **Spawned hearts look like coins:** assign the coin image to Pickup's `Sprite2D` and the heart image to its root `heart_texture` Inspector property. The example updates its texture when `kind` changes, including for timed spawns and network snapshots.
- **Enemy loot is missing before Section 6:** the drop container joins the `loot_container` group in `Main.gd`; test loot after connecting Main in Section 6. The Section 2 checkpoint does not depend on movement or gravity, which arrive in Section 3.
- **Local rooms fail to connect on some machines:** the local HTTP example uses `ws://127.0.0.1:3000/ws/final-game`, avoiding a case where `localhost` resolves to IPv6 but the local server listens on IPv4. Start the tutorial server first. For different computers or cloud workspaces, replace this with a reachable shared `ws://` or `wss://` relay URL; `127.0.0.1` always means the machine running Godot.
- **A disconnect causes a WebSocket send error:** receiving `peer_left` can close the socket during message processing. The example rechecks that the socket is open before sending another packet.

When testing locally, start the project in Godot and watch **Debugger → Errors**. A successful online test requires two running game instances and the tutorial server; gamepad checks also require a connected, supported controller. The walkthrough browser test checks reference-code coverage and the corrected examples with `npm run test:final-game-walkthrough` from `tutorial-web-app/`.

For a universal macOS export, Godot may report that ETC2/ASTC texture compression is disabled. Enable **Project Settings → Rendering → Textures → VRAM Compression → Import ETC2 ASTC**, let Godot reimport, and export again. Install the matching Godot version's macOS export template first. Ad-hoc signing is suitable for local testing; distributing to other Macs may require Apple Developer ID signing and notarization.

A Windows desktop export can be made from macOS using the matching Godot Windows export templates. Choose the 64-bit Windows preset and enable **Embed PCK** for a single `.exe`; disable executable resource modification if the host does not have the Windows resource-editing tools installed. A signing certificate is required for a signed Windows release. Test the executable on Windows before distribution.

## Controls, health, and starter artwork

The sample controls menu opens from the HUD or the pause action. It captures a keyboard key, gamepad button, or stick direction for P1, P2, and shared actions; it rejects conflicting bindings, saves them to `user://controls.cfg`, reapplies them after controller reassignment, and can restore defaults. The menu uses the normal Godot UI actions for navigation and reserves Escape to cancel capture. A physical controller is needed for a full hardware check.

For the sample's enemy contact, the old 38-pixel attack range was smaller than the separation imposed by the collision shapes; the guide now uses 65 pixels and asks students to adjust for their shapes. Health bars reflect both players, `hurt` and `death` animations are non-looping, and the game-over panel waits 0.9 seconds so death remains visible. The online example sends animation and game-over state to guests.

The starter remains a blank welcome project for learners to build, and now includes the forest portal, shop, and ground artwork plus optional `reference-code/*.gd.txt` examples. The local ZIP is rebuilt with `python3 final-game/build_starter_kit.py`. Artwork generation prompts and attribution are included in `starter-project/assets/final-game/README.md`. The existing published ZIP URL and separately deployed cloud editor are unchanged until their starter archive is updated; existing cloud projects also keep their current files.

The sample now includes three placed heart pickups that heal only injured living players, a shallow recessed pool with a jumpable exit and separate pool-bottom collision, and a boulder that settles below ground. The pool is separated from the shop. The spike and pool art use GPT Image 2.5 Sunburst; their prompts are recorded with the assets.

The original sample drew water above one continuous floor, leaving the boulder on the ground, and its pool overlapped the shop art. The level now splits the floor around the water, adds a shallow bottom with soil underneath, and spaces the shop farther away. Heart pickups previously disappeared at full health; they now stay in place until an injured living player collects them.

### Fullscreen on desktop

To make the exported game open full screen, set **Project → Project Settings → Display → Window → Size → Mode** to **Fullscreen**. Keep the 1280 × 720 viewport and `canvas_items` stretch mode to preserve the game’s proportions. Use Windowed while working in a cloud editor if fullscreen would cover the workspace, then restore Fullscreen before exporting.

### Menu, HUD, and exit

The sample launch and pause menus offer play/resume, multiplayer, controls and quit. Multiplayer starts a new run and needs a shared reachable relay; the local default reaches only a relay on the same computer. The compact HUD shows coins, score, health and the room status. The exit completes the level as soon as a living active player reaches it; coins and enemies are optional.

### Enemy hit feedback and export names

A hit flashes the enemy red, knocks it away from the attacker and displays the damage amount above it. Defeated enemies remain for the brief final flash, and the multiplayer guest receives the same feedback. The local sample exports are named `tsg-game-macos.app` and `tsg-game-windows.exe`.

The module starts with a seven-second GIF recorded from the example game. Its pause control switches to a still poster and respects reduced-motion preferences. The preview files are included with the site so they also load in the deployed app.
