/* ==========================================================================
   The Sunday Ledger — site script
   Edit SITE below to change the newsletter name, author, etc. everywhere.
   ========================================================================== */

const SITE = {
  name: "The Sunday Ledger",          // ← newsletter name
  author: "[First name]",             // ← author first name
  initials: "SL",                     // ← shown in portrait / avatar
  age: 17,
  city: "Lyon",
  email: "hello@yourdomain.com",      // ← contact email
  // Paste your newsletter provider's form endpoint here (Buttondown, Beehiiv,
  // Substack, Mailchimp, Formspree…). Leave empty to run in demo mode.
  formAction: "",
};

/* ---------- Apply config to the page ---------- */
function applyConfig() {
  document.querySelectorAll("[data-site-name]").forEach((el) => (el.textContent = SITE.name));
  document.querySelectorAll("[data-author]").forEach((el) => (el.textContent = SITE.author));
  document.querySelectorAll("[data-initials]").forEach((el) => (el.textContent = SITE.initials));
  document.querySelectorAll("[data-age]").forEach((el) => (el.textContent = SITE.age));
  document.querySelectorAll("[data-city]").forEach((el) => (el.textContent = SITE.city));
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.textContent = SITE.email;
    if (el.tagName === "A") el.href = "mailto:" + SITE.email;
  });
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  if (document.title.includes("The Sunday Ledger")) {
    document.title = document.title.replace("The Sunday Ledger", SITE.name);
  }
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
  document.querySelectorAll(".subscribe-form").forEach((form) => {
    const msg = form.parentElement.querySelector(".form-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      if (!valid) {
        show(msg, "Please enter a valid email address.", "err");
        input.focus();
        return;
      }
      const btn = form.querySelector("button");
      btn.disabled = true;
      try {
        if (SITE.formAction) {
          await fetch(SITE.formAction, {
            method: "POST",
            mode: "no-cors",
            body: new URLSearchParams({ email }),
          });
        }
        show(msg, "You're in. Your first issue lands this Sunday morning.", "ok");
        form.reset();
      } catch (err) {
        show(msg, "Something went wrong. Please try again in a moment.", "err");
      } finally {
        btn.disabled = false;
      }
    });
  });
  function show(el, text, cls) {
    if (!el) return;
    el.textContent = text;
    el.className = "form-msg " + cls;
  }
}

/* ---------- Article filters ---------- */
function initFilters() {
  const btns = document.querySelectorAll(".filter-btn");
  if (!btns.length) return;
  const rows = document.querySelectorAll(".issue-row");
  const count = document.querySelector("[data-count]");
  const apply = (cat) => {
    let n = 0;
    rows.forEach((r) => {
      const show = cat === "all" || r.dataset.category === cat;
      r.hidden = !show;
      if (show) n++;
    });
    btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
    if (count) count.textContent = n + (n === 1 ? " issue" : " issues");
  };
  btns.forEach((b) => b.addEventListener("click", () => apply(b.dataset.filter)));
  const fromHash = location.hash.replace("#", "");
  apply(["recap", "econ", "finance"].includes(fromHash) ? fromHash : "all");
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
