/* ==========================================================================
   Site script. You normally do NOT need to edit this file:
   all your personal information lives in /config.js.
   ========================================================================== */

const C = window.SITE_CONFIG || {};
const A = C.author || {};
const DEFAULT_NAME = "The Sunday Ledger";

const esc = (str) => String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const setText = (sel, val) => {
  if (val === undefined || val === null) return;
  document.querySelectorAll(sel).forEach((el) => (el.textContent = val));
};

/* ---------- Apply config.js to the page ---------- */
function applyConfig() {
  setText("[data-site-name]", C.newsletterName);
  setText("[data-author]", A.firstName);
  setText("[data-fullname]", [A.firstName, A.lastName].filter(Boolean).join(" "));
  setText("[data-school]", A.school);
  document.querySelectorAll("[data-school]").forEach((el) => {
    const row = el.closest("li");
    if (row) row.hidden = !A.school;
  });
  setText("[data-initials]", A.initials);
  setText("[data-age]", A.age);
  setText("[data-city]", A.city);
  setText("[data-studying]", A.studying);
  setText("[data-goal]", A.goal);
  setText("[data-publishing]", C.publishingTime);
  setText("[data-year]", new Date().getFullYear());
  if (C.contactEmail) {
    document.querySelectorAll("[data-email]").forEach((el) => {
      el.textContent = C.contactEmail;
      if (el.tagName === "A") el.href = "mailto:" + C.contactEmail;
    });
  }
  if (C.newsletterName && C.newsletterName !== DEFAULT_NAME) {
    document.title = document.title.split(DEFAULT_NAME).join(C.newsletterName);
  }
  if (C.description) {
    document.querySelectorAll('meta[name="description"][data-default], meta[property="og:description"][data-default]')
      .forEach((m) => m.setAttribute("content", C.description));
  }

  // Portrait photo
  if (A.photo) {
    document.querySelectorAll(".portrait").forEach((el) => {
      el.classList.add("has-photo");
      el.innerHTML = `<img src="${esc(A.photo)}" alt="Portrait of ${esc(A.firstName)}">`;
    });
  }

  // "Why I started" paragraphs (About page)
  const why = document.querySelector("[data-why]");
  if (why && Array.isArray(C.whyIStarted) && C.whyIStarted.length) {
    why.innerHTML = C.whyIStarted.map((p) => `<p>${esc(p)}</p>`).join("");
  }

  // Experiences (About page)
  const tl = document.querySelector("[data-experiences]");
  if (tl && Array.isArray(C.experiences)) {
    tl.innerHTML = C.experiences.map((x) => `
      <li>
        <span class="role">${esc(x.role)}${x.period ? ` <span class="period">· ${esc(x.period)}</span>` : ""}</span>
        <span class="org">${esc(x.organisation)}</span>
        <p>${esc(x.description)}</p>
      </li>`).join("");
  }

  // Social links (footer)
  const soc = C.social || {};
  const labels = { linkedin: "LinkedIn", instagram: "Instagram", x: "X (Twitter)" };
  document.querySelectorAll("[data-social]").forEach((ul) => {
    const items = Object.keys(labels).filter((k) => soc[k]);
    ul.innerHTML = items.map((k) => `<li><a href="${esc(soc[k])}" target="_blank" rel="noopener">${labels[k]}</a></li>`).join("");
    const block = ul.closest("[data-social-block]");
    if (block) block.hidden = items.length === 0;
  });
}

/* ---------- Theme ---------- */
function getTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {}
  return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  document.querySelectorAll(".theme-toggle").forEach((b) => {
    b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  });
}
function initTheme() {
  setTheme(getTheme());
  document.querySelectorAll(".theme-toggle").forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    })
  );
}

/* ---------- Mobile nav ---------- */
function initNav() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------- Subscribe forms ---------- */
function initForms() {
  const sub = C.subscribe || { mode: "demo" };
  document.querySelectorAll(".subscribe-form").forEach((form) => {
    const msg = form.parentElement.querySelector(".form-msg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        show(msg, "Please enter a valid email address.", "err");
        input.focus();
        return;
      }
      if (sub.mode === "form" && sub.url) {
        // Real POST to the provider, opened in a new tab (works without CORS)
        const f = document.createElement("form");
        f.method = "POST";
        f.action = sub.url;
        f.target = "_blank";
        const field = document.createElement("input");
        field.type = "hidden";
        field.name = sub.emailField || "email";
        field.value = email;
        f.appendChild(field);
        document.body.appendChild(f);
        f.submit();
        f.remove();
        show(msg, "Almost there: please confirm your subscription in the tab that just opened, then check your inbox.", "ok");
      } else if (sub.mode === "redirect" && sub.url) {
        const url = sub.url.includes("{email}")
          ? sub.url.replace("{email}", encodeURIComponent(email))
          : sub.url;
        window.open(url, "_blank", "noopener");
        show(msg, "Finish signing up in the tab that just opened.", "ok");
      } else {
        show(msg, "You're in. Your first issue lands this Sunday morning.", "ok");
      }
      form.reset();
    });
  });
  function show(el, text, cls) {
    if (!el) return;
    el.textContent = text;
    el.className = "form-msg " + cls;
  }
}

