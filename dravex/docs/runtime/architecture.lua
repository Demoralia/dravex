ReplicatedStorage/Modules
  CoreBase
  CoreTypes/Plasma Acid Void
  WeaponSystem
  AbilitySystem
  EffectSystem
  UIController

StarterPlayer/StarterPlayerScripts
  ClientController
  EffectReplicator

ServerScriptService
  GameController
  DamageHandler
  AbilityValidator

Core-specific behavior stays in CoreTypes. Weapon, ability, effect, and UI systems depend on the base, not the other way around.
