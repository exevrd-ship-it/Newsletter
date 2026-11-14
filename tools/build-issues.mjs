// Turns every issues/*.md file into a web page, and updates the archive
// (articles.html) and the "Latest issues" cards on the homepage.
// Run automatically by GitHub Actions before each deployment.
// Manual use: node tools/build-issues.mjs
//
// - Files starting with "_" are ignored (templates, drafts).
// - Issues dated in the future are skipped until that day (Paris time),
//   so you can write on Saturday and let Sunday's run publish it.

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const issuesDir = path.join(root, "issues");
const template = fs.readFileSync(path.join(root, "templates", "issue.html"), "utf8");

const CATEGORIES = {
  "weekly recap": { slug: "recap", label: "Weekly Recap" },
  "econ 101": { slug: "econ", label: "Econ 101" },
  "monthly finance": { slug: "finance", label: "Monthly Finance" },
};

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const todayParis = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date()); // YYYY-MM-DD

/* ---------- Tiny Markdown renderer ---------- */
function inline(text) {
  let t = esc(text);
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const ext = /^https?:/.test(href);
    return `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  });
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>");
  return t;
}

function markdown(src) {
  src = src.replace(/<!--[\s\S]*?-->/g, "").replace(/\r\n?/g, "\n");
  const lines = src.split("\n");
  const out = [];
  let i = 0;
  const isBlockStart = (l) => /^(#{2,4}\s|[-*]\s|\d+[.)]\s|>\s?|:::|---\s*$|!\[)/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Callout box  :::box Title ... :::
    const box = line.match(/^:::\s*(?:box)?\s*(.*)$/);
    if (box) {
      const inner = [];
      i++;
      while (i < lines.length && !/^:::\s*$/.test(lines[i])) inner.push(lines[i++]);
      i++;
      out.push(`<div class="callout">${box[1] ? `<h3>${inline(box[1])}</h3>` : ""}${markdown(inner.join("\n"))}</div>`);
      continue;
    }
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) { const n = h[1].length; out.push(`<h${n}>${inline(h[2])}</h${n}>`); i++; continue; }
    if (/^---\s*$/.test(line)) { out.push('<hr class="rule" style="margin:2em 0">'); i++; continue; }

    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/);
    if (img) {
      out.push(`<figure style="margin:2em 0"><img src="${esc(img[2])}" alt="${esc(img[1])}" loading="lazy">${img[1] ? `<figcaption class="form-note">${inline(img[1])}</figcaption>` : ""}</figure>`);
      i++; continue;
    }
    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${inline(q.join(" "))}</blockquote>`);
      continue;
    }
    if (/^[-*]\s/.test(line) || /^\d+[.)]\s/.test(line)) {
      const ordered = /^\d/.test(line);
      const re = ordered ? /^\d+[.)]\s+/ : /^[-*]\s+/;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        let item = lines[i++].replace(re, "");
        while (i < lines.length && /^\s{2,}\S/.test(lines[i])) item += " " + lines[i++].trim();
        items.push(`<li>${inline(item)}</li>`);
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !(para.length && isBlockStart(lines[i]))) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

