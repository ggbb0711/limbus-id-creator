---
title: Keywords and Status Effects
description: How to write skill text with keywords in the card editor, when to use built-in statuses, custom effects or custom keywords, and a full reference of every built-in keyword.
published: 2026-11-21
---

Skill text in the [Identity Creator](/creator/identity) and [E.G.O Creator](/creator/ego) is built from keywords: the colored, underlined terms with icons that make a card read like the game. This guide covers how to lay out skill text with them, how to choose between a built-in status, a custom effect and a custom keyword, the mistakes that most often break a card, and ends with a reference of every built-in keyword the editor knows.

For the basics of the editor itself, see the [Card Creator Guide](/blog/card-creator-guide#writing-effect-text).

## How keywords work in the editor

Type `[` in any description box and a suggestion list opens. Keep typing and the list narrows to the first 10 keywords that start with what you've typed. Pick one with the arrow keys and Enter, or click it. If you type the whole keyword and close it with `]`, it's inserted straight away, so `[burn]` typed out in full works without touching the list.

Every keyword is lower case, with underscores in place of spaces. Punctuation stays as it is in the name: `[tremor_-_decay]`, `[e.g.o_resource_amp]`, `[the_living_&_the_departed]`. A few keywords contain brackets of their own, like `[hornet_[rifle]]`. Those are easiest to insert from the suggestion list.

An inserted keyword is one block. Backspace removes all of it, and its text can't be edited in place. It also keeps the look it had when it was inserted, which matters for custom effects (see [Common mistakes](#common-mistakes)).

## Laying out skill text

Cards are easier to read when their text follows the same order the game uses. A layout that works for almost every skill:

1. **Skill-wide triggers first**, each on its own line: `[combat_start]`, `[on_use]`, `[before_attack]`, `[after_attack]`.
2. **Coin effects after**, one line per coin, starting with the coin icon: `[coin_1]`, `[coin_2]`, and so on.
3. **Within a coin line**, the trigger comes before the effect: `[coin_2] [heads_hit] Inflict 2 [bleed]`.
4. **Conditions** go before the effect they gate, in plain text: `[on_use] If target has 5+ [sinking], gain 1 [clash_power_up]`.

Put a line break between triggers rather than running them together in one sentence. A reader scanning the card summary on a post looks for the bracketed labels first, and separate lines make each one easy to find.

A typical offense skill then reads like this:

```text
[combat_start] Gain 1 [haste] next turn
[on_use] If this unit has 3+ [poise], gain 1 [clash_power_up]
[coin_1] [heads_hit] Gain 2 [poise] Count
[coin_2] [heads_hit] Inflict 2 [bleed]
[coin_3] [on_crit] Gain 1 [poise] Potency
```

Each bracketed keyword in that text becomes its icon and colored name on the card. The plain words between them stay as you typed them.

### Coins with special markers

The coin keywords do more than add an icon. When a skill's text contains one of these markers, the matching coin drawn on the card changes too:

| Marker | Effect on the card |
| --- | --- |
| `[coin_N_unbreakable]` | Coin *N* is drawn as an Unbreakable coin. |
| `[coin_N_excision]` | Coin *N* is drawn as an Excision coin. |
| `[coin_N_your_effect]` | Coin *N* uses your custom effect's icon and color. Needs **Use as custom coin type** turned on for that effect. |

*N* runs from 1 to 9, and the skill needs at least *N* coins for the marker to show. Coins without a marker stay as normal coins. Put the marker at the start of that coin's line, where `[coin_N]` would go, so the text and the drawing agree.

## Built-in status, custom effect or custom keyword

The editor gives you three ways to add a term to skill text. Each fits a different job.

| | Built-in status | Custom effect | Custom keyword |
| --- | --- | --- | --- |
| Where it comes from | The game, already in the editor | An entry you add to the card | **Setting/Saves → Custom keywords** |
| Icon | The game's icon | Your uploaded icon | None |
| Color | Buff, Debuff or Neutral | Your choice | Your choice |
| Description on the card | No | Yes, as an Effects entry | No |
| Popup for readers | No | Yes, when it has a description | No |
| Saved with the card | Yes | Yes | No, it stays in your browser |

Use a **built-in status** whenever your mechanic is the game's mechanic. Readers already know what `[rupture]` does, and a familiar icon reads faster than a new one.

Use a **custom effect** for a new mechanic that needs explaining. Its description appears in the card's Effects section, and on posts readers can click the keyword anywhere in your skill text to read it in a popup. Custom effects can also become coin types.

Use a **custom keyword** for recurring names that don't need an explanation: a faction, a weapon, a stance you mention in passing. Custom keywords are colored text only, they're limited to 20, and they live in your browser, so add them again on another device. A card that already uses one still shows it anywhere, because the colored text is stored in the description.

## Naming custom effects

A custom effect's keyword is its name in lower case with spaces turned into underscores. **Blood Frenzy** becomes `[blood_frenzy]`, and with **Use as custom coin type** on, `[coin_1_blood_frenzy]` up to `[coin_9_blood_frenzy]` as well.

- **Keep names short.** You type the name every time you use it, and the suggestion list matches from the start of the name.
- **Avoid clashing with built-in names.** A custom effect called **Burn** takes over `[burn]` on that card, and readers will expect the game's Burn.
- **Write a description.** A custom effect with no description gets no popup, and the reader has no way to learn what it does.
- **Pick a color with contrast.** The keyword is drawn in that color on the card's dark background, so very dark colors are hard to read.

## Popups, copying and pasting

Clicking a custom effect, in a description box, on the card preview or in a card summary on a post, opens a popup with its icon, name and description. Built-in statuses don't open popups, because readers already know them.

Selecting skill text and copying it keeps the keywords as words. Pasted into Discord or a document, `[coin_2] [heads_hit] Inflict 2 [bleed]` comes out as "[Heads Hit] Inflict 2 Bleed". Trigger labels keep their brackets, as they do on the card, and the coin icon has no text, so it's dropped. Pasted back into a description box in the editor, the keywords turn back into their styled versions. That works for every built-in keyword and for custom effects that exist on the card you paste into. A custom effect from another card pastes as its plain name until you add an effect with that name to the current card.

## Common mistakes

- **A coin marker with no coin.** `[coin_4_unbreakable]` on a three-coin skill adds the icon to the text but changes nothing on the card. Check the skill's coin number.
- **Renaming a custom effect after using it.** Keywords already inserted keep the old name, color and icon, and they no longer open the popup. After renaming or recoloring an effect, delete the old keywords from your skill text and insert them again.
- **Typing a keyword with spaces.** `[heads hit]` is not a keyword. Use underscores: `[heads_hit]`.
- **Expecting custom keywords on another device.** They're saved per browser. The text already on your cards keeps them, but you can't insert them elsewhere until you add them again.
- **Pasting formatted text.** Pasting into a description box keeps keywords but drops other formatting such as bold or color. Re-apply it with the toolbar after pasting.

## Keyword reference

The tables below list every built-in keyword the editor knows, generated from the editor's own data. Coin keywords follow the patterns `[coin_1]` to `[coin_9]`, `[coin_N_unbreakable]` and `[coin_N_excision]` described above, so they aren't repeated here. New statuses are added as the game releases them.

### Suggest a status effect

If a status effect or keyword from the game is missing, or one shows the wrong name, icon or color, let us know and it will be added to the editor. Email [johnidmaker@gmail.com](mailto:johnidmaker@gmail.com) or message `_johnlimbusmaker` on Discord with the status name and, if you can, the Identity or E.G.O that uses it. The same details are on the [Contact page](/contact).

### Triggers

Timing labels for when an effect happens. They show as bracketed labels like the game's.

| Keyword | Shows as |
| --- | --- |
| `[after_attack]` | [After Attack] |
| `[after_getting_hit]` | [After Getting Hit] |
| `[after_use]` | [After Use] |
| `[attack_end]` | [Attack End] |
| `[attack_start]` | [Attack Start] |
| `[before_attack]` | [Before Attack] |
| `[before_getting_hit]` | [Before Getting Hit] |
| `[before_use]` | [Before Use] |
| `[clash_end]` | [Clash End] |
| `[clash_lose]` | [Clash Lose] |
| `[clash_start]` | [Clash Start] |
| `[clash_tie]` | [Clash Tie] |
| `[clash_win]` | [Clash Win] |
| `[clashable_counter]` | [Clashable Counter] |
| `[combat_end]` | [Combat End] |
| `[combat_start]` | [Combat Start] |
| `[failed_evade]` | [Failed Evade] |
| `[heads_attack_end]` | [Heads Attack End] |
| `[heads_attack_start]` | [Heads Attack Start] |
| `[heads_hit]` | [Heads Hit] |
| `[hit_after_clash_win]` | [Hit after Clash Win] |
| `[indiscriminate]` | [Indiscriminate] |
| `[on_ally_kill]` | [On Ally Kill] |
| `[on_ally_kill_fail]` | [On Ally Kill Fail] |
| `[on_crit]` | [On Crit] |
| `[on_crit_kill]` | [On Crit Kill] |
| `[on_crit_kill_against_enemy]` | [On Crit Kill Against Enemy] |
| `[on_crit_kill_against_enemy_fail]` | [On Crit Kill Against Enemy Fail] |
| `[on_crit_kill_ally]` | [On Crit Kill Ally] |
| `[on_crit_kill_ally_fail]` | [On Crit Kill Ally Fail] |
| `[on_evade]` | [On Evade] |
| `[on_hit]` | [On Hit] |
| `[on_hit_cracked]` | [On Hit Cracked] |
| `[on_hit_without_cracking]` | [On Hit Without Cracking] |
| `[on_kill]` | [On Kill] |
| `[on_unopposed_attack]` | [On Unopposed Attack] |
| `[on_use]` | [On Use] |
| `[reuse_-_on_hit]` | [Reuse - On Hit] |
| `[skill_end]` | [Skill End] |
| `[skill_start]` | [Skill Start] |
| `[tails_attack_end]` | [Tails Attack Hit] |
| `[tails_attack_start]` | [Tails Attack Start] |
| `[tails_hit]` | [Tails Hit] |
| `[target_fixed]` | [Target Fixed] |
| `[turn_end]` | [Turn End] |
| `[turn_start]` | [Turn Start] |
| `[unclashable]` | [Unclashable] |
| `[unopposed_attack]` | [Unopposed Attack] |

### Buffs

Shown in the Buff color.

| Keyword | Shows as |
| --- | --- |
| `[accelerating_future]` | Accelerating Future |
| `[accumulated_past]` | Accumulated Past |
| `[ailing_heart]` | Ailing Heart |
| `[appetite]` | Appetite |
| `[armure_éveillée]` | Armure Éveillée |
| `[artwork:_fascia]` | Artwork: Fascia |
| `[artwork:_tibia]` | Artwork: Tibia |
| `[assist_[援]]` | Assist [援] |
| `[assist_attack]` | Assist Attack |
| `[attack_power_up]` | Attack Power Up |
| `[avenging_my_family]` | Avenging My Family |
| `[backup_candy]` | Backup Candy |
| `[base_power_up]` | Base Power Up |
| `[battle_instinct]` | Battle Instinct |
| `[battle_ready]` | Battle Ready |
| `[battleblood_instinct]` | Battleblood Instinct |
| `[bearing_of_a_salsu]` | Bearing of a Salsu |
| `[beauty_of_the_physique]` | Beauty of the Physique |
| `[before_the_king_in_binds]` | Before the King in Binds |
| `[black_wings]` | Black Wings |
| `[blazing_sunset]` | Blazing Sunset |
| `[bleed_resistance]` | Bleed Resistance |
| `[blessing]` | Blessing |
| `[blessing_of_the_obsidian_god_(Don_Quixote)]` | Blessing of the Obsidian God (Don Quixote) |
| `[blood-tinged_scissorblades]` | Blood-tinged Scissorblades |
| `[bloodflame_[血炎]]` | Bloodflame [血炎] |
| `[bloodied_hand]` | Bloodied Hand |
| `[blooming_thorn]` | Blooming Thorn |
| `[blossom_scissors]` | Blossom Scissors |
| `[blunt_dmg_up]` | Blunt DMG Up |
| `[blunt_power_up]` | Blunt Power Up |
| `[blunt_protection]` | Blunt Protection |
| `[book_of_vengeance_[heathcliff]]` | Book of Vengeance [Heathcliff] |
| `[book_of_vengeance_[sinclair]]` | Book of Vengeance [Sinclair] |
| `[borrowed_time]` | Borrowed Time |
| `[bright_[光]]` | Bright [光] |
| `[burgeoning_of_horns_[發角]]` | Burgeoning of Horns [發角] |
| `[charge]` | Charge |
| `[charge_barrier]` | Charge Barrier |
| `[charm_of_the_beastly]` | Charm of the Beastly |
| `[check_this_out,_kiddo!]` | Check This Out, Kiddo! |
| `[clash_power_up]` | Clash Power Up |
| `[coffin]` | Coffin |
| `[commanding_cry]` | Commanding Cry |
| `[concentration_-_sniper]` | Concentration - Sniper |
| `[concentration【sniper】]` | Concentration【Sniper】 |
| `[corpus_ingredient]` | Corpus Ingredient |
| `[crit_dmg_up]` | Crit DMG Up |
| `[cumulus_wall]` | Cumulus Wall |
| `[damage_up]` | Damage Up |
| `[dark_cloud_blade]` | Dark Cloud Blade |
| `[dawn_office]` | Dawn Office |
| `[dawnherald]` | Dawnherald |
| `[deep_inhale]` | Deep Inhale |
| `[deep_tears]` | Deep Tears |
| `[defense_level_up]` | Defense Level Up |
| `[defense_power_up]` | Defense Power Up |
| `[defensive_stance]` | Defensive Stance |
| `[denial_[不許]]` | Denial [不許] |
| `[desire_for_acknowledgement_sated]` | Desire for Acknowledgement Sated |
| `[despair]` | Despair |
| `[desperado]` | Desperado |
| `[dhyāna]` | Dhyāna |
| `[dimensional_castaway]` | Dimensional Castaway |
| `[dokkaebi_arms]` | Dokkaebi Arms |
| `[drink_to_the_fallen]` | Drink to the Fallen |
| `[dullahan]` | Dullahan |
| `[e.g.o_resource_amp]` | E.G.O Resource Amp |
| `[emergency_barrier_battery]` | Emergency Barrier Battery |
| `[entangled_life_[羅生]]` | Entangled Life [羅生] |
| `[entanglement]` | Entanglement |
| `[envy_dmg_up]` | Envy DMG Up |
| `[envy_power_up]` | Envy Power Up |
| `[envy_protection]` | Envy Protection |
| `[erudition]` | Erudition |
| `[exquisite_aesthetics]` | Exquisite Aesthetics |
| `[eye_of_precognition]` | Eye of Precognition |
| `[eye_of_precognition_-_overheat]` | Eye of Precognition - Overheat |
| `[faith_beyond_question]` | Faith Beyond Question |
| `[fanatic]` | Fanatic |
| `[fell_bullet]` | Fell Bullet |
| `[festive_fever]` | Festive Fever |
| `[firepower]` | Firepower |
| `[flower-burying_pin_[埋花針]]` | Flower Burying Pin [埋花針] |
| `[flower-burying_wedge_[埋花櫼]]` | Flower Burying Wedge [埋花櫼] |
| `[focused_performance]` | Focused Performance |
| `[from_dawnbreak_to_sunset]` | From Dawnbreak to Sunset |
| `[gaze_of_contempt]` | Gaze of Contempt |
| `[gebura's_blade]` | Gebura's Blade |
| `[glimpse_of_precognition]` | Glimpse of Precognition |
| `[gloom_dmg_up]` | Gloom DMG Up |
| `[gloom_power_up]` | Gloom Power Up |
| `[gloom_protection]` | Gloom Protection |
| `[gluttony_dmg_up]` | Gluttony DMG Up |
| `[gluttony_power_up]` | Gluttony Power Up |
| `[gluttony_protection]` | Gluttony Protection |
| `[grace_of_the_prescript]` | Grace of the Prescript |
| `[growing_resentment]` | Growing Resentment |
| `[guardians_of_the_forest]` | Guardians of the Forest |
| `[hardblood]` | Hardblood |
| `[hardblood_armor]` | Hardblood Armor |
| `[hardblood_cast]` | Hardblood Cast |
| `[hardened_shell-barrier]` | Hardened Shell-Barrier |
| `[haste]` | Haste |
| `[heated_gas_harpoon]` | Heated Gas Harpoon |
| `[heishou_bolus_contamination_[黑獸丸染]]` | Heishou Bolus Contamination [黑獸丸染] |
| `[here_comes_magical_girl!]` | Here Comes Magical Girl! |
| `[high-voltage_exoskeleton]` | High-voltage Exoskeleton |
| `[high_noon]` | High Noon |
| `[higher_thunderer]` | Higher Thunderer |
| `[hp_healing_boost]` | HP Healing Boost |
| `[hunger]` | Hunger |
| `[i_got_praised!]` | I Got Praised! |
| `[imperfections_addressed]` | Imperfections Addressed |
| `[incandescent_indulgence]` | Incandescent Indulgence |
| `[indulgence_in_prescripts]` | Indulgence in Prescripts |
| `[inertia_of_drifting]` | Inertia of Drifting |
| `[iron_maiden]` | Iron Maiden |
| `[l'hommage]` | L'Hommage |
| `[le_fauvisme_-_masque_de_chien]` | Le Fauvisme - Masque de Chien |
| `[le_fauvisme_-_masque_de_loup]` | Le Fauvisme - Masque de Loup |
| `[le_noir:_gabardine_overcoat]` | Le Noir: Gabardine Overcoat |
| `[leash-holder_of_all_heishou]` | Leash Holder of All Heishou |
| `[life_from_death_[死中求活]]` | Life from Death [死中求活] |
| `[liferender]` | Liferender |
| `[light_of_daybreak]` | Light of Daybreak |
| `[linebreaker]` | Linebreaker |
| `[load]` | Load |
| `[loneliness_at_high_noon]` | Loneliness at High Noon |
| `[love/hate]` | Love-Hate |
| `[loyalty_pheromone]` | Loyalty Pheromone |
| `[lust_dmg_up]` | Lust DMG Up |
| `[lust_power_up]` | Lust Power Up |
| `[lust_protection]` | Lust Protection |
| `[magical_arcana]` | Magical Arcana |
| `[magical_girl's_chant]` | Magical Girl's Chant |
| `[man_in_scabbard]` | Man in Scabbard |
| `[maturing_textbook]` | Maturing Textbook |
| `[microprecision_time_acceleration]` | Microprecision Time Acceleration |
| `[minus_coin_drop]` | Minus Coin Drop |
| `[mook_workshop_-_ye_[銳]_type_ii_bladedraw_/_thrust_force:_dokkaebi_fire]` | Mook Workshop - Ye [銳] Type II Bladedraw / Thrust Force: Dokkaebi Fire |
| `[moonlit_azure_blade]` | Moonlit Azure Blade |
| `[near-light_superbattery]` | Near-light Superbattery |
| `[nebulizer_α]` | Nebulizer α |
| `[nebulizer_β]` | Nebulizer β |
| `[offense_level_up]` | Offense Level Up |
| `[overheat]` | Overheat |
| `[overheated_gas_harpoon]` | Overheated Gas Harpoon |
| `[penitence]` | Penitence |
| `[petals]` | Petals |
| `[pheromone]` | Pheromone |
| `[pierce_dmg_up]` | Pierce DMG Up |
| `[pierce_power_up]` | Pierce Power Up |
| `[pierce_protection]` | Pierce Protection |
| `[piercing_sword]` | Piercing Sword |
| `[plus_coin_boost]` | Plus Coin Boost |
| `[poise]` | Poise |
| `[power_up]` | Power Up |
| `[preservation]` | Preservation |
| `[pride_dmg_up]` | Pride DMG Up |
| `[pride_power_up]` | Pride Power Up |
| `[pride_protection]` | Pride Protection |
| `[prisoner_transport_arrangements]` | Prisoner Transport Arrangements |
| `[protecting_sword]` | Protecting Sword |
| `[protection]` | Protection |
| `[protector's_stance]` | Protector's Stance |
| `[pulsation]` | Pulsation |
| `[quadricolor_dimensions]` | Quadricolor Dimensions |
| `[ready_to_loose]` | Ready to Loose |
| `[red_eyes]` | Red Eyes |
| `[remembrance]` | Remembrance |
| `[resentful_scabbard]` | Resentful Scabbard |
| `[resentment]` | Resentment |
| `[ridiculous_grit]` | Ridiculous Grit |
| `[rupture_protection]` | Rupture Protection |
| `[sanctum_of_conservation]` | Sanctum of Conservation |
| `[scarlet_moth]` | Scarlet Moth |
| `[scorch_propellant_ammo]` | Scorch Propellant Ammo |
| `[second_is_welcome-snipping]` | Second is Welcome-snipping |
| `[self-charge]` | Self-charge |
| `[serpent_arm]` | Serpent Arm |
| `[shimmering【bloodfiend】]` | Shimmering [BloodFiend] |
| `[shin_(心)_-_dihui_star_[地慧星]]` | Shin (心) - Dihui Star [地慧星] |
| `[shin_(心)_-_disgrace]` | Shin (心) - Disgrace |
| `[shin_(心)_-_fate]` | Shin (心) - Fate |
| `[shin_(心)_-_procuration]` | Shin (心) - Procuration |
| `[shin_(心)_-_tiantui_star_[天退星]]` | Shin (心) - Tiantui Star [天退星] |
| `[sizzling_wound]` | Sizzling Wound |
| `[slash_dmg_up]` | Slash DMG Up |
| `[slash_power_up]` | Slash Power Up |
| `[slash_protection]` | Slash Protection |
| `[sloth_dmg_up]` | Sloth DMG Up |
| `[sloth_power_up]` | Sloth Power Up |
| `[sloth_protection]` | Sloth Protection |
| `[somatic_frisson-inspiring_melody]` | Somatic Frisson-inspiring Melody |
| `[spark_of_inspiration]` | Spark of Inspiration |
| `[strider【mao】]` | Strider [Mao] |
| `[strider【wu】]` | Strider [Wu] |
| `[string_severance_[絕緣]]` | String Severance [絕緣] |
| `[sword_of_the_homeland_-_penetrating]` | Sword of the Homeland - Penetrating |
| `[sword_of_the_homeland_-_rending]` | Sword of the Homeland - Rending |
| `[sword_of_the_homeland_-_striking]` | Sword of the Homeland - Striking |
| `[sword_of_the_homeland_-_the_true_essence]` | Sword of the Homeland - The True Essence |
| `[swordplay_of_the_homeland]` | Swordplay of the Homeland |
| `[target_aim]` | Target Aim |
| `[tarnished_blood]` | Tarnished Blood |
| `[tear-sharpened]` | Tear-sharpened |
| `[the_middle_-_grudge]` | The Middle - Grudge |
| `[the_middle_-_vengeance_tattoo_[great_sister]]` | The Middle - Vengeance Tattoo [Great Sister] |
| `[the_middle_styled_augmentation_tattoos]` | The Middle Styled Augmentation Tattoos |
| `[the_self_unbound_-_flow_state]` | The Self Unbound - Flow State |
| `[the_udjat_[vanguard]]` | The Udjat [Vanguard] |
| `[thermal_blades]` | Thermal Blades |
| `[thunderer]` | Thunderer |
| `[tiantui_star_[天退星]]` | Tiantui Star [天退星] |
| `[trauma_shield]` | Trauma Shield |
| `[tremor_-_clockwinding]` | Tremor - Clockwinding |
| `[tremor_-_distribution]` | Tremor - Distribution |
| `[unjust_enrichment]` | Unjust Enrichment |
| `[unlock]` | Unlock |
| `[unlock_-_i]` | Unlock - I |
| `[unlock_-_ii]` | Unlock - II |
| `[unlock_-_iii]` | Unlock - III |
| `[unrelenting_spirit_-_shin_[剛氣-心]]` | Unrelenting Spirit - Shin [剛氣-心] |
| `[unrelenting_spirit_[剛氣]]` | Unrelenting Spirit [剛氣] |
| `[unrelenting_storm]` | Unrelenting Storm |
| `[vengeance_tattoo]` | Vengeance Tattoo |
| `[violent_collections]` | Violent Collections |
| `[weak-resist_dmg_boost]` | Weak-resist DMG Boost |
| `[when_boring_a_20-inch_hole_with_a_lance...]` | When boring a 20-inch hole with a lance... |
| `[when_caving_in_the_back_of_the_skull_with_a_hammer...]` | When caving in the back of the skull with a hammer... |
| `[when_cleaving_through_the_shoulder_and_the_skull_with_a_bastard_sword...]` | When cleaving through the shoulder and the skull with a bastard sword... |
| `[when_hacking_through_the_ribs_with_a_hatchet...]` | When hacking through the ribs with a hatchet... |
| `[when_lacerating_through_space_itself_with_a_scythe,_like_a_certain_someone...]` | When lacerating through space itself with a scythe, like a certain someone... |
| `[when_penetrating_the_lungs_with_a_stiletto...]` | When penetrating the lungs with a stiletto... |
| `[when_punching_10_or_more_holes_in_the_torso_with_a_rapier...]` | When punching 10 or more holes in the torso with a rapier... |
| `[when_rending_the_body_with_a_great_sword...]` | When rending the body with a greatsword... |
| `[when_ripping_the_flesh_to_ten_thousand_strips_with_a_whip...]` | When ripping the flesh to ten thousand strips with a whip... |
| `[wild_hunt]` | Wild Hunt |
| `[witnessed_-_eastern_cinq]` | Witnessed - Eastern Cinq |
| `[wound-casing_mask]` | Wound-casing Mask |
| `[wrath_dmg_up]` | Wrath DMG Up |
| `[wrath_power_up]` | Wrath Power Up |
| `[wrath_protection]` | Wrath Protection |

### Debuffs

Shown in the Debuff color.

| Keyword | Shows as |
| --- | --- |
| `[art_medium]` | Art Medium |
| `[attack_power_down]` | Attack Power Down |
| `[avulsion_wound]` | Avulsion Wound |
| `[b.m.]` | B.M. |
| `[before_the_king]` | Before the King |
| `[bind]` | Bind |
| `[bladetrail_[afterimage]]` | Bladetrail [Afterimage] |
| `[bleed]` | Bleed |
| `[blue_sand]` | Blue Sand |
| `[blunt_dmg_down]` | Blunt DMG Down |
| `[blunt_fragility]` | Blunt Fragility |
| `[blunt_power_down]` | Blunt Power Down |
| `[blunt_resist_down]` | Blunt Resist Down |
| `[book_of_vengeance_[the_house_of_spiders]]` | Book of Vengeance [The House of Spiders] |
| `[burn]` | Burn |
| `[butterfly]` | Butterfly |
| `[centipede_venom]` | Centipede Venom |
| `[charged_sting]` | Charged Sting |
| `[clash_power_down]` | Clash Power Down |
| `[concussion]` | Concussion |
| `[contempt]` | Contempt |
| `[contempt_of_the_gaze]` | Contempt of the Gaze |
| `[corpus_theater]` | Corpus Theater |
| `[curse]` | Curse |
| `[damage_down]` | Damage Down |
| `[dark_flame]` | Dark Flame |
| `[dazzle]` | Dazzle |
| `[deathrite【fissure】]` | Deathrite [Fissure] |
| `[deathrite【haste】]` | Deathrite [Haste] |
| `[deathrite【venom】]` | Deathrite [Venom] |
| `[declared_duel]` | Declared Duel |
| `[deep_wound]` | Deep Wound |
| `[defense_level_down]` | Defense Level Down |
| `[defense_power_down]` | Defense Power Down |
| `[delicateness]` | Delicateness |
| `[dimensional_rift]` | Dimensional Rift |
| `[echoes_of_the_manor]` | Echoes of the Manor |
| `[embers]` | Embers |
| `[envy_dmg_down]` | Envy DMG Down |
| `[envy_fragility]` | Envy Fragility |
| `[envy_power_down]` | Envy Power Down |
| `[envy_resist_down]` | Envy Resist Down |
| `[faint_aroma]` | Faint Aroma |
| `[fairy_lure]` | Fairy Lure |
| `[fatal_wound]` | Fatal Wound |
| `[focused_attack]` | Focused Attack |
| `[fracturing_of_the_senses]` | Fracturing of the Senses |
| `[fragile]` | Fragile |
| `[gaze]` | Gaze |
| `[gloom_dmg_down]` | Gloom DMG Down |
| `[gloom_fragility]` | Gloom Fragility |
| `[gloom_power_down]` | Gloom Power Down |
| `[gloom_resist_down]` | Gloom Resist Down |
| `[gluttonous_thorn_(貪食棘)]` | Gluttonous Thorn (貪食棘) |
| `[gluttony_dmg_down]` | Gluttony DMG Down |
| `[gluttony_fragility]` | Gluttony Fragility |
| `[gluttony_power_down]` | Gluttony Power Down |
| `[hp_healing_down]` | HP Healing Down |
| `[hysteria]` | Hysteria |
| `[immobilized]` | Immobilized |
| `[impending_ruin]` | Impending Ruin |
| `[karmic_consequence]` | Karmic Consequence |
| `[la_mancha_parade]` | La Mancha Parade |
| `[lasso]` | Lasso |
| `[lodged_arrow]` | Lodged Arrow |
| `[lust_dmg_down]` | Lust DMG Down |
| `[lust_fragility]` | Lust Fragility |
| `[lust_power_down]` | Lust Power Down |
| `[maggots]` | Maggots |
| `[mark_of_decay]` | Mark of Decay |
| `[mark_of_shearing]` | Mark of Shearing |
| `[mark_of_villainy]` | Mark of Villainy |
| `[mauled_color_[bleu]]` | Mauled Color [Bleu] |
| `[mauled_color_[rouge]]` | Mauled Color [Rouge] |
| `[minus_coin_boost]` | Minus Coin Boost |
| `[nails]` | Nails |
| `[needle]` | Needle |
| `[nerve_strike]` | Nerve Strike |
| `[offense_level_down]` | Offense Level Down |
| `[only_ashes_remain]` | Only Ashes Remain |
| `[open_wound]` | Open Wound |
| `[overheated_coffin]` | Overheated Coffin |
| `[palette_vibrante]` | Palette Vibrante |
| `[paralyze]` | Paralyze |
| `[phantom_trace]` | Phantom Trace |
| `[pheromone_mark]` | Pheromone Mark |
| `[photoelectricity]` | Photoelectricity |
| `[pierce_dmg_down]` | Pierce DMG Down |
| `[pierce_fragility]` | Pierce Fragility |
| `[pierce_power_down]` | Pierce Power Down |
| `[pierce_resist_down]` | Pierce Resist Down |
| `[pink_petals]` | Pink Petals |
| `[pink_ribbons]` | Pink Ribbons |
| `[plus_coin_drop]` | Plus Coin Drop |
| `[poison]` | Poison |
| `[polydipsic_rose]` | Polydipsic Rose |
| `[power_down]` | Power Down |
| `[pride_dmg_down]` | Pride DMG Down |
| `[pride_fragility]` | Pride Fragility |
| `[pride_power_down]` | Pride Power Down |
| `[promised_nail]` | Promised Nail |
| `[red_plum_blossom]` | Red Plum Blossom |
| `[reflux]` | Reflux |
| `[regressive_transformation_-_reversed]` | Regressive Transformation - Reversed |
| `[requested_target]` | Requested Target |
| `[resident_reg._microchip]` | Resident Reg. Microchip |
| `[rhythm]` | Rhythm |
| `[rose_wedge]` | Rose Wedge |
| `[rupture]` | Rupture |
| `[searing_birdcage]` | Searing Birdcage |
| `[severed_tendon]` | Severed Tendon |
| `[sewing_target]` | Sewing Target |
| `[shattered_world]` | Shattered World |
| `[shattermark]` | Shattermark |
| `[sheut_fracture]` | Sheut Fracture |
| `[sibling_vengeance_mark]` | Sibling Vengeance Mark |
| `[sinking]` | Sinking |
| `[sinking_deluge]` | Sinking Deluge |
| `[sinking_fragility]` | Sinking Fragility |
| `[slash_dmg_down]` | Slash DMG Down |
| `[slash_fragility]` | Slash Fragility |
| `[slash_power_down]` | Slash Power Down |
| `[slash_resist_down]` | Slash Resist Down |
| `[sloth_dmg_down]` | Sloth DMG Down |
| `[sloth_fragility]` | Sloth Fragility |
| `[sloth_power_down]` | Sloth Power Down |
| `[smoke]` | Smoke |
| `[solitude]` | Solitude |
| `[spark_discharge]` | Spark Discharge |
| `[spore]` | Spore |
| `[talisman]` | Talisman |
| `[the_duel_escalates]` | The Duel Escalates |
| `[the_uninvited]` | The Uninvited |
| `[time_moratorium]` | Time Moratorium |
| `[touche_hardie]` | Touche Hardie |
| `[tremor]` | Tremor |
| `[tremor_-_chain]` | Tremor - Chain |
| `[tremor_-_conservation]` | Tremor - Conservation |
| `[tremor_-_decay]` | Tremor - Decay |
| `[tremor_-_everlasting]` | Tremor - Everlasting |
| `[tremor_-_fracture]` | Tremor - Fracture |
| `[tremor_-_hemorrhage]` | Tremor - Hemorrhage |
| `[tremor_-_reverb]` | Tremor - Reverb |
| `[tremor_-_scorch]` | Tremor - Scorch |
| `[tremor_-_superposition]` | Tremor - Superposition |
| `[tremor_burst]` | Tremor Burst |
| `[trussed_[hong_lu]]` | Trussed [Hong Lu] |
| `[twisted_curse_talisman]` | Twisted Curse Talisman |
| `[vendetta_mark]` | Vendetta Mark |
| `[vengeance_mark]` | Vengeance Mark |
| `[weakness_analyzed]` | Weakness Analyzed |
| `[wrath_dmg_down]` | Wrath DMG Down |
| `[wrath_fragility]` | Wrath Fragility |
| `[wrath_power_down]` | Wrath Power Down |
| `[wrath_resist_down]` | Wrath Resist Down |

### Neutral

Shown in the Neutral color: resources, counters, stances and Identity-specific mechanics.

| Keyword | Shows as |
| --- | --- |
| `[aggro]` | Aggro |
| `[ammo]` | Ammo |
| `[ammo_-_atelier_logic]` | Ammo - Atelier Logic |
| `[amplitude_conversion]` | Amplitude Conversion |
| `[amplitude_entanglement]` | Amplitude Entanglement |
| `[arrow_-_shi]` | Arrow-Shi |
| `[ashen_bullet]` | Ashen Bullet |
| `[assist_defense]` | Assist Defense |
| `[battlefield_retreat]` | Battlefield Retreat |
| `[blazing]` | Blazing |
| `[bleed_identity]` | Bleed Identity |
| `[bloodfeast]` | Bloodfeast |
| `[bloodfeast_consumed]` | Bloodfeast Consumed |
| `[bloodfeast_consumed_(shared)]` | Bloodfeast Consumed (shared) |
| `[blubberbubble]` | Blubberbubble |
| `[bullet_-_solitude]` | Bullet - Solitude |
| `[burn_identity]` | Burn Identity |
| `[changing_room]` | Changing Room |
| `[charge_identity]` | Charge Identity |
| `[clashable_guard]` | Clashable Guard |
| `[courier_trunk]` | Courier Trunk |
| `[curio]` | Curio |
| `[dark_cloud]` | Dark Cloud |
| `[dihui_star's_blade]` | Dihui Star's Blade |
| `[discard]` | Discard |
| `[district_12_fuel]` | District 12 Fuel |
| `[duality]` | Duality |
| `[escape_apparatus]` | Escape Apparatus |
| `[exalted_command]` | Exalted Command |
| `[excision_coin]` | Excision Coin |
| `[final_augment]` | Final Augment |
| `[fire_butterfly_coffin]` | Fire Butterfly Coffin |
| `[first_seal_removed]` | First Seal Removed |
| `[fixed_panic]` | Fixed Panic |
| `[full_makeover]` | Full Makeover |
| `[game_target]` | Game Target |
| `[hand_-_blue_sakura_suit]` | Hand - Blue Sakura Suit |
| `[hand_-_pine_crane_suit]` | Hand - Pine Crane Suit |
| `[hand_-_susuki_grass_suit]` | Hand - Susuki Grass Suit |
| `[hornet_[rifle]]` | Hornet [Rifle] |
| `[hornet_[shotgun]]` | Hornet [Shotgun] |
| `[hyped-up]` | Hyped-up |
| `[insight]` | Insight |
| `[k_corp_ampule]` | K Corp Ampule |
| `[lamp]` | Lamp |
| `[launcher_[始]]` | Launcher [始] |
| `[lca_fracture_round]` | LCA Fracture Round |
| `[lordsguard]` | LordsGuard |
| `[lævateinn]` | Lævateinn |
| `[magic_bullet]` | Magic Bullet |
| `[mark_of_the_prescript]` | Mark of the Prescript |
| `[melee_support]` | Melee Support |
| `[overcharge]` | Overcharge |
| `[overheated_fuel]` | Overheated Fuel |
| `[overwatch_assignment]` | Overwatch Assignment |
| `[poise_identity]` | Poise Identity |
| `[prescript]` | Prescript |
| `[prescript:_[device]]` | Prescript [Device] |
| `[prescript:_[device]_i]` | Prescript [Device] I |
| `[prescript:_[device]_ii]` | Prescript [Device] II |
| `[prescript:_[device]_iii]` | Prescript [Device] III |
| `[prescript:_[device]_iv]` | Prescript [Device] IV |
| `[prescript:_[paper_slip]]` | Prescript [Paper Slip] |
| `[prescript:_[paper_slip]_i]` | Prescript [Paper Slip] I |
| `[prescript:_[paper_slip]_ii]` | Prescript [Paper Slip] II |
| `[prescript:_[paper_slip]_iii]` | Prescript [Paper Slip] III |
| `[prescript:_[paper_slip]_iv]` | Prescript [Paper Slip] IV |
| `[procuration_[hermes]]` | Procuration [Hermes] |
| `[ready_[待]]` | Ready [待] |
| `[reload]` | Reload |
| `[reload_[germination]]` | Reload [Germination] |
| `[responsibility]` | Responsibility |
| `[rising_fever]` | Rising Fever |
| `[rupture_identity]` | Rupture Identity |
| `[réflexion]` | Réflexion |
| `[savage_tigermark_round]` | Savage Tigermark Round |
| `[scorchfield]` | Scorchfield |
| `[sealed_sword]` | Sealed Sword |
| `[second_seal_removed]` | Second Seal Removed |
| `[self_resonance_circuitry]` | Self Resonance Circuitry |
| `[shallow_exhale]` | Shallow Exhale |
| `[single_combat]` | Single Combat |
| `[sinking_identity]` | Sinking Identity |
| `[sp_heal_efficiency]` | SP Heal Efficiency |
| `[sp_loss_efficiency]` | SP Loss Efficiency |
| `[spore_round_[base]]` | Spore Round [Base] |
| `[spore_round_[buckshot]]` | Spore Round [BuckShot] |
| `[strategic_r&r_mode]` | Strategic R&R Mode |
| `[surgery]` | Makeshift Surgery |
| `[target_spotted]` | Target Spotted |
| `[the_living_&_the_departed]` | The Living & The Departed |
| `[the_prescript's_target]` | The Prescript's Target |
| `[tianjiu_star's_blade]` | Tianjiu Star's Blade |
| `[tigermark_round]` | Tigermark Round |
| `[torn_memory]` | Torn Memory |
| `[total_bloodfeast_consumed]` | Total Bloodfeast Consumed |
| `[tremor_identity]` | Tremor Identity |
| `[unbreakable_coin]` | Unbreakable Coin |
| `[unfocused_volley]` | Unfocused Volley |
| `[viewing_the_tableau]` | Viewing the Tableau |
| `[volatile_passion]` | Volatile Passion |
| `[your_will_guides_my_blade.]` | Your Will Guides My Blade |
