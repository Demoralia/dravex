const TREE = [
  { id: "welcome.ini", path: "docs/welcome.ini" },
  {
    folder: "design",
    files: [
      "overview.md",
      "systems.md",
      "power.md",
      "combat.md",
      "abilities.md",
      "combinations.md"
    ]
  },
  {
    folder: "cores",
    files: ["plasma.ini", "acid.ini", "void.ini"]
  },
  {
    folder: "runtime",
    files: ["architecture.lua", "client-server.md"]
  },
  {
    folder: "vfx",
    files: ["effects.md", "grenades.md", "kills.md"]
  },
  {
    folder: "anim",
    files: ["motion.md", "ik.md"]
  },
  {
    folder: "assets",
    files: ["weapon.md", "kit.md"]
  },
  {
    folder: "ui",
    files: ["hud.md", "chrome.md"]
  }
];

function filePath(folder, name) {
  return folder ? `docs/${folder}/${name}` : `docs/${name}`;
}

function allFiles() {
  const out = [];
  TREE.forEach((node) => {
    if (node.id) out.push({ id: node.id, path: node.path, folder: null });
    if (node.folder) {
      node.files.forEach((name) => {
        out.push({ id: name, path: filePath(node.folder, name), folder: node.folder });
      });
    }
  });
  return out;
}
