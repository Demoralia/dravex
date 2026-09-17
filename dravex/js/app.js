const treeEl = document.getElementById("tree");
const editor = document.getElementById("editor");
const tab = document.getElementById("tab");
const titleMid = document.getElementById("titleMid");
const extEl = document.getElementById("ext");
const statusName = document.getElementById("statusName");
const sidebar = document.getElementById("sidebar");
const cache = {};

function buildTree() {
  let html = "";
  TREE.forEach((node) => {
    if (node.id) {
      html += `<button class="tree-file" data-id="${node.id}" data-path="${node.path}">${node.id}</button>`;
      return;
    }
    html += `<div class="tree-folder open nested" data-folder="${node.folder}">
      <button class="head"><span class="chev">▸</span> ${node.folder}</button>
      <div class="kids">
        ${node.files
          .map(
            (name) =>
              `<button class="tree-file" data-id="${name}" data-path="${filePath(node.folder, name)}">${name}</button>`
          )
          .join("")}
      </div>
    </div>`;
  });
  treeEl.innerHTML = html;

  treeEl.querySelectorAll(".tree-folder > .head").forEach((h) => {
    h.addEventListener("click", () => h.parentElement.classList.toggle("open"));
  });
}

async function loadText(path) {
  if (cache[path]) return cache[path];
  const res = await fetch(path);
  if (!res.ok) throw new Error(`missing ${path}`);
  const text = await res.text();
  cache[path] = text;
  return text;
}

async function openFile(id, path) {
  const folder = path.split("/").length > 2 ? path.split("/")[1] : null;
  const ext = id.split(".").pop();

  document.querySelectorAll(".tree-file").forEach((b) => {
    b.classList.toggle("on", b.dataset.id === id);
  });

  tab.textContent = id;
  tab.style.animation = "none";
  void tab.offsetHeight;
  tab.style.animation = "";

  titleMid.textContent = `${id} — dravex`;
  extEl.textContent = ext;
  statusName.textContent = id;

  editor.classList.remove("swap");
  void editor.offsetHeight;

  try {
    const text = await loadText(path);
    editor.innerHTML = renderFile(id, folder, text);
  } catch (err) {
    editor.innerHTML = `<div class="path">${id}<span class="caret"></span></div>
      <div class="prose"><p>Could not load <span style="color:var(--fg-bright)">${path}</span>.</p>
      <p>This site reads each doc as its own file. Serve the folder — don't double-click the HTML.</p>
      <p>From the dravex folder run:</p>
      <pre>python3 -m http.server 8080</pre>
      <p>Then open http://localhost:8080</p></div>`;
  }

  editor.classList.add("swap");
  if (window.innerWidth < 760) sidebar.classList.remove("open");
}

treeEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".tree-file");
  if (!btn) return;
  openFile(btn.dataset.id, btn.dataset.path);
});

document.getElementById("brand").addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

buildTree();
openFile("welcome.ini", "docs/welcome.ini");
