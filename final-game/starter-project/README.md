# Godot Forge starter kit

This Godot 4 project includes the published file-based artwork from the tutorial modules. It is installed automatically when your Godot Forge cloud workspace is created. Run the project to see the welcome scene, then follow the Final Game module's nine-section guide to build one complete level with the media in `assets/`.

Assets are grouped by the module where they originated. `asset_catalog.json` lists every included file, its source URL, size, and SHA-256 hash. Coordinate JSON files for the example character sheets are in `assets/character-creation/data/` beside their PNG files.

The shared kit contains lesson media. Characters, bosses, and asset sheets that an individual learner generates during the course are stored separately in the Final Game asset library and must be added to that learner's project. Browser demos also draw some visuals directly in code; those drawings are not image files in this kit.

The cloud editor saves your project on the server while the workspace exists. Use the lesson page's project ZIP download for a backup before choosing **Stop and delete workspace**, which removes the workspace and its files.

The starter includes a repeating grass-and-soil ground texture plus transparent forest portal and shop art in `assets/final-game/`. For the ground, set a Sprite2D region wider than the texture, turn texture repeat on, and keep a separate solid collision shape. In Section 2, add each as a Sprite2D under the Exit or Shop Area2D, scale its base to the ground, and size the Area2D collision shape for player interaction.

Section 6 adds a Controls button and a ControlsMenu node for keyboard and gamepad remapping. The optional `reference-code/*.gd.txt` files contain the matching complete example scripts; follow the guide to create actual `.gd` scripts and scene nodes, or consult these text references while writing. Bindings are saved in `user://controls.cfg` on the device running the game. Escape cancels input capture; Close / Resume exits the menu. The default controls and player assignment are described in the guide.

For combat, make the enemy attack range larger than the combined player/enemy collision half-widths; the example uses 65 pixels. Section 6 adds health bars, and the player SpriteFrames should include non-looping `hurt` and `death` animations when available. Main waits briefly before displaying game over so the death animation is visible. The online reference includes animation and game-over synchronization; its loopback relay address is only for a server running on the same computer.

Default P1 controls are A/D to move, W to jump, S to crouch, E to roll, Space to attack, and F to interact. P2 uses Left/Right, Up to jump, Down to crouch, Control to roll, Shift to attack, and Return to interact. Use a RectangleShape2D on Player so the example can resize each player's own collision shape for crouching, and add a `crouch` SpriteFrames animation if you have one.

Press jump twice before landing to double jump. The Player.gd example exposes `max_jumps` in the Inspector (default 2); landing resets the count.
