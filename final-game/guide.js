// These are teaching examples. The shared starter ZIP stays a blank project so
// students create every scene and script themselves in the Godot editor.
window.finalGameGuide = [
  {
    id: 'plan', title: '1. Plan one playable journey', modules: '4 Storyline · 8 Game loop',
    summary: 'Make a forest rescue level. The hero collects 20 coins, crosses a hazard, visits a healing shop, defeats two enemy types and a boss, then chooses what to do with the relic.',
    steps: [
      'In the FileSystem panel, create folders scenes, scripts, and assets/my-game. Put your own hero, boss, tiles, props, pickups, and UI PNGs in assets/my-game. The lesson art under assets/ is a reference library.',
      'Rename the welcome scene to Main.tscn or create a new 2D scene named Main. Set it as the main scene with Project → Project Settings → Application → Run.',
      'Sketch a left-to-right level: safe start → coins and hazard → shop → two enemy encounters → boss arena → exit. Keep one map for every play mode.'
    ],
    check: 'Press F6 on Main. The welcome text is gone; the new scene opens. The Debugger shows no script errors.'
  },
  {
    id:'world', title:'2. Assemble art, parallax, and collision', modules:'1 Character · 2 Assets · 3 Boss art · 5 Parallax and tiles · 11 Physics',
    summary:'Build the whole level before coding encounters. Use the art you created in earlier modules, with the starter library where it helps.',
    steps:[
      'In Main, add Backdrop (Parallax2D with Sprite2D children), Terrain (TileMapLayer), Pickups and BonusPickups (Node2D), SpawnPoints (Node2D with Marker2D children), Spawner (Node with Timer), Water (Area2D), Boulder (RigidBody2D), Enemies (Node2D), Boss (an Enemy scene instance), Player1 and Player2 (Player scene instances), Shop and Exit (Area2D), and UI (CanvasLayer).',
      'For Terrain, create a TileSet from your tile sheet. Paint platforms and the floor, then add collision polygons to solid tiles in the TileSet editor. Put Backdrop behind Terrain and set its repeat size/motion scale for depth.',
      'For the included forest floor, add a Sprite2D under Terrain and assign assets/final-game/forest-ground.png. Turn Centered off, enable Region, make the region wider than the texture, and set Texture → Repeat to Enabled so the grass and soil repeat horizontally. Scale it and line up the grass with the floor. Keep the TileSet collision or add a separate StaticBody2D with a CollisionShape2D; the image alone is not solid.',
      'Create scenes/Player.tscn: CharacterBody2D → AnimatedSprite2D, CollisionShape2D, Camera2D. Slice your hero sheet in SpriteFrames; name idle, run, jump, crouch, attack, roll, hurt, and death if your sheet has those frames. Turn Loop off for hurt and death. Make Camera2D current only on Player1.',
      'Create scenes/Enemy.tscn: CharacterBody2D → AnimatedSprite2D, CollisionShape2D. Duplicate instances for two normal enemy types and the boss; assign their own SpriteFrames and collision shapes.',
      'Create scenes/Pickup.tscn: Area2D → Sprite2D, CollisionShape2D. Duplicate it 20 times for coins, then add a few hearts. Create a separate Area2D with CollisionShape2D for each hazard, the Shop, and Exit. Add a Sprite2D to Shop and assign assets/final-game/forest-shop.png; add a Sprite2D to Exit and assign assets/final-game/forest-portal.png. Scale and position each sprite so its base touches the ground; keep the Area2D collision shapes around the player interaction zones.',
      'Use assets/final-game/forest-pool-cutaway.png for a side-on pool and the Module 11 boulder and splash art. Split the floor and repeating ground image around the pool, put a solid pool-bottom collision shape below the surface, and fill the soil below it. Place Water and Boulder away from Shop; drop the boulder above the water so it splashes and settles below ground level. Make the pool shallow enough to jump out.',
      'Place Player1 at the safe start, Player2 beside them, Shop before the boss, Exit after the boss. Set the boss instance Inspector property boss to On after attaching Enemy.gd in Section 5.'
    ],
    tree:`Main (Node2D) [Main.gd]
├─ Backdrop (Parallax2D)
├─ Terrain (TileMapLayer)
├─ Pickups (Node2D) → 20+ Pickup.tscn instances
├─ BonusPickups (Node2D) → timed spawns and enemy drops
├─ SpawnPoints (Node2D) → safe Marker2D positions
├─ Spawner (Node) [Spawner.gd] → Timer
├─ Hazards (Node2D) → Hazard.tscn instances
├─ Water (Area2D) [Water.gd] → Sprite2D, CollisionShape2D
├─ Boulder (RigidBody2D) → Sprite2D, CollisionShape2D
├─ Enemies (Node2D) → Enemy.tscn instances
├─ Boss (Enemy.tscn instance; boss = On)
├─ Player1 (Player.tscn; slot = 1)
├─ Player2 (Player.tscn; slot = 2)
├─ Shop (Area2D) → CollisionShape2D
├─ Exit (Area2D) → CollisionShape2D
├─ Online (Node) [Online.gd]
└─ UI (CanvasLayer) → HUD (Control), Finale (Control), ControlsMenu (Control)`,
    check:'Press F6. The level, hero, tiles, shop, boss, and exit are visible. Put the hero just above the floor; movement and gravity are added in Section 3.'
  },
  {
    id:'player', title:'3. Add controls and player movement', modules:'1 Character · 9 Controls · 10 Settings · 11 Physics',
    summary:'Map keyboard actions, then let GDScript assign connected gamepads to the right player. Both input methods use the same player script.',
    steps:[
      'Open Project → Project Settings → Input Map. Add p1_left, p1_right, p1_jump, p1_crouch, p1_roll, p1_attack, p1_interact, the same seven p2_ actions, plus toggle_coop, pause, and restart.',
      'Bind P1 to A/D for movement, W for jump, S for crouch, E for roll, Space for attack, and F for interaction. Bind P2 to Left/Right, Up for jump, Down for crouch, Control for roll, Shift for attack, and Return for interaction. Bind toggle_coop to C, pause to Escape, and restart to R. Keep these keyboard events; GamepadBindings.gd adds controller events at run time.',
      'Build scripts/Player.gd and scripts/GamepadBindings.gd one task at a time below. Attach Player.gd to Player.tscn. In Main set Player1 slot=1 and Player2 slot=2. Use a RectangleShape2D for CollisionShape2D and adjust it to the hero silhouette; keep the feet near the bottom. The script duplicates each player’s rectangle, reduces its height when crouching, and prevents standing under a low ceiling. Configure hurt and death SpriteFrames so damage and defeat play visibly; the example still works if your art does not include them. Set max_jumps to 2 for a double jump; it resets when the hero lands.',
      'Once Main.gd is attached in Section 6, the first connected pad controls P1 in solo play. In local co-op, it controls P2 while P1 uses the keyboard or a second pad. The script maps left stick/D-pad to move, stick down or D-pad down to crouch, A jump, B roll, X attack, Y interact, Back to join P2, Start to pause, and right shoulder to restart.',
      'The cloud editor runs on a remote Linux desktop. Test a physical pad only if that desktop forwards it to Godot; if Input.get_connected_joypads() is empty, run a downloaded project locally for the controller check. For online play later, the host uses remote_axis, remote_jump, remote_crouch, remote_roll, and remote_attack for Player2.'
    ],
    files:[{name:'scripts/GamepadBindings.gd',code:`extends RefCounted

static var overrides: Dictionary = {}

static func set_overrides(mapping: Dictionary) -> void:
    overrides = mapping.duplicate(true)

static func bind_player(slot: int, device: int) -> void:
    var prefix := "p1_" if slot == 1 else "p2_"
    for suffix in ["left", "right", "jump", "roll", "crouch", "attack", "interact"]:
        _clear_pad_events(prefix + suffix)
    if device < 0:
        return
    _axis(prefix + "left", device, -1.0)
    _axis(prefix + "right", device, 1.0)
    _button(prefix + "left", device, JOY_BUTTON_DPAD_LEFT)
    _button(prefix + "right", device, JOY_BUTTON_DPAD_RIGHT)
    _axis(prefix + "crouch", device, 1.0, JOY_AXIS_LEFT_Y)
    _button(prefix + "crouch", device, JOY_BUTTON_DPAD_DOWN)
    _button(prefix + "jump", device, JOY_BUTTON_A)
    _button(prefix + "roll", device, JOY_BUTTON_B)
    _button(prefix + "attack", device, JOY_BUTTON_X)
    _button(prefix + "interact", device, JOY_BUTTON_Y)
    for suffix in ["left", "right", "jump", "roll", "crouch", "attack", "interact"]:
        _apply_override(prefix + suffix, device)

static func bind_system(device: int) -> void:
    for action in ["toggle_coop", "pause", "restart"]:
        _clear_pad_events(action)
    if device < 0:
        return
    _button("toggle_coop", device, JOY_BUTTON_BACK)
    _button("pause", device, JOY_BUTTON_START)
    _button("restart", device, JOY_BUTTON_RIGHT_SHOULDER)
    for action in ["toggle_coop", "pause", "restart"]:
        _apply_override(action, device)

static func _clear_pad_events(action: String) -> void:
    if not InputMap.has_action(action):
        InputMap.add_action(action, 0.25)
    for event in InputMap.action_get_events(action):
        if event is InputEventJoypadButton or event is InputEventJoypadMotion:
            InputMap.action_erase_event(action, event)

static func _axis(action: String, device: int, direction: float, axis: int = JOY_AXIS_LEFT_X) -> void:
    if overrides.has(action):
        return
    var event := InputEventJoypadMotion.new()
    event.device = device
    event.axis = axis
    event.axis_value = direction
    InputMap.action_set_deadzone(action, 0.25)
    InputMap.action_add_event(action, event)

static func _button(action: String, device: int, button: int) -> void:
    if overrides.has(action):
        return
    var event := InputEventJoypadButton.new()
    event.device = device
    event.button_index = button
    InputMap.action_add_event(action, event)


static func _apply_override(action: String, device: int) -> void:
    if not overrides.has(action):
        return
    var binding: Dictionary = overrides[action]
    var event: InputEvent
    if binding.get("type") == "axis":
        event = InputEventJoypadMotion.new()
        event.axis = int(binding.get("axis", 0))
        event.axis_value = float(binding.get("direction", 1.0))
        InputMap.action_set_deadzone(action, 0.25)
    elif binding.get("type") == "button":
        event = InputEventJoypadButton.new()
        event.button_index = int(binding.get("button", 0))
    else:
        return
    event.device = device
    InputMap.action_add_event(action, event)

static func specs_for(action: String) -> Array:
    if overrides.has(action):
        return [overrides[action]]
    var name = action.trim_prefix("p1_").trim_prefix("p2_")
    match name:
        "left": return [{"type":"axis", "axis":JOY_AXIS_LEFT_X, "direction":-1.0}, {"type":"button", "button":JOY_BUTTON_DPAD_LEFT}]
        "right": return [{"type":"axis", "axis":JOY_AXIS_LEFT_X, "direction":1.0}, {"type":"button", "button":JOY_BUTTON_DPAD_RIGHT}]
        "crouch": return [{"type":"axis", "axis":JOY_AXIS_LEFT_Y, "direction":1.0}, {"type":"button", "button":JOY_BUTTON_DPAD_DOWN}]
        "jump": return [{"type":"button", "button":JOY_BUTTON_A}]
        "roll": return [{"type":"button", "button":JOY_BUTTON_B}]
        "attack": return [{"type":"button", "button":JOY_BUTTON_X}]
        "interact": return [{"type":"button", "button":JOY_BUTTON_Y}]
        "toggle_coop": return [{"type":"button", "button":JOY_BUTTON_BACK}]
        "pause": return [{"type":"button", "button":JOY_BUTTON_START}]
        "restart": return [{"type":"button", "button":JOY_BUTTON_RIGHT_SHOULDER}]
    return []

static func describe(action: String) -> String:
    var button_names = {
        JOY_BUTTON_A:"A / Cross", JOY_BUTTON_B:"B / Circle",
        JOY_BUTTON_X:"X / Square", JOY_BUTTON_Y:"Y / Triangle",
        JOY_BUTTON_BACK:"Back / Select", JOY_BUTTON_START:"Start / Options",
        JOY_BUTTON_LEFT_SHOULDER:"Left shoulder", JOY_BUTTON_RIGHT_SHOULDER:"Right shoulder",
        JOY_BUTTON_DPAD_LEFT:"D-pad left", JOY_BUTTON_DPAD_RIGHT:"D-pad right",
        JOY_BUTTON_DPAD_UP:"D-pad up", JOY_BUTTON_DPAD_DOWN:"D-pad down"
    }
    var labels: Array[String] = []
    for binding in specs_for(action):
        if binding["type"] == "axis":
            var axis_name = "Left stick X" if binding["axis"] == JOY_AXIS_LEFT_X else ("Left stick Y" if binding["axis"] == JOY_AXIS_LEFT_Y else "Axis %d" % binding["axis"])
            labels.append("%s %s" % [axis_name, "+" if binding["direction"] > 0 else "−"])
        else:
            labels.append(button_names.get(binding["button"], "Button %d" % binding["button"]))
    return " / ".join(labels) if not labels.is_empty() else "Unassigned"`},
    {name:'scripts/Player.gd',code:`extends CharacterBody2D

@export var slot := 1
@export var speed := 220.0
@export var jump_speed := -430.0
@export_range(1, 4) var max_jumps := 2
var active := true
var remote_controlled := false
var remote_axis := 0.0
var remote_jump := false
var jumps_used := 0
var remote_roll := false
var remote_crouch := false
var remote_attack := false
var health := 3
var facing := 1
var attack_wait := 0.0
var roll_time := 0.0
var roll_cooldown := 0.0
var hurt_wait := 0.0
var hurt_animation_time := 0.0
var crouching := false
var standing_shape_size := Vector2.ZERO
var standing_shape_position := Vector2.ZERO
var standing_sprite_scale := Vector2.ONE
var standing_sprite_position := Vector2.ZERO
@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var hitbox: CollisionShape2D = $CollisionShape2D

func _ready() -> void:
    add_to_group("heroes")
    standing_sprite_scale = sprite.scale
    standing_sprite_position = sprite.position
    if hitbox.shape is RectangleShape2D:
        hitbox.shape = hitbox.shape.duplicate()
        standing_shape_size = hitbox.shape.size
        standing_shape_position = hitbox.position

func _physics_process(delta: float) -> void:
    if not active or health <= 0:
        return
    attack_wait = maxf(0.0, attack_wait - delta)
    roll_time = maxf(0.0, roll_time - delta)
    roll_cooldown = maxf(0.0, roll_cooldown - delta)
    hurt_wait = maxf(0.0, hurt_wait - delta)
    hurt_animation_time = maxf(0.0, hurt_animation_time - delta)
    var prefix = "p1_" if slot == 1 else "p2_"
    var axis = remote_axis if remote_controlled else Input.get_axis(prefix + "left", prefix + "right")
    var jump_now = remote_jump if remote_controlled else Input.is_action_just_pressed(prefix + "jump")
    var roll_now = remote_roll if remote_controlled else Input.is_action_just_pressed(prefix + "roll")
    var attack_now = remote_attack if remote_controlled else Input.is_action_just_pressed(prefix + "attack")
    var crouch_now = remote_crouch if remote_controlled else Input.is_action_pressed(prefix + "crouch")
    _set_crouching(crouch_now and is_on_floor() and roll_time <= 0.0)
    remote_jump = false
    remote_roll = false
    remote_attack = false
    velocity.y += 1100.0 * delta if not is_on_floor() else 0.0
    if axis != 0.0 and roll_time <= 0.0:
        facing = 1 if axis > 0.0 else -1
    if roll_now and not crouching and roll_cooldown <= 0.0 and is_on_floor():
        roll_time = 0.28
        roll_cooldown = 0.7
    velocity.x = facing * speed * 1.65 if roll_time > 0.0 else (0.0 if crouching else axis * speed)
    if is_on_floor():
        jumps_used = 0
    elif jumps_used == 0:
        # Walking off an edge uses the grounded jump; one air jump remains.
        jumps_used = 1
    if jump_now and not crouching and jumps_used < max_jumps:
        velocity.y = jump_speed
        jumps_used += 1
    sprite.flip_h = facing < 0
    if attack_now and attack_wait <= 0.0:
        attack_wait = 0.4
        for target in get_tree().get_nodes_in_group("damageable"):
            var gap = target.global_position - global_position
            if absf(gap.x) < 75.0 and absf(gap.y) < 55.0 and gap.x * facing > -10.0:
                target.hit(1 + Game.attack_bonus)
    move_and_slide()
    var animation = "jump" if not is_on_floor() else ("run" if absf(axis) > 0.1 else "idle")
    if crouching and sprite.sprite_frames and sprite.sprite_frames.has_animation("crouch"):
        animation = "crouch"
    if roll_time > 0.0:
        animation = "roll" if sprite.sprite_frames and sprite.sprite_frames.has_animation("roll") else "run"
    if attack_wait > 0.25:
        animation = "attack"
    if hurt_animation_time > 0.0 and sprite.sprite_frames and sprite.sprite_frames.has_animation("hurt"):
        animation = "hurt"
    if sprite.sprite_frames and sprite.sprite_frames.has_animation(animation):
        sprite.play(animation)

func _set_crouching(requested: bool) -> void:
    if requested == crouching:
        return
    var height_change = standing_shape_size.y * 0.4
    if not requested and crouching and height_change > 0.0 and test_move(global_transform, Vector2(0, -height_change)):
        return
    crouching = requested
    if hitbox.shape is RectangleShape2D and standing_shape_size.y > 0.0:
        hitbox.shape.size = Vector2(standing_shape_size.x, standing_shape_size.y * (0.6 if crouching else 1.0))
        hitbox.position = standing_shape_position + Vector2(0, height_change / 2.0 if crouching else 0.0)
    _apply_crouch_visual(crouching)

func _apply_crouch_visual(value: bool) -> void:
    var has_crouch = sprite.sprite_frames and sprite.sprite_frames.has_animation("crouch")
    var factor = 0.6 if value and not has_crouch else 1.0
    sprite.scale = Vector2(standing_sprite_scale.x, standing_sprite_scale.y * factor)
    var frame_height = 256.0
    if sprite.sprite_frames and sprite.sprite_frames.has_animation("idle") and sprite.sprite_frames.get_frame_count("idle") > 0:
        frame_height = sprite.sprite_frames.get_frame_texture("idle", 0).get_height()
    sprite.position = standing_sprite_position + Vector2(0, frame_height * standing_sprite_scale.y * (1.0 - factor) / 2.0)

func hurt() -> void:
    if hurt_wait > 0.0 or health <= 0:
        return
    health -= 1
    hurt_wait = 1.0
    if health <= 0:
        _apply_crouch_visual(false)
        velocity.x = 0.0
        if sprite.sprite_frames and sprite.sprite_frames.has_animation("death"):
            sprite.play("death")
    else:
        hurt_animation_time = 0.5
        if sprite.sprite_frames and sprite.sprite_frames.has_animation("hurt"):
            sprite.play("hurt")

func heal() -> void:
    health = mini(3, health + 1)`}],
    check:'P1 moves with A/D, jumps with W, crouches with S, rolls with E, and attacks with Space. Press jump a second time in the air for a double jump; a third press does nothing until landing. Verify the crouching collision shape fits beneath a low ceiling and cannot stand while the ceiling is overhead. In Section 6, test the first connected pad with both stick and D-pad; C or Back will then activate P2.'
  },
  {
    id:'pickups',title:'4. Collect coins and survive hazards',modules:'6 Item spawning · 8 Game loop · 11 Physics',
    summary:'Coins fund the shop and count toward the exit. A timer creates bonus pickups at safe markers, and defeated enemies drop loot.',
    steps:[
      'Create scripts/Game.gd as an Autoload named Game in Project → Project Settings → Globals. Build it in small steps below before writing Pickup.gd.',
      'Attach Pickup.gd to Pickup.tscn. Set the Pickup Sprite2D texture to a coin and assign heart_texture in the Pickup root Inspector, then save the reusable scene. Set kind=coin on 20 instances and kind=heart on at least three health pickups spread across the level. A heart restores one health only when a living player is injured, and remains available at full health. Give every instance a unique node name; keep all instances under Main/Pickups.',
      'Create Hazard.tscn as Area2D → CollisionShape2D, add a Sprite2D using assets/final-game/forest-spikes.png, and attach Hazard.gd. Align the spike base with the floor and fit the collision shape to the visible points. Place hazards where players can jump over or around them.',
      'Add five Marker2D children under SpawnPoints, placed on safe platforms. Attach Spawner.gd to Spawner, assign scenes/Pickup.tscn to pickup_scene in the Inspector, and set its Timer wait time to 12 seconds with Autostart on. BonusPickups holds these timed items and enemy loot.',
      'Create scenes/Splash.tscn as Node2D → Sprite2D with the splash image, and attach Splash.gd. Attach Water.gd to Water and assign scenes/Splash.tscn to splash_scene. Add Boulder to the boulders group in the Node → Groups tab. Use a RigidBody2D so Godot gravity drops it into the pool.',
      'In each Area2D Inspector, enable Monitoring and set its collision mask so it detects Player bodies; Water must also detect Boulder. Use Debug → Visible Collision Shapes if an overlap does not register.'
    ],
    files:[
      {name:'scripts/Game.gd', code:`extends Node

var coins := 0
var collected := 0
var score := 0
var boss_defeated := false
var ending := ""
var inventory: Array[String] = []
var materials := 0
var attack_bonus := 0
var spawn_index := 0
var achievements: Dictionary = {}
var records: Array = []

func _ready() -> void:
    if FileAccess.file_exists("user://final_save.json"):
        var data = JSON.parse_string(FileAccess.get_file_as_string("user://final_save.json"))
        if data is Dictionary:
            achievements = data.get("achievements", {})
            records = data.get("records", [])

func start_run() -> void:
    coins = 0
    collected = 0
    score = 0
    boss_defeated = false
    ending = ""
    inventory.clear()
    materials = 0
    attack_bonus = 0
    spawn_index = 0

func next_pickup_name() -> String:
    spawn_index += 1
    return "Bonus_%d" % spawn_index

func collect_coin() -> void:
    coins += 1
    collected += 1
    score += 10
    if collected >= 20:
        unlock("coin_collector")

func buy_heal(player) -> bool:
    if coins < 5 or player.health >= 3:
        return false
    coins -= 5
    player.heal()
    unlock("first_purchase")
    return true

func buy_gear() -> bool:
    if coins < 8 or inventory.has("Forest Blade"):
        return false
    coins -= 8
    inventory.append("Forest Blade")
    attack_bonus = 1
    unlock("first_purchase")
    return true

func sell_gear() -> bool:
    if not inventory.has("Forest Blade"):
        return false
    inventory.erase("Forest Blade")
    coins += 4
    attack_bonus = 0
    return true

func salvage_gear() -> bool:
    if coins < 2 or not inventory.has("Forest Blade"):
        return false
    coins -= 2
    inventory.erase("Forest Blade")
    materials += 1
    attack_bonus = 0
    unlock("first_salvage")
    return true

func defeat_enemy(is_boss: bool) -> void:
    score += 100 if is_boss else 20
    if is_boss:
        boss_defeated = true
        unlock("boss_breaker")

func unlock(id: String) -> void:
    if achievements.has(id):
        return
    achievements[id] = true
    save_progress()

func finish(choice: String) -> void:
    ending = choice
    score += 50
    unlock("finished_game")
    records.append({"score": score, "ending": choice})
    records.sort_custom(func(a, b): return a["score"] > b["score"])
    records = records.slice(0, 5)
    save_progress()

func save_progress() -> void:
    var file = FileAccess.open("user://final_save.json", FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify({"achievements": achievements, "records": records}))` },
      {name:'scripts/Pickup.gd',code:`extends Area2D

@export var kind := "coin":
    set(value):
        kind = value
        if is_node_ready():
            _update_texture()
@export var heart_texture: Texture2D
@onready var coin_texture: Texture2D = $Sprite2D.texture

func _ready() -> void:
    _update_texture()
    body_entered.connect(_on_body_entered)

func _update_texture() -> void:
    $Sprite2D.texture = heart_texture if kind == "heart" and heart_texture else coin_texture

func _on_body_entered(body) -> void:
    if not body.is_in_group("heroes") or not body.active:
        return
    if kind == "coin":
        Game.collect_coin()
    elif kind == "heart":
        if body.health <= 0 or body.health >= 3:
            return
        Game.unlock("heart_restored")
        body.heal()
    queue_free()`},
      {name:'scripts/Hazard.gd',code:`extends Area2D

func _ready() -> void:
    body_entered.connect(_on_body_entered)

func _on_body_entered(body) -> void:
    if body.is_in_group("heroes") and body.active:
        body.hurt()`},
      {name:'scripts/Spawner.gd',code:`extends Node

@export var pickup_scene: PackedScene
@onready var timer: Timer = $Timer
@onready var markers = $"../SpawnPoints".get_children()
@onready var bonus = $"../BonusPickups"

func _ready() -> void:
    timer.timeout.connect(_spawn)

func _spawn() -> void:
    if pickup_scene == null or markers.is_empty() or bonus.get_child_count() >= 5:
        return
    var marker = markers.pick_random()
    var item = pickup_scene.instantiate()
    item.name = Game.next_pickup_name()
    item.kind = "heart" if randi_range(0, 3) == 0 else "coin"
    bonus.add_child(item)
    item.global_position = marker.global_position`},
      {name:'scripts/Water.gd',code:`extends Area2D

@export var splash_scene: PackedScene
var splashed := false

func _ready() -> void:
    body_entered.connect(_on_body_entered)

func _on_body_entered(body) -> void:
    if body.is_in_group("heroes") and body.active:
        body.hurt()
    elif body.is_in_group("boulders") and not splashed:
        splashed = true
        body.linear_damp = 8.0
        if splash_scene:
            var splash = splash_scene.instantiate()
            get_tree().current_scene.add_child(splash)
            splash.global_position = body.global_position`},
      {name:'scripts/Splash.gd',code:`extends Node2D

func _ready() -> void:
    scale = Vector2(0.5, 0.5)
    modulate.a = 0.0
    var fade = create_tween()
    fade.tween_property(self, "modulate:a", 1.0, 0.15)
    fade.tween_property(self, "modulate:a", 0.0, 0.6)
    fade.tween_callback(queue_free)
    create_tween().tween_property(self, "scale", Vector2.ONE, 0.4)`}
    ],
    check:'A coin disappears on pickup; the Timer creates bonus items; a heart heals an injured player and stays in place at full health; spikes hurt. The boulder falls into the recessed pool and splashes, and the player can jump back out.'
  },
  {
    id:'combat',title:'5. Build enemy AI and a boss phase',modules:'3 Boss · 7 Enemies and AI · 8 Game loop',
    summary:'Reuse one enemy script for two ordinary types and the boss. The boss changes speed below half health and unlocks the exit when defeated.',
    steps:[
      'Attach Enemy.gd to Enemy.tscn. Set patrol_left and patrol_right for each instance in the Inspector; these are offsets from its starting point. Use different sprite frames and speeds for the two normal types.',
      'Set boss=On and health_points=8 on the Boss instance. Add an arena floor that keeps the fight readable. Adjust attack_range so the boss can reach a player without instantly overlapping them. Assign scenes/Pickup.tscn to loot_scene on each regular enemy.',
      'The player attack calls hit() on nearby nodes in the damageable group. Enemies add themselves to that group automatically. Keep their collision masks aligned with Terrain and Player.'
    ],
    files:[{name:'scripts/Enemy.gd',code:`extends CharacterBody2D

@export var boss := false
@export var health_points := 2
@export var speed := 65.0
@export var patrol_left := -90.0
@export var patrol_right := 90.0
@export var attack_range := 65.0
@export var loot_scene: PackedScene
var origin_x := 0.0
var direction := 1.0
var attack_wait := 0.0
@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D

func _ready() -> void:
    add_to_group("damageable")
    origin_x = global_position.x

func _physics_process(delta: float) -> void:
    attack_wait = maxf(0.0, attack_wait - delta)
    velocity.y += 1100.0 * delta if not is_on_floor() else 0.0
    var target = null
    var closest := 320.0 if boss else 190.0
    for hero in get_tree().get_nodes_in_group("heroes"):
        if not hero.active or hero.health <= 0:
            continue
        var distance = global_position.distance_to(hero.global_position)
        if distance < closest:
            closest = distance
            target = hero
    if target:
        direction = 1.0 if target.global_position.x > global_position.x else -1.0
    elif global_position.x < origin_x + patrol_left:
        direction = 1.0
    elif global_position.x > origin_x + patrol_right:
        direction = -1.0
    var phase_speed = speed * (1.5 if boss and health_points <= 4 else 1.0)
    velocity.x = direction * phase_speed
    move_and_slide()
    sprite.flip_h = direction < 0.0
    if sprite.sprite_frames and sprite.sprite_frames.has_animation("run"):
        sprite.play("run")
    if target and closest < attack_range and attack_wait <= 0.0:
        target.hurt()
        attack_wait = 1.0 if boss else 1.4

func hit(amount: int = 1) -> void:
    health_points -= amount
    if health_points <= 0:
        if not boss and loot_scene:
            var container = get_tree().get_first_node_in_group("loot_container")
            if container:
                for i in range(randi_range(1, 3)):
                    var loot = loot_scene.instantiate()
                    loot.name = Game.next_pickup_name()
                    loot.kind = "coin"
                    container.add_child(loot)
                    loot.global_position = global_position + Vector2(randf_range(-24, 24), -20)
        Game.defeat_enemy(boss)
        queue_free()`}],
    check:'Each enemy patrols, chases, and deals damage when it reaches a player. Set attack_range larger than the combined collision half-widths: the default is 65 pixels, but adjust it to fit your shapes. Confirm the hurt animation and health bar change. The boss speeds up after four hits and sets Game.boss_defeated to true. Enemy loot appears after Main joins BonusPickups to the loot_container group in Section 6.'
  },
  {
    id:'interface',title:'6. Connect the HUD, shop, settings, and local co-op',modules:'8 Game loop · 10 Settings · 14 Marketplace · 15 Achievements · 16 Leaderboard · 17 Local co-op',
    summary:'One Main script joins the reusable scenes. A second player can join the same level, and shared rewards persist between runs.',
    steps:[
      'Under UI add HUD (Control) with Stats, Hint, Story, Achievements, Leaderboard, Player1HealthLabel, Player2HealthLabel (Labels), Player1Health and Player2Health (ProgressBars), and Volume (HSlider). Set both health bars Min to 0, Max to 3, Value to 3 and hide Percentage. Main updates them from each player’s health. Add ShopPanel (Control) with BuyButton, SellButton, SalvageButton. Add ControlsButton, HostButton, JoinButton (Buttons) and RoomCode (LineEdit) for Section 8.',
      'Under UI add a Control named ControlsMenu and attach scripts/ControlsMenu.gd below. The script builds the rows and buttons when the game starts; keep the root hidden in the editor. Each row can remap one keyboard key or gamepad button/axis for P1, P2, or a shared action.',
      'Under UI add Finale (Control). Add these children in this drawing order: Backdrop (ColorRect), Background (Panel), VictoryArt (TextureRect), DefeatIcon, Eyebrow, VictoryTitle, Result, Score, Credits (Labels), then KeepButton, ReturnButton and RestartButton (Buttons). Assign assets/final-game/victory-crest.png to VictoryArt, set Expand Mode to Ignore Size and Stretch Mode to Keep Aspect Centered. Hide Finale by default. Main.gd sizes and styles the full-screen overlay, centers the result card, and sets UI to Always so Escape can resume a paused run.',
      'Attach Main.gd below to Main. Also attach the small Online.gd placeholder to Online; replace that file with the full version in Section 8. Shop and Exit each need a CollisionShape2D and Monitoring on. Enter Shop: F or gamepad Y buys a heart for five coins; the panel buys a Forest Blade for eight coins, sells it for four, or salvages it for one material at a two-coin fee.',
      'Press C or gamepad Back to activate Player2. The first pad switches to P2; P1 keeps the keyboard or uses a second pad. Both share coins and score, but each has three hearts. The player collision exceptions in Main.gd let P1 pass through the hidden P2 and keep both players from blocking each other.',
      'Drag the Volume slider while the game runs. The Controls button or pause action opens the paused controls menu; choose a binding, then press a key, controller button, or move a stick. Escape cancels capture; use Close / Resume or UI Cancel to return. Restore defaults resets bindings. Controls save to user://controls.cfg; records and achievements use user://final_save.json.'
    ],
    files:[{name:'scripts/ControlsMenu.gd',code:`extends Control

const GamepadBindings = preload("res://scripts/GamepadBindings.gd")
const SAVE_PATH := "user://controls.cfg"
const ACTIONS := {
    "P1 • Move left":"p1_left", "P1 • Move right":"p1_right",
    "P1 • Jump":"p1_jump", "P1 • Crouch":"p1_crouch", "P1 • Roll":"p1_roll",
    "P1 • Attack":"p1_attack", "P1 • Interact":"p1_interact",
    "P2 • Move left":"p2_left", "P2 • Move right":"p2_right",
    "P2 • Jump":"p2_jump", "P2 • Crouch":"p2_crouch", "P2 • Roll":"p2_roll",
    "P2 • Attack":"p2_attack", "P2 • Interact":"p2_interact",
    "Join player 2":"toggle_coop", "Pause / controls":"pause", "Restart":"restart"
}

var default_keys: Dictionary = {}
var pad_overrides: Dictionary = {}
var key_buttons: Dictionary = {}
var pad_buttons: Dictionary = {}
var awaiting_action := ""
var awaiting_kind := ""
var was_paused := false
var status: Label
var close_button: Button
@onready var level = get_parent().get_parent()

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    _build_menu()
    for action in ACTIONS.values():
        var setting = ProjectSettings.get_setting("input/" + action, {})
        for event in setting.get("events", []):
            if event is InputEventKey:
                default_keys[action] = _key_spec(event)
                break
    _load_settings()
    hide()

func _build_menu() -> void:
    var dim = ColorRect.new()
    dim.color = Color(0.02, 0.07, 0.05, 0.92)
    dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    add_child(dim)
    var panel = PanelContainer.new()
    panel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    panel.offset_left = 145
    panel.offset_right = -145
    panel.offset_top = 28
    panel.offset_bottom = -28
    add_child(panel)
    var margin = MarginContainer.new()
    for side in ["margin_left", "margin_right", "margin_top", "margin_bottom"]:
        margin.add_theme_constant_override(side, 18)
    panel.add_child(margin)
    var column = VBoxContainer.new()
    column.add_theme_constant_override("separation", 8)
    margin.add_child(column)
    var title = Label.new()
    title.text = "CONTROLS & GAMEPAD"
    title.add_theme_font_size_override("font_size", 26)
    column.add_child(title)
    var help = Label.new()
    help.text = "Select a binding, then press a key or gamepad button / stick. Esc cancels."
    help.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    column.add_child(help)
    status = Label.new()
    status.text = "Changes save on this device. Pause opens this menu."
    status.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    column.add_child(status)
    var heading = HBoxContainer.new()
    column.add_child(heading)
    for heading_text in ["ACTION", "KEYBOARD", "GAMEPAD"]:
        var header = Label.new()
        header.text = heading_text
        if heading_text == "ACTION":
            header.size_flags_horizontal = Control.SIZE_EXPAND_FILL
        else:
            header.custom_minimum_size.x = 230
            header.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
        heading.add_child(header)
    var scroll = ScrollContainer.new()
    scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
    scroll.follow_focus = true
    column.add_child(scroll)
    var rows = VBoxContainer.new()
    rows.size_flags_horizontal = Control.SIZE_EXPAND_FILL
    scroll.add_child(rows)
    for label_text in ACTIONS:
        var action: String = ACTIONS[label_text]
        var row = HBoxContainer.new()
        rows.add_child(row)
        var action_label = Label.new()
        action_label.text = label_text
        action_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
        row.add_child(action_label)
        var key = Button.new()
        key.custom_minimum_size = Vector2(230, 34)
        key.pressed.connect(_begin_capture.bind(action, "keyboard"))
        row.add_child(key)
        key_buttons[action] = key
        var pad = Button.new()
        pad.custom_minimum_size = Vector2(230, 34)
        pad.pressed.connect(_begin_capture.bind(action, "gamepad"))
        row.add_child(pad)
        pad_buttons[action] = pad
    var footer = HBoxContainer.new()
    column.add_child(footer)
    var reset = Button.new()
    reset.text = "Restore defaults"
    reset.pressed.connect(_restore_defaults)
    footer.add_child(reset)
    var spacer = Control.new()
    spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
    footer.add_child(spacer)
    close_button = Button.new()
    close_button.text = "Close / Resume"
    close_button.pressed.connect(close_menu)
    footer.add_child(close_button)

func open_menu() -> void:
    if visible:
        return
    was_paused = get_tree().paused
    get_tree().paused = true
    show()
    _refresh()
    close_button.grab_focus()

func close_menu() -> void:
    awaiting_action = ""
    awaiting_kind = ""
    hide()
    get_tree().paused = was_paused

func _begin_capture(action: String, kind: String) -> void:
    awaiting_action = action
    awaiting_kind = kind
    status.text = "Press a %s for %s. Escape cancels." % [kind, _action_label(action)]

func _input(event: InputEvent) -> void:
    if not visible or awaiting_action.is_empty():
        return
    if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_ESCAPE:
        awaiting_action = ""
        awaiting_kind = ""
        status.text = "Binding cancelled."
        get_viewport().set_input_as_handled()
        return
    var binding: Dictionary = {}
    if awaiting_kind == "keyboard" and event is InputEventKey and event.pressed and not event.echo:
        binding = _key_spec(event)
    elif awaiting_kind == "gamepad" and event is InputEventJoypadButton and event.pressed:
        binding = {"type":"button", "button":event.button_index}
    elif awaiting_kind == "gamepad" and event is InputEventJoypadMotion and absf(event.axis_value) >= 0.75:
        binding = {"type":"axis", "axis":event.axis, "direction":1.0 if event.axis_value > 0 else -1.0}
    if binding.is_empty():
        return
    get_viewport().set_input_as_handled()
    var conflict = _find_conflict(awaiting_action, awaiting_kind, binding)
    if not conflict.is_empty():
        status.text = "Already used by %s. Try another input, or press Escape to cancel." % conflict
        return
    if awaiting_kind == "keyboard":
        _set_keyboard(awaiting_action, binding)
    else:
        pad_overrides[awaiting_action] = binding
        _apply_gamepads()
    status.text = "%s updated and saved." % _action_label(awaiting_action)
    awaiting_action = ""
    awaiting_kind = ""
    _save_settings()
    _refresh()

func _unhandled_input(event: InputEvent) -> void:
    if visible and awaiting_action.is_empty() and event.is_action_pressed("ui_cancel"):
        get_viewport().set_input_as_handled()
        close_menu()

func _key_spec(event: InputEventKey) -> Dictionary:
    return {"physical":int(event.physical_keycode), "logical":int(event.keycode) if event.physical_keycode == 0 else 0}

func _set_keyboard(action: String, binding: Dictionary) -> void:
    if not InputMap.has_action(action):
        InputMap.add_action(action)
    for old in InputMap.action_get_events(action):
        if old is InputEventKey:
            InputMap.action_erase_event(action, old)
    var key = InputEventKey.new()
    key.physical_keycode = int(binding.get("physical", 0))
    key.keycode = int(binding.get("logical", 0))
    InputMap.action_add_event(action, key)

func _find_conflict(action: String, kind: String, binding: Dictionary) -> String:
    for other in ACTIONS.values():
        if other == action:
            continue
        if kind == "keyboard":
            for event in InputMap.action_get_events(other):
                if event is InputEventKey and _key_spec(event) == binding:
                    return _action_label(other)
        elif not (action.begins_with("p1_") and other.begins_with("p2_")) and not (action.begins_with("p2_") and other.begins_with("p1_")):
            for existing in GamepadBindings.specs_for(other):
                if existing == binding:
                    return _action_label(other)
    return ""

func _action_label(action: String) -> String:
    for label_text in ACTIONS:
        if ACTIONS[label_text] == action:
            return label_text
    return action

func _refresh() -> void:
    for action in ACTIONS.values():
        key_buttons[action].text = "Unassigned"
        for event in InputMap.action_get_events(action):
            if event is InputEventKey:
                key_buttons[action].text = event.as_text().replace(" - Physical", "")
                break
        pad_buttons[action].text = GamepadBindings.describe(action)

func _apply_gamepads() -> void:
    GamepadBindings.set_overrides(pad_overrides)
    if not level.is_node_ready():
        return
    level.p1_pad = -2
    level.p2_pad = -2
    level.system_pad = -2
    level._assign_gamepads()

func _save_settings() -> void:
    var config = ConfigFile.new()
    for action in ACTIONS.values():
        for event in InputMap.action_get_events(action):
            if event is InputEventKey:
                config.set_value("keyboard", action, _key_spec(event))
                break
        if pad_overrides.has(action):
            config.set_value("gamepad", action, pad_overrides[action])
    var error = config.save(SAVE_PATH)
    if error != OK:
        status.text = "Could not save controls (error %d)." % error

func _load_settings() -> void:
    var config = ConfigFile.new()
    if config.load(SAVE_PATH) == OK:
        for action in ACTIONS.values():
            var key = config.get_value("keyboard", action, {})
            if key is Dictionary and (int(key.get("physical", 0)) != 0 or int(key.get("logical", 0)) != 0):
                _set_keyboard(action, key)
            var pad = config.get_value("gamepad", action, {})
            if pad is Dictionary and pad.get("type", "") in ["button", "axis"]:
                pad_overrides[action] = pad
    _apply_gamepads()
    _refresh()

func _restore_defaults() -> void:
    for action in default_keys:
        _set_keyboard(action, default_keys[action])
    pad_overrides.clear()
    _apply_gamepads()
    _save_settings()
    _refresh()
    status.text = "Default keyboard and gamepad bindings restored."`},
      {name:'scripts/Main.gd',code:`extends Node2D

const GamepadBindings = preload("res://scripts/GamepadBindings.gd")
@onready var p1 = $Player1
@onready var p2 = $Player2
@onready var shop: Area2D = $Shop
@onready var exit_area: Area2D = $Exit
@onready var finale: Control = $UI/Finale
@onready var online = $Online
@onready var controls_menu = $UI/ControlsMenu
var finished := false
var game_over := false
var p1_pad := -2
var p2_pad := -2
var system_pad := -2

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    $UI.process_mode = Node.PROCESS_MODE_ALWAYS
    for branch in ["Pickups", "BonusPickups", "Spawner", "Hazards", "Water", "Boulder", "Enemies", "Boss", "Player1", "Player2", "Shop", "Exit", "Online"]:
        get_node(branch).process_mode = Node.PROCESS_MODE_PAUSABLE
    Game.start_run()
    $BonusPickups.add_to_group("loot_container")
    p2.active = false
    p2.hide()
    # The hidden second player must not block the first player.
    p1.add_collision_exception_with(p2)
    p2.add_collision_exception_with(p1)
    Input.joy_connection_changed.connect(_on_joy_connection_changed)
    _assign_gamepads()
    finale.hide()
    _setup_finale()
    $UI/HUD/ShopPanel.hide()
    exit_area.body_entered.connect(_on_exit)
    $UI/HUD/ControlsButton.pressed.connect(controls_menu.open_menu)
    $UI/HUD/Volume.min_value = 0.0
    $UI/HUD/Volume.max_value = 1.0
    $UI/HUD/Volume.step = 0.05
    $UI/HUD/Volume.value = 1.0
    $UI/HUD/Volume.value_changed.connect(_volume_changed)
    $UI/Finale/KeepButton.pressed.connect(func(): _choose("keep"))
    $UI/Finale/ReturnButton.pressed.connect(func(): _choose("return"))
    $UI/Finale/RestartButton.pressed.connect(_restart)
    $UI/HUD/HostButton.pressed.connect(online.host_room)
    $UI/HUD/JoinButton.pressed.connect(func(): online.join_room($UI/HUD/RoomCode.text))
    $UI/HUD/ShopPanel/BuyButton.pressed.connect(func(): _trade("buy"))
    $UI/HUD/ShopPanel/SellButton.pressed.connect(func(): _trade("sell"))
    $UI/HUD/ShopPanel/SalvageButton.pressed.connect(func(): _trade("salvage"))
    $UI/HUD/Story.text = "The forest relic is missing. Find it beyond the guardian."

func _process(_delta: float) -> void:
    _assign_gamepads()
    if controls_menu.visible:
        return
    if Input.is_action_just_pressed("pause"):
        controls_menu.open_menu()
        return
    if get_tree().paused:
        return
    if Input.is_action_just_pressed("restart"):
        _restart()
    if online.is_client:
        _update_hud()
        return
    if Input.is_action_just_pressed("toggle_coop") and not p2.active:
        p2.active = true
        p2.show()
        _assign_gamepads()
    if not finished:
        $UI/HUD/ShopPanel.visible = _shop_player() != null
        for body in shop.get_overlapping_bodies():
            if body == p1 and Input.is_action_just_pressed("p1_interact"):
                Game.buy_heal(p1)
            if body == p2 and p2.active and not p2.remote_controlled and Input.is_action_just_pressed("p2_interact"):
                Game.buy_heal(p2)
        if p1.health <= 0 and (not p2.active or p2.health <= 0):
            finished = true
            game_over = true
            _game_over_after_animation()
    _update_hud()

func _on_joy_connection_changed(_device: int, _connected: bool) -> void:
    _assign_gamepads()

func _assign_gamepads() -> void:
    var pads := Input.get_connected_joypads()
    var first := pads[0] if pads.size() > 0 else -1
    var second := pads[1] if pads.size() > 1 else -1
    var local_coop: bool = p2.active and not p2.remote_controlled and not online.is_client
    var next_p1 := second if local_coop else first
    var next_p2 := first if local_coop else -1
    if next_p1 != p1_pad:
        GamepadBindings.bind_player(1, next_p1)
        p1_pad = next_p1
    if next_p2 != p2_pad:
        GamepadBindings.bind_player(2, next_p2)
        p2_pad = next_p2
    if first != system_pad:
        GamepadBindings.bind_system(first)
        system_pad = first

func _update_hud() -> void:
    $UI/HUD/Stats.text = "Coins %d / 20  Wallet %d  Score %d  Materials %d  Blade %s" % [Game.collected, Game.coins, Game.score, Game.materials, "yes" if Game.attack_bonus > 0 else "no"]
    $UI/HUD/Player1Health.value = p1.health
    $UI/HUD/Player2Health.value = p2.health
    $UI/HUD/Player2Health.visible = p2.active
    $UI/HUD/Player2HealthLabel.visible = p2.active
    $UI/HUD/Hint.text = "Press jump twice for a double jump. Controls: change keys or gamepad. Boss: %s  Room: %s" % ["done" if Game.boss_defeated else "alive", online.code]
    $UI/HUD/Achievements.text = "Badges: " + ", ".join(Game.achievements.keys())
    var lines := []
    for record in Game.records:
        lines.append("%d (%s)" % [record["score"], record["ending"]])
    $UI/HUD/Leaderboard.text = "Top runs: " + ", ".join(lines)

func _shop_player():
    for body in shop.get_overlapping_bodies():
        if body.is_in_group("heroes") and body.active:
            return body
    return null

func _trade(action: String, player = null) -> void:
    if online.is_client:
        online.send_trade(action)
        return
    if player == null:
        player = _shop_player()
    if player == null or not shop.get_overlapping_bodies().has(player):
        return
    var success := false
    match action:
        "buy": success = Game.buy_gear()
        "sell": success = Game.sell_gear()
        "salvage": success = Game.salvage_gear()
    $UI/HUD/Story.text = "%s %s. Gear: %s. Materials: %d" % [action.capitalize(), "complete" if success else "unavailable", ", ".join(Game.inventory), Game.materials]

# Set up a consistent full-screen result overlay for victory and defeat.
func _setup_finale() -> void:
    finale.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    finale.clip_contents = false
    var backdrop: ColorRect = $UI/Finale/Backdrop
    backdrop.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
    backdrop.color = Color(0.015, 0.035, 0.03, 0.82)
    var panel: Panel = $UI/Finale/Background
    _place_finale_control(panel, Rect2(-310, -280, 620, 560))
    panel.add_theme_stylebox_override("panel", _finale_box(Color("142b23"), Color("8f8652"), 2, 22))
    _place_finale_control($UI/Finale/VictoryArt, Rect2(-88, -258, 176, 132))
    _place_finale_control($UI/Finale/DefeatIcon, Rect2(-88, -252, 176, 126))
    _place_finale_control($UI/Finale/Eyebrow, Rect2(-260, -126, 520, 25))
    _place_finale_control($UI/Finale/VictoryTitle, Rect2(-270, -100, 540, 55))
    _place_finale_control($UI/Finale/Result, Rect2(-245, -43, 490, 55))
    _place_finale_control($UI/Finale/Score, Rect2(-245, 12, 490, 35))
    _place_finale_control($UI/Finale/KeepButton, Rect2(-220, 63, 210, 47))
    _place_finale_control($UI/Finale/ReturnButton, Rect2(10, 63, 210, 47))
    _place_finale_control($UI/Finale/Credits, Rect2(-240, 52, 480, 76))
    _place_finale_control($UI/Finale/RestartButton, Rect2(-155, 145, 310, 56))
    for label in [$UI/Finale/DefeatIcon, $UI/Finale/Eyebrow, $UI/Finale/VictoryTitle, $UI/Finale/Result, $UI/Finale/Score, $UI/Finale/Credits]:
        label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
        label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
        label.mouse_filter = Control.MOUSE_FILTER_IGNORE
    $UI/Finale/DefeatIcon.text = "♥"
    $UI/Finale/DefeatIcon.add_theme_font_size_override("font_size", 86)
    $UI/Finale/DefeatIcon.add_theme_color_override("font_color", Color("e69b91"))
    $UI/Finale/Eyebrow.text = "T H E   S L E E P I N G   G R O V E"
    $UI/Finale/Eyebrow.add_theme_font_size_override("font_size", 13)
    $UI/Finale/Eyebrow.add_theme_color_override("font_color", Color("b7c5ad"))
    $UI/Finale/VictoryTitle.add_theme_font_size_override("font_size", 40)
    $UI/Finale/Result.add_theme_font_size_override("font_size", 19)
    $UI/Finale/Result.add_theme_color_override("font_color", Color("edf1df"))
    $UI/Finale/Result.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    $UI/Finale/Score.add_theme_font_size_override("font_size", 15)
    $UI/Finale/Score.add_theme_color_override("font_color", Color("c5d0b5"))
    $UI/Finale/Credits.add_theme_font_size_override("font_size", 14)
    $UI/Finale/Credits.add_theme_color_override("font_color", Color("c5d0b5"))
    for button in [$UI/Finale/KeepButton, $UI/Finale/ReturnButton, $UI/Finale/RestartButton]:
        var primary: bool = button == $UI/Finale/RestartButton
        button.add_theme_font_size_override("font_size", 18)
        button.add_theme_color_override("font_color", Color("1a2c20") if primary else Color("edf1df"))
        button.add_theme_color_override("font_hover_color", Color("1a2c20") if primary else Color.WHITE)
        button.add_theme_stylebox_override("normal", _finale_box(Color("e5c86e") if primary else Color("203b30"), Color("e5c86e") if primary else Color("668671"), 1, 10))
        button.add_theme_stylebox_override("hover", _finale_box(Color("f4dc8f") if primary else Color("315a44"), Color("f7e3a0"), 2, 10))
        button.add_theme_stylebox_override("pressed", _finale_box(Color("c6a84f") if primary else Color("142b23"), Color("f7e3a0"), 2, 10))
        button.add_theme_stylebox_override("focus", _finale_box(Color(0, 0, 0, 0), Color("fff1b4"), 2, 10))
    $UI/Finale/RestartButton.text = "PLAY AGAIN"

func _place_finale_control(control: Control, bounds: Rect2) -> void:
    control.anchor_left = 0.5
    control.anchor_top = 0.5
    control.anchor_right = 0.5
    control.anchor_bottom = 0.5
    control.offset_left = bounds.position.x
    control.offset_top = bounds.position.y
    control.offset_right = bounds.end.x
    control.offset_bottom = bounds.end.y

func _finale_box(fill: Color, border: Color, border_width: int, radius: int) -> StyleBoxFlat:
    var box := StyleBoxFlat.new()
    box.bg_color = fill
    box.border_color = border
    box.set_border_width_all(border_width)
    box.set_corner_radius_all(radius)
    return box

func _on_exit(body) -> void:
    if finished or not body.is_in_group("heroes") or not body.active:
        return
    if Game.collected < 20 or not Game.boss_defeated:
        $UI/HUD/Story.text = "The exit needs 20 coins and the defeated guardian."
        return
    finished = true
    p1.active = false
    p2.active = false
    _show_result("You found the relic. Keep it or return it?", true, true)

func _game_over_after_animation() -> void:
    await get_tree().create_timer(0.9).timeout
    _show_result("Your adventure is not over. Try again!", false)

func _show_result(message: String, choices: bool, passed: bool = false) -> void:
    var art: TextureRect = $UI/Finale/VictoryArt
    var title: Label = $UI/Finale/VictoryTitle
    var already_celebrating := finale.visible and art.visible
    var was_visible := finale.visible
    finale.show()
    if not was_visible:
        finale.modulate.a = 0.0
        create_tween().tween_property(finale, "modulate:a", 1.0, 0.35)
    art.visible = passed
    $UI/Finale/DefeatIcon.visible = not passed and game_over
    $UI/Finale/Score.text = "COINS  %d / 20       SCORE  %d" % [Game.collected, Game.score]
    title.add_theme_color_override("font_color", Color("f4d98b") if passed else Color("f3b0a3"))
    title.text = "LEVEL PASSED!" if passed else ("GAME OVER" if game_over else "RESULT")
    title.show()
    $UI/Finale/Result.text = message
    $UI/Finale/KeepButton.visible = choices
    $UI/Finale/ReturnButton.visible = choices
    _place_finale_control($UI/Finale/RestartButton, Rect2(-155, 145 if choices else 82, 310, 56))
    $UI/Finale/RestartButton.grab_focus()
    $UI/Finale/Credits.text = ""
    if passed and not already_celebrating:
        art.pivot_offset = art.size / 2.0
        art.scale = Vector2(0.35, 0.35)
        art.rotation = -0.25
        art.modulate.a = 0.0
        title.pivot_offset = title.size / 2.0
        title.scale = Vector2(0.8, 0.8)
        title.modulate.a = 0.0
        var celebration := create_tween().set_parallel(true)
        celebration.tween_property(art, "scale", Vector2.ONE, 0.7).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
        celebration.tween_property(art, "rotation", 0.0, 0.7).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
        celebration.tween_property(art, "modulate:a", 1.0, 0.3)
        celebration.tween_property(title, "scale", Vector2.ONE, 0.5).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
        celebration.tween_property(title, "modulate:a", 1.0, 0.4)
    elif not passed:
        title.scale = Vector2.ONE
        title.modulate.a = 1.0

func _choose(choice: String) -> void:
    Game.finish(choice)
    $UI/Finale/Result.text = "You chose to %s the relic. Final score: %d" % [choice, Game.score]
    $UI/Finale/KeepButton.hide()
    $UI/Finale/ReturnButton.hide()
    var result_label: Label = $UI/Finale/Result
    result_label.modulate.a = 0.0
    create_tween().tween_property(result_label, "modulate:a", 1.0, 1.0)
    $UI/Finale/Score.text = "COINS  %d / 20       SCORE  %d" % [Game.collected, Game.score]
    var roll: Label = $UI/Finale/Credits
    roll.text = "CREDITS\\nDesign: your name  ·  Art: credited lesson assets\\nBuilt with Godot"
    roll.modulate.a = 0.0
    create_tween().tween_property(roll, "modulate:a", 1.0, 1.0)

func _volume_changed(value: float) -> void:
    AudioServer.set_bus_volume_db(0, linear_to_db(maxf(value, 0.001)))

func _restart() -> void:
    get_tree().paused = false
    get_tree().reload_current_scene()`},
    {name:'scripts/Online.gd (placeholder; replace in Section 8)',code:`extends Node

var is_client := false
var code := ""

func host_room() -> void:
    pass

func join_room(_room_code: String) -> void:
    pass`}],
    check:'Open Controls or press the pause action. Change a keyboard key and a gamepad button or stick direction; verify conflicts are rejected, the choices still work after restarting, and Restore defaults works. Close the menu to resume. Join P2 and verify each assigned pad still uses the saved bindings.'
  },
  {
    id:'ending',title:'7. Complete the story and ending',modules:'4 Storyline · 12 Ending cutscene · 13 Credits · 15 Achievements · 16 Leaderboard',
    summary:'The level needs a real finish condition, player choice, short cutscene, and credits—not just a boss that disappears.',
    steps:[
      'Set a title and opening line in HUD/Story. Give the two enemy types and boss names using Label nodes or artwork. Replace the sample forest text in Main.gd with the story you wrote in Module 4.',
      'At the exit, Main.gd checks that 20 coins were collected and the boss was defeated. Walk through it to show LEVEL PASSED and animate the generated victory crest with a Tween. Play Again starts a fresh run immediately. Keep and Return are optional ending decisions; choose one to save the ending and leaderboard record before replaying. Replace the sample Result text with your own outcome for each choice.',
      'Main.gd fades in the result and the Credits label with Tweens. Fill Credits with the people and asset sources for your game, then add an AnimationPlayer to animate the relic or camera if you want a richer cutscene.',
      'Finish once with each choice. Confirm coin_collector, boss_breaker, first_purchase, and finished_game appear in Game.achievements, and that the next run shows a leaderboard record.'
    ],
    check:'A complete run reaches an ending choice, shows a cutscene/credits, saves an achievement and score, and restarts cleanly.'
  },
  {
    id:'online',title:'8. Add a two-player online room',modules:'17 Local co-op · 18 Multiplayer',
    summary:'Use the same map and P2 controls. The host runs collisions and rewards; a guest sends P2 input and sees snapshots. The Final Game relay is on this site.',
    steps:[
      'Clear the temporary contents of scripts/Online.gd, then rebuild that same file through the writing tasks below. The shown relay_url uses this page’s WebSocket address; for a local HTTP page it uses 127.0.0.1 instead of localhost to avoid IPv6-only connection failures on some Godot setups. If this page uses localhost, replace it with the public site’s WebSocket URL before running Godot in a cloud workspace; localhost inside the cloud editor points to that server, not your Mac.',
      'Open two independent Godot workspaces or two running copies of the project. Host in one copy; read its six-character room code from the HUD. Enter that code in the second copy and press Join.',
      'On the guest copy, use P1 keyboard controls or the first connected gamepad to control the host’s Player2. The host owns coins, timed item spawns, enemy drops, boss, shop, score, and ending state. The guest receives snapshots of the world; leaderboard records and achievements save in the host’s workspace.',
      'Test a coin pickup, one enemy hit, a purchase, the boss defeat, and the exit while both copies are connected. Use a fresh code after a host disconnects.'
    ],
    files:[{name:'scripts/Online.gd',code:`extends Node

@export var relay_url := "__RELAY_URL__"
var socket := WebSocketPeer.new()
var code := ""
var is_client := false
var is_host := false
var pending := ""
var join_code := ""
var sent := false
var tick := 0.0
var last_ending := ""
var last_splash := false
@onready var level = get_parent()

func host_room() -> void:
    _connect("host", "")

func join_room(room_code: String) -> void:
    _connect("join", room_code.strip_edges().to_upper())

func _connect(role: String, room_code: String) -> void:
    if socket.get_ready_state() == WebSocketPeer.STATE_OPEN:
        socket.close()
    socket = WebSocketPeer.new()
    pending = role
    join_code = room_code
    sent = false
    socket.connect_to_url(relay_url)

func _process(delta: float) -> void:
    socket.poll()
    if socket.get_ready_state() != WebSocketPeer.STATE_OPEN:
        return
    if not sent:
        _send({"type": pending, "code": join_code})
        sent = true
    while socket.get_available_packet_count() > 0:
        var message = JSON.parse_string(socket.get_packet().get_string_from_utf8())
        if message is Dictionary:
            _receive(message)
    # A peer-left message can close the socket while processing packets.
    if socket.get_ready_state() != WebSocketPeer.STATE_OPEN:
        return
    if is_client:
        _send({"type": "input", "axis": Input.get_axis("p1_left", "p1_right"),
            "jump": Input.is_action_just_pressed("p1_jump"),
            "roll": Input.is_action_just_pressed("p1_roll"),
            "crouch": Input.is_action_pressed("p1_crouch"),
            "attack": Input.is_action_just_pressed("p1_attack"),
            "interact": Input.is_action_just_pressed("p1_interact")})
    tick += delta
    if tick < 0.05:
        return
    tick = 0.0
    if is_host:
        _send({"type": "state", "p1": _player(level.p1), "p2": _player(level.p2),
            "coins": Game.coins, "collected": Game.collected, "score": Game.score,
            "materials": Game.materials, "gear": Game.inventory, "attack_bonus": Game.attack_bonus,
            "boss": Game.boss_defeated, "boss_data": _actor(level.get_node_or_null("Boss")),
            "ending": Game.ending, "finished": level.finished, "game_over": level.game_over,
            "shop_open": level.shop.get_overlapping_bodies().has(level.p2),
            "boulder": {"x": level.get_node("Boulder").global_position.x,
                "y": level.get_node("Boulder").global_position.y},
            "water_splashed": level.get_node("Water").splashed,
            "pickups": _remaining("Pickups"), "bonus": _bonus(),
            "enemies": _actors("Enemies")})

func _send(data: Dictionary) -> void:
    socket.send_text(JSON.stringify(data))

func send_trade(action: String) -> void:
    if is_client:
        _send({"type": "trade", "action": action})

func _player(hero) -> Dictionary:
    return {"x": hero.global_position.x, "y": hero.global_position.y,
        "health": hero.health, "active": hero.active,
        "animation": str(hero.sprite.animation), "flip_h": hero.sprite.flip_h, "crouched": hero.crouching}

func _remaining(parent_name: String) -> Array:
    var names := []
    for child in level.get_node(parent_name).get_children():
        names.append(child.name)
    return names

func _actor(actor) -> Dictionary:
    if not is_instance_valid(actor):
        return {}
    return {"x": actor.global_position.x, "y": actor.global_position.y,
        "hp": actor.health_points}

func _actors(parent_name: String) -> Dictionary:
    var result := {}
    for actor in level.get_node(parent_name).get_children():
        result[actor.name] = _actor(actor)
    return result

func _bonus() -> Dictionary:
    var result := {}
    for item in level.get_node("BonusPickups").get_children():
        result[item.name] = {"x": item.global_position.x,
            "y": item.global_position.y, "kind": item.kind}
    return result

func _receive(message: Dictionary) -> void:
    match message.get("type", ""):
        "joined":
            code = str(message.get("code", ""))
            is_host = pending == "host"
            is_client = pending == "join"
            if is_client:
                level.p1.set_physics_process(false)
                level.p2.set_physics_process(false)
                level.get_node("Spawner").set_process(false)
                level.get_node("Spawner/Timer").stop()
                level.get_node("Boulder").freeze = true
                level.get_node("Water").monitoring = false
                for enemy in level.get_tree().get_nodes_in_group("damageable"):
                    enemy.set_physics_process(false)
                for parent_name in ["Pickups", "Hazards"]:
                    for area in level.get_node(parent_name).get_children():
                        area.monitoring = false
                level.shop.monitoring = false
                level.exit_area.monitoring = false
        "peer_joined":
            level.p2.active = true
            level.p2.show()
            level.p2.remote_controlled = true
        "peer_left":
            if is_host:
                level.p2.remote_axis = 0.0
                level.p2.remote_jump = false
                level.p2.remote_roll = false
                level.p2.remote_crouch = false
                level.p2.remote_attack = false
                level.p2.remote_controlled = false
                level.p2.active = false
                level.p2.hide()
            elif is_client:
                level.finished = true
                level._show_result("The host left the room. Restart to play again.", false)
                socket.close()
        "input":
            if is_host:
                level.p2.remote_axis = clampf(float(message.get("axis", 0)), -1.0, 1.0)
                level.p2.remote_jump = level.p2.remote_jump or bool(message.get("jump", false))
                level.p2.remote_roll = level.p2.remote_roll or bool(message.get("roll", false))
                level.p2.remote_crouch = bool(message.get("crouch", false))
                level.p2.remote_attack = level.p2.remote_attack or bool(message.get("attack", false))
                if bool(message.get("interact", false)) and level.shop.get_overlapping_bodies().has(level.p2):
                    Game.buy_heal(level.p2)
        "trade":
            if is_host:
                level._trade(str(message.get("action", "")), level.p2)
        "state":
            if is_client:
                _apply_state(message)

func _apply_state(state: Dictionary) -> void:
    for key in ["p1", "p2"]:
        var hero = level.p1 if key == "p1" else level.p2
        var data = state.get(key, {})
        hero.global_position = Vector2(float(data.get("x", 0)), float(data.get("y", 0)))
        hero.health = int(data.get("health", 3))
        hero.active = bool(data.get("active", false))
        hero.visible = hero.active
        var animation = str(data.get("animation", "idle"))
        hero.sprite.flip_h = bool(data.get("flip_h", false))
        hero._apply_crouch_visual(bool(data.get("crouched", false)) and hero.health > 0)
        if hero.sprite.sprite_frames and hero.sprite.sprite_frames.has_animation(animation):
            hero.sprite.play(animation)
    Game.coins = int(state.get("coins", 0))
    Game.collected = int(state.get("collected", 0))
    Game.score = int(state.get("score", 0))
    Game.materials = int(state.get("materials", 0))
    Game.inventory.assign(state.get("gear", []))
    Game.attack_bonus = int(state.get("attack_bonus", 0))
    Game.boss_defeated = bool(state.get("boss", false))
    Game.ending = str(state.get("ending", ""))
    level.get_node("UI/HUD/ShopPanel").visible = bool(state.get("shop_open", false))
    var boulder_data = state.get("boulder", {})
    level.get_node("Boulder").global_position = Vector2(float(boulder_data.get("x", 0)), float(boulder_data.get("y", 0)))
    if bool(state.get("water_splashed", false)) and not last_splash:
        last_splash = true
        var splash = preload("res://scenes/Splash.tscn").instantiate()
        level.add_child(splash)
        splash.global_position = level.get_node("Boulder").global_position
    _remove_missing("Pickups", state.get("pickups", []))
    _sync_bonus(state.get("bonus", {}))
    _sync_actors("Enemies", state.get("enemies", {}))
    _sync_actor(level.get_node_or_null("Boss"), state.get("boss_data", {}))
    if Game.ending != "" and Game.ending != last_ending:
        last_ending = Game.ending
        level.finished = true
        level._show_result("Host chose to %s the relic." % Game.ending, false, true)
    elif bool(state.get("finished", false)) and not level.finished:
        level.finished = true
        if bool(state.get("game_over", false)):
            level.game_over = true
            level._game_over_after_animation()
        else:
            level._show_result("Host reached the relic. Waiting for their choice…", false, true)

func _remove_missing(parent_name: String, names: Array) -> void:
    for child in level.get_node(parent_name).get_children():
        if not names.has(child.name):
            child.queue_free()

func _sync_bonus(items: Dictionary) -> void:
    var parent = level.get_node("BonusPickups")
    for child in parent.get_children():
        if not items.has(child.name):
            child.queue_free()
    for item_name in items:
        var item = parent.get_node_or_null(item_name)
        if item == null:
            item = preload("res://scenes/Pickup.tscn").instantiate()
            item.name = item_name
            parent.add_child(item)
            item.monitoring = false
        var data = items[item_name]
        item.kind = str(data.get("kind", "coin"))
        item.global_position = Vector2(float(data.get("x", 0)), float(data.get("y", 0)))

func _sync_actors(parent_name: String, actors: Dictionary) -> void:
    for actor in level.get_node(parent_name).get_children():
        _sync_actor(actor, actors.get(actor.name, {}))

func _sync_actor(actor, data: Dictionary) -> void:
    if not is_instance_valid(actor):
        return
    if data.is_empty():
        actor.queue_free()
        return
    actor.global_position = Vector2(float(data.get("x", 0)), float(data.get("y", 0)))
    actor.health_points = int(data.get("hp", 1))`}],
    check:'Two copies show the same room code. The guest moves P2; both copies see the same positions, coins, enemy defeats, boss status, and final ending.'
  },
  {
    id:'test',title:'9. Playtest, polish, and submit',modules:'1–18 integrated',
    summary:'Complete the game as a player would, then keep a copy of the finished Godot project.',
    steps:[
      'Run from the opening story/start area to the exit without using the editor. Test solo first, then local co-op, then an online room with two running project copies.',
      'Check that all 20 coins are reachable, both enemy types can be beaten, the shop actually spends coins, the boss has two phases, and the exit cannot open early.',
      'Test monster contact damage, the health bars, hurt and death animations, game-over and Play Again, the controls menu, pause and volume, the victory animation and immediate replay, both ending choices, credits, achievements, and leaderboard persistence after restarting.',
      'Replace placeholder text and art with your own finished assets. Credit any shared lesson art. Back up your local project folder, or download the current project ZIP before deleting a cloud workspace. Open the backup once to confirm it contains Main.tscn and your scripts.'
    ],
    check:'A fresh playthrough reaches credits without a Debugger error, and your project backup contains the finished level and scripts.'
  }
];
