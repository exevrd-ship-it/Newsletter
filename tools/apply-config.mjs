// Bakes the values from config.js directly into the HTML files, and creates
// sitemap.xml + robots.txt. Run automatically by GitHub Actions before each
// deployment (you don't need to run it yourself). Manual use: node tools/apply-config.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "config.js"), "utf8"), sandbox);
const C = sandbox.window.SITE_CONFIG;
if (!C) throw new Error("config.js: window.SITE_CONFIG not found");
const A = C.author || {};
const url = String(C.siteUrl || "").replace(/\/+$/, "");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Replace the inner text of every simple element carrying data-<attr>
function bake(html, attr, value) {
  if (value === undefined || value === null || value === "") return html;
  const re = new RegExp(`(<(\\w+)\\b[^>]*\\bdata-${attr}\\b[^>]*>)[^<]*(</\\2>)`, "g");
  return html.replace(re, (_, open, _tag, close) => open + esc(value) + close);
}

const pages = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
for (const file of pages) {
  const p = path.join(root, file);
  let h = fs.readFileSync(p, "utf8");

  if (C.newsletterName) h = h.split("The Sunday Ledger").join(esc(C.newsletterName));
  h = bake(h, "author", A.firstName);
  h = bake(h, "fullname", [A.firstName, A.lastName].filter(Boolean).join(" "));
  h = bake(h, "school", A.school);
  if (Array.isArray(C.whyIStarted) && C.whyIStarted.length) {
    h = h.replace(/(<div data-why>)[\s\S]*?(<\/div>)/,
      (_, a, b) => a + C.whyIStarted.map((p) => `<p>${esc(p)}</p>`).join("") + b);
  }
  h = bake(h, "initials", A.initials);
  h = bake(h, "age", A.age);
  h = bake(h, "city", A.city);
  h = bake(h, "studying", A.studying);
  h = bake(h, "goal", A.goal);
  h = bake(h, "publishing", C.publishingTime);
  h = bake(h, "year", new Date().getFullYear());
  if (C.contactEmail) {
    h = h.replace(/mailto:hello@yourdomain\.com/g, "mailto:" + esc(C.contactEmail));
    h = bake(h, "email", C.contactEmail);
  }
  if (C.description) {
    h = h.replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*("[^>]*data-default)/g,
      (_, a, b) => a + esc(C.description) + b);
  }
  if (url) {
    h = h.replace(/content="assets\/og-image\.png"/, `content="${url}/assets/og-image.png"`);
    if (!h.includes('property="og:url"')) {
      const pageUrl = file === "index.html" ? url + "/" : `${url}/${file}`;
      h = h.replace('<meta property="og:type"', `<meta property="og:url" content="${pageUrl}">\n<link rel="canonical" href="${pageUrl}">\n<meta property="og:type"`);
    }
  }
  fs.writeFileSync(p, h);
}

if (url) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.filter((f) => f !== "404.html")
    .map((f) => `  <url><loc>${url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`).join("\n");
  fs.writeFileSync(path.join(root, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`);
}
console.log(`Applied config.js to ${pages.length} pages${url ? " (site URL: " + url + ")" : ""}.`);