/* ---------- Archive: category filters, search, month index ---------- */
function initFilters() {
  const btns = document.querySelectorAll(".filter-btn");
  if (!btns.length) return;
  const rows = [...document.querySelectorAll(".issue-row")];
  const months = [...document.querySelectorAll(".archive-month")];
  const years = [...document.querySelectorAll(".archive-year")];
  const count = document.querySelector("[data-count]");
  const empty = document.querySelector(".archive-empty");
  const search = document.getElementById("archive-q");
  const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  rows.forEach((r) => (r.dataset.text = norm(r.textContent)));
  let cat = "all";

  const apply = () => {
    const words = norm(search ? search.value : "").split(/\s+/).filter(Boolean);
    let n = 0;
    rows.forEach((r) => {
      const show = (cat === "all" || r.dataset.category === cat) && words.every((w) => r.dataset.text.includes(w));
      r.hidden = !show;
      if (show) n++;
    });
    months.forEach((m) => {
      const k = m.querySelectorAll(".issue-row:not([hidden])").length;
      m.hidden = k === 0;
      const c = m.querySelector("[data-month-count]");
      if (c) c.textContent = k + (k === 1 ? " issue" : " issues");
      const link = document.querySelector(`[data-month-link="${m.id}"]`);
      if (link) {
        link.closest("li").hidden = k === 0;
        const badge = link.querySelector("span");
        if (badge) badge.textContent = k;
      }
    });
    years.forEach((y) => (y.hidden = !y.querySelector(".archive-month:not([hidden])")));
    document.querySelectorAll(".archive-nav-year").forEach((y) => (y.hidden = !y.querySelector("li:not([hidden])")));
    btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
    if (count) count.textContent = n + (n === 1 ? " issue" : " issues");
    if (empty) empty.hidden = n !== 0;
  };

  btns.forEach((b) => b.addEventListener("click", () => { cat = b.dataset.filter; apply(); }));
  if (search) search.addEventListener("input", apply);
  const fromHash = location.hash.replace("#", "");
  if (["recap", "econ", "finance"].includes(fromHash)) cat = fromHash;
  apply();

  // Highlight the month currently on screen in the "Browse by month" index
  if ("IntersectionObserver" in window && months.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        document.querySelectorAll("[data-month-link]").forEach((a) =>
          a.classList.toggle("active", a.dataset.monthLink === en.target.id));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    months.forEach((m) => io.observe(m));
  }
}

/* ---------- Chart of the Week ---------- */
const CHARTS = {
  inflation: {
    x: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    series: [
      { label: "Inflation (HICP, annual avg.)", cls: "a", values: [0.2, 0.2, 1.5, 1.8, 1.2, 0.3, 2.6, 8.4, 5.4, 2.4] },
      { label: "ECB deposit rate (year-end)", cls: "b", values: [-0.3, -0.4, -0.4, -0.4, -0.5, -0.5, -0.5, 2.0, 4.0, 3.0] },
    ],
    yMin: -1, yMax: 9, yStep: 1, unit: "%",
    annotations: [{ x: 2022, y: 8.4, text: "Energy shock", dx: -10, dy: -14, anchor: "end" }],
  },
};

