function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderIni(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let kv = [];

  const flush = () => {
    if (!kv.length) return;
    html += `<div class="kv">${kv
      .map(([k, v]) => `<div class="k">${escapeHtml(k)}</div><div class="v">${escapeHtml(v)}</div>`)
      .join("")}</div>`;
    kv = [];
  };

  lines.forEach((line) => {
    const t = line.trim();
    if (!t) return;
    if (t.startsWith("[") && t.endsWith("]")) {
      flush();
      html += `<div class="sec">${escapeHtml(t)}</div>`;
      return;
    }
    const eq = t.indexOf("=");
    if (eq > 0) {
      kv.push([t.slice(0, eq + 1).trim(), t.slice(eq + 1).trim()]);
      return;
    }
    flush();
    html += `<div class="prose"><p>${escapeHtml(t)}</p></div>`;
  });
  flush();
  return html;
}

function renderMd(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let list = [];
  let para = [];

  const flushList = () => {
    if (!list.length) return;
    html += `<ul class="list">${list.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
    list = [];
  };
  const flushPara = () => {
    if (!para.length) return;
    html += `<div class="prose"><p>${escapeHtml(para.join(" ")).replace(/\*\*(.+?)\*\*/g, '<span style="color:var(--fg-bright)">$1</span>')}</p></div>`;
    para = [];
  };

  lines.forEach((raw) => {
    const line = raw.replace(/\s+$/, "");
    const t = line.trim();
    if (!t) {
      flushList();
      flushPara();
      return;
    }
    if (t.startsWith("![") && t.includes("](")) {
      flushList();
      flushPara();
      const src = t.slice(t.indexOf("(") + 1, t.lastIndexOf(")"));
      const cap = t.slice(t.indexOf("[") + 1, t.indexOf("]"));
      html += `<div class="plate"><img src="${escapeHtml(src)}" alt="${escapeHtml(cap)}" onerror="this.parentElement.style.display='none'" /><div class="cap">${escapeHtml(cap)}</div></div>`;
      return;
    }
    if (t.startsWith("## ") || t.startsWith("# ")) {
      flushList();
      flushPara();
      html += `<div class="sec">${escapeHtml(t.replace(/^#+ /, ""))}</div>`;
      return;
    }
    if (t.startsWith("- ")) {
      flushPara();
      list.push(t.slice(2));
      return;
    }
    if (/^[a-z0-9+\s/.-]+$/i.test(t) && t.length < 28 && !t.includes(".")) {
      flushList();
      flushPara();
      html += `<div class="sec">${escapeHtml(t)}</div>`;
      return;
    }
    const tab = line.match(/^(\S.+?)\t+(.+)$/) || line.match(/^(\S.{0,18}?)\s{2,}(.+)$/);
    if (tab && !t.startsWith("http")) {
      flushList();
      flushPara();
      html += `<div class="kv"><div class="k">${escapeHtml(tab[1])}</div><div class="v">${escapeHtml(tab[2])}</div></div>`;
      return;
    }
    para.push(t);
  });
  flushList();
  flushPara();
  return html;
}

function renderLua(text) {
  return `<div class="prose"><pre>${escapeHtml(text.trim())}</pre></div>`;
}

function renderFile(id, folder, text) {
  const path = folder ? `${folder} / ${id}` : id;
  const ext = id.split(".").pop();
  let body = "";
  if (ext === "ini") body = renderIni(text);
  else if (ext === "lua") body = renderLua(text);
  else body = renderMd(text);
  return `<div class="path"><span class="path-title">${escapeHtml(path)}</span><span class="caret"></span></div>${body}`;
}