/* ---------- Read issues ---------- */
function parse(file) {
  const raw = fs.readFileSync(path.join(issuesDir, file), "utf8").replace(/^﻿/, "");
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: the header between the two "---" lines is missing.`);
  const meta = {};
  for (const l of m[1].split("\n")) {
    const kv = l.match(/^\s*([A-Za-z]+)\s*:\s*(.*?)\s*$/);
    if (kv) meta[kv[1].toLowerCase()] = kv[2].replace(/^["']|["']$/g, "");
  }
  const date = meta.date || (file.match(/^\d{4}-\d{2}-\d{2}/) || [])[0];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) throw new Error(`${file}: "date" must look like 2026-11-15.`);
  if (!meta.title) throw new Error(`${file}: "title" is missing.`);
  const cat = CATEGORIES[(meta.category || "Weekly Recap").toLowerCase()];
  if (!cat) throw new Error(`${file}: category must be Weekly Recap, Econ 101 or Monthly Finance.`);
  const body = m[2];
  const words = body.replace(/<!--[\s\S]*?-->/g, "").split(/\s+/).filter(Boolean).length;
  return {
    file, date, cat,
    title: meta.title,
    summary: meta.summary || "",
    number: meta.number ? Number(meta.number) : null,
    read: Number(meta.readingtime) || Math.max(1, Math.round(words / 220)),
    slug: "issue-" + file.replace(/\.md$/i, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    body,
  };
}

const all = fs.readdirSync(issuesDir)
  .filter((f) => f.toLowerCase().endsWith(".md") && !f.startsWith("_"))
  .map(parse)
  .sort((a, b) => a.date.localeCompare(b.date) || a.file.localeCompare(b.file));

all.forEach((it, idx) => { if (!it.number) it.number = idx + 1; });
const published = all.filter((it) => it.date <= todayParis);
const scheduled = all.filter((it) => it.date > todayParis);

const fmt = (iso, opts) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { timeZone: "UTC", ...opts });
const short = (iso) => fmt(iso, { day: "numeric", month: "short", year: "numeric" });

/* ---------- Write issue pages ---------- */
for (const old of fs.readdirSync(root).filter((f) => /^issue-.*\.html$/.test(f))) fs.unlinkSync(path.join(root, old));

published.forEach((it, idx) => {
  const prev = published[idx - 1], next = published[idx + 1];
  const page = template
    .split("{{TITLE}}").join(esc(it.title))
    .split("{{SUMMARY}}").join(esc(it.summary))
    .split("{{CATEGORY}}").join(it.cat.label)
    .split("{{CAT}}").join(it.cat.slug)
    .split("{{NUMBER}}").join(String(it.number))
    .split("{{DATE_ISO}}").join(it.date)
    .split("{{DATE_LONG}}").join(fmt(it.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }))
    .split("{{READ}}").join(String(it.read))
    .split("{{PREV}}").join(prev ? `<a href="${prev.slug}.html">← ${esc(prev.title)}</a>` : `<a href="articles.html">← All issues</a>`)
    .split("{{NEXT}}").join(next ? `<a href="${next.slug}.html">${esc(next.title)} →</a>` : `<a href="chart-of-the-week.html">Chart of the Week →</a>`)
    .split("{{BODY}}").join(markdown(it.body));
  fs.writeFileSync(path.join(root, it.slug + ".html"), page);
});

/* ---------- Archive and homepage ---------- */
const newest = [...published].reverse();
const tagClass = { recap: "tag-recap", econ: "tag-econ", finance: "tag-finance" };

const rows = newest.map((it) => `        <li class="issue-row" data-category="${it.cat.slug}">
          <div class="no">Issue <b>#${it.number}</b></div>
          <div>
            <span class="tag ${tagClass[it.cat.slug]}">${it.cat.label}</span>
            <h2><a href="${it.slug}.html">${esc(it.title)}</a></h2>
            <p>${esc(it.summary)}</p>
          </div>
          <div class="side"><time datetime="${it.date}">${short(it.date)}</time><span>${it.read} min read</span></div>
        </li>`).join("\n");

const cards = newest.slice(0, 3).map((it) => `        <a class="card reveal" href="${it.slug}.html">
          <span class="tag ${tagClass[it.cat.slug]}">${it.cat.label}</span>
          <h3>${esc(it.title)}</h3>
          <p>${esc(it.summary)}</p>
          <div class="meta"><time datetime="${it.date}">${short(it.date)}</time><span class="dot"></span><span>${it.read} min read</span></div>
        </a>`).join("\n");

function between(file, name, content) {
  const p = path.join(root, file);
  const h = fs.readFileSync(p, "utf8");
  const re = new RegExp(`(<!-- ${name}:START -->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(h)) throw new Error(`${file}: markers ${name}:START / ${name}:END not found.`);
  let out = h.replace(re, `$1\n${content}\n$2`);
  if (file === "articles.html") {
    out = out.replace(/(<span data-count>)[^<]*(<\/span>)/, `$1${published.length} issue${published.length === 1 ? "" : "s"}$2`);
  }
  if (file === "index.html" && newest[0]) {
    out = out.replace(/(<span class="ic-date">)[^<]*(<\/span>)/,
      `$1Issue #${newest[0].number} · ${fmt(newest[0].date, { day: "numeric", month: "short" })}$2`);
  }
  fs.writeFileSync(p, out);
}
between("articles.html", "ISSUES", rows);
between("index.html", "LATEST", cards);

console.log(`Published ${published.length} issue(s)` + (scheduled.length ? `, ${scheduled.length} scheduled: ${scheduled.map((s) => s.date + " " + s.title).join(" | ")}` : "") + ".");
