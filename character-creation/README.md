# Character creation

This module teaches the student to move from their own creative idea to a playable 2D character:

1. Write a free-form character idea.
2. Answer the seven guide prompts: role/class, name, focus attributes, weapon, combat style, visual identity, and weakness. Focus attributes can be combined, such as strength + vitality or intelligence + magic.
3. For fast testing, choose a quick template such as Storm Warden, Moon Scout, or Ember Sage and click **Load template**.
4. Click **Build character + sprite**. The tutorial server sends the idea and answers to OpenRouter for the design and animation plan.
5. The tutorial server sends the design to the configured image-generation service and stores a transparent 4-column by 7-row PNG sprite sheet in the assets volume. The rows are idle, walk, run, attack, jump, hurt, and death.
6. Test the generated movement preview with `A`, `D`, the arrow keys, and `Space`.
7. Click **Save PNG** to store the rendered sprite sheet in the assets volume.
8. Save the character, design, sprite plan, and movement settings to DuckDB.

Set `OPENROUTER_API_KEY` and optionally `OPENROUTER_MODEL` in `../tutorial-web-app/.env` or Railway service variables, then start the tutorial server. OpenRouter supplies the design and animation specification; the server generates and stores the artwork separately.

## Image generation configuration

Set these variables before starting `tutorial-web-app`:

```sh
export OPENAI_API_KEY="your-api-key"
export OPENAI_IMAGE_MODEL="gpt-image-2.5-sunburst"
npm start
```

Text requests use OpenRouter. Image generation is a separate request to the configured OpenAI image service.