function renderLineChart(wrap, data) {
  const small = wrap.clientWidth < 520;
  const W = small ? 420 : 720, H = small ? 320 : 400;
  const m = { t: 20, r: small ? 16 : 28, b: 36, l: 36 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const xs = (i) => m.l + (i / (data.x.length - 1)) * iw;
  const ys = (v) => m.t + (1 - (v - data.yMin) / (data.yMax - data.yMin)) * ih;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "chart-svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", wrap.dataset.label || "Line chart");

  let out = '<g class="grid">';
  for (let v = data.yMin; v <= data.yMax; v += data.yStep) {
    out += `<line x1="${m.l}" x2="${W - m.r}" y1="${ys(v)}" y2="${ys(v)}"></line>`;
    out += `<text x="${m.l - 10}" y="${ys(v) + 4}" text-anchor="end">${v}${v === data.yMax ? data.unit : ""}</text>`;
  }
  out += "</g>";
  out += `<line class="zero" x1="${m.l}" x2="${W - m.r}" y1="${ys(0)}" y2="${ys(0)}"></line>`;
  data.x.forEach((x, i) => {
    const show = !small || i % 3 === 0 || i === data.x.length - 1;
    if (show) out += `<text x="${xs(i)}" y="${H - 10}" text-anchor="middle">${x}</text>`;
  });
  data.series.forEach((s) => {
    const d = s.values.map((v, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(" ");
    out += `<path class="line-${s.cls}" d="${d}" pathLength="1"></path>`;
    const li = s.values.length - 1;
    out += `<circle class="dot-${s.cls}" cx="${xs(li)}" cy="${ys(s.values[li])}" r="4"></circle>`;
  });
  (data.annotations || []).forEach((a) => {
    const i = data.x.indexOf(a.x);
    out += `<text class="annot" x="${xs(i) + a.dx}" y="${ys(a.y) + a.dy + 4}" text-anchor="${a.anchor}">${a.text}</text>`;
  });
  out += `<line class="hover-line" x1="0" x2="0" y1="${m.t}" y2="${H - m.b}"></line>`;
  data.series.forEach((s) => (out += `<circle class="hover-dot dot-${s.cls}" r="5" cx="0" cy="0" style="opacity:0"></circle>`));
  out += `<rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent" class="hit"></rect>`;
  svg.innerHTML = out;
  wrap.appendChild(svg);

  // Draw-in animation
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    svg.querySelectorAll("path").forEach((p) => {
      p.style.strokeDasharray = "1";
      p.style.strokeDashoffset = "1";
      p.style.transition = "stroke-dashoffset 1.4s ease";
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          svg.querySelectorAll("path").forEach((p) => (p.style.strokeDashoffset = "0"));
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(svg);
  }

  // Tooltip
  const tip = document.createElement("div");
  tip.className = "chart-tip";
  wrap.appendChild(tip);
  const hit = svg.querySelector(".hit");
  const hl = svg.querySelector(".hover-line");
  const hds = svg.querySelectorAll(".hover-dot");
  const move = (clientX) => {
    const r = svg.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * W;
    const i = Math.max(0, Math.min(data.x.length - 1, Math.round(((px - m.l) / iw) * (data.x.length - 1))));
    const x = xs(i);
    hl.setAttribute("x1", x); hl.setAttribute("x2", x); hl.style.opacity = 1;
    data.series.forEach((s, k) => { hds[k].setAttribute("cx", x); hds[k].setAttribute("cy", ys(s.values[i])); hds[k].style.opacity = 1; });
    tip.innerHTML = `<b>${data.x[i]}</b><br>` + data.series.map((s) => `${s.label}: <b>${s.values[i].toFixed(1)}${data.unit}</b>`).join("<br>");
    const top = Math.min(...data.series.map((s) => ys(s.values[i])));
    tip.style.left = Math.max(r.width * 0.35, Math.min(r.width * 0.65, (x / W) * r.width)) + "px";
    tip.style.top = (top / H) * r.height + "px";
    tip.style.opacity = 1;
  };
  const leave = () => {
    hl.style.opacity = 0; tip.style.opacity = 0;
    hds.forEach((d) => (d.style.opacity = 0));
  };
  hit.addEventListener("mousemove", (e) => move(e.clientX));
  hit.addEventListener("touchstart", (e) => move(e.touches[0].clientX), { passive: true });
  hit.addEventListener("touchmove", (e) => move(e.touches[0].clientX), { passive: true });
  hit.addEventListener("mouseleave", leave);
  hit.addEventListener("touchend", () => setTimeout(leave, 1500));
}

function initCharts() {
  document.querySelectorAll("[data-chart]").forEach((el) => {
    const d = CHARTS[el.dataset.chart];
    if (d) renderLineChart(el, d);
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((e) => io.observe(e));
}

/* ---------- Next Sunday ---------- */
function initNextIssue() {
  const el = document.querySelector("[data-next-issue]");
  if (!el) return;
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  el.textContent = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initTheme();
  initNav();
  initForms();
  initFilters();
  initCharts();
  initReveal();
  initNextIssue();
});
