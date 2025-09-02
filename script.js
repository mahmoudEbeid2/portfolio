/* Portfolio dynamic rendering and theming */
(function () {
  const state = {
    data: null,
  };

  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  function setTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", theme);
    const checkbox = document.getElementById("themeToggle");
    if (checkbox) checkbox.checked = theme === "dark";
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return saved;
    }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    setTheme(initial);
    return initial;
  }

  function toggleMobileMenu() {
    const header = qs(".site-header");
    header.classList.toggle("open");
  }

  // Function to open project by permalink
  function openProjectByPermalink(permalink) {
    if (!state.data || !state.data.projects) return;
    
    const project = state.data.projects.find(p => p.permalink === permalink);
    if (project) {
      openProjectModal(project);
      // Update URL without page reload
      const newUrl = `${window.location.origin}${window.location.pathname}#project-${permalink}`;
      window.history.pushState({ project: permalink }, '', newUrl);
    }
  }

  // Function to copy project link to clipboard
  function copyProjectLink(permalink) {
    const projectUrl = `${window.location.origin}${window.location.pathname}#project-${permalink}`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(projectUrl).then(() => {
        showCopySuccess();
      }).catch(() => {
        fallbackCopyTextToClipboard(projectUrl);
      });
    } else {
      fallbackCopyTextToClipboard(projectUrl);
    }
  }

  // Fallback for older browsers
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }

  // Show copy success message
  function showCopySuccess() {
    const copyBtn = document.querySelector('.copy-link-btn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'تم النسخ!';
      copyBtn.style.backgroundColor = '#28a745';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.backgroundColor = '';
      }, 2000);
    }
  }

  function renderHero(hero) {
    qs("#hero-name").textContent = hero.name;
    qs("#hero-title").textContent = hero.title;
    const avatar = qs("#hero-avatar");
    avatar.src = hero.avatar;
    avatar.alt = hero.name;

    const cta = qs("#hero-cta");
    cta.innerHTML = "";
    const createIcon = (type) => {
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.style.display = "inline-block";
      let path;
      if (type === "github") {
        path = "M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.85 9.71.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.13-1.52-1.13-1.52-.93-.66.07-.65.07-.65 1.03.07 1.57 1.08 1.57 1.08.92 1.61 2.41 1.14 3 .87.09-.69.36-1.14.65-1.4-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.26 9.26 0 0 1 12 7.1c.85 0 1.71.12 2.51.36 1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.11 2.73.64.72 1.02 1.64 1.02 2.76 0 3.95-2.34 4.81-4.57 5.07.37.33.7.98.7 1.98 0 1.43-.01 2.58-.01 2.93 0 .26.18.57.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z";
      } else if (type === "linkedin") {
        path = "M19 3A2.94 2.94 0 0 1 22 6v12a2.94 2.94 0 0 1-3 3H6a2.94 2.94 0 0 1-3-3V6a2.94 2.94 0 0 1 3-3h13zM8.34 18.34V10.5H6v7.84h2.34zM7.17 9.27a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72zM18.34 18.34V14c0-2.31-1.23-3.38-2.88-3.38a2.49 2.49 0 0 0-2.24 1.23h-.03V10.5H10.9c.03.7 0 7.84 0 7.84h2.29v-4.38c0-.23.02-.45.09-.62.2-.45.66-.92 1.43-.92 1.01 0 1.41.7 1.41 1.73v4.19h2.22z";
      } else if (type === "download") {
        // Clean download icon: arrow to tray
        path = "M5 20h14a1 1 0 0 0 1-1v-3h-2v2H6v-2H4v3a1 1 0 0 0 1 1z M12 3l-4 4h3v7h2V7h3l-4-4z";
      } else {
        path = "M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5V3H3v7h2V5z";
      }
      const p = document.createElementNS(ns, "path");
      p.setAttribute("d", path);
      svg.appendChild(p);
      return svg;
    };

    hero.cta.forEach((btn) => {
      const a = document.createElement("a");
      a.href = btn.href;
      a.className = `btn ${btn.variant === "secondary" ? "secondary" : ""}`;
      a.target = btn.external ? "_blank" : "_self";
      a.rel = btn.external ? "noopener" : "";
      const span = document.createElement("span");
      span.textContent = btn.label;
      a.append(span);
      cta.appendChild(a);
    });

    const social = qs("#social-links");
    social.innerHTML = "";
    hero.social.forEach((s) => {
      const a = document.createElement("a");
      a.href = s.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "ghost social-btn";
      const key = (s.label || "").toLowerCase();
      const type = key.includes("github") ? "github" : key.includes("linked") ? "linkedin" : "external";
      const icon = createIcon(type);
      const t = document.createElement("span");
      t.textContent = s.label;
      a.append(icon, t);
      // Append socials into CTA row to be side-by-side
      cta.appendChild(a);
    });
    // Hide the old social container (not used now)
    social.style.display = "none";
  }

  function renderAbout(about) {
    qs("#about-text").textContent = about.summary;
    const list = qs("#highlights");
    list.innerHTML = "";
    about.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      list.appendChild(li);
    });
  }

  function createSkillCard(group) {
    const div = document.createElement("div");
    div.className = "card";
    const title = document.createElement("h3");
    title.textContent = group.category;
    div.appendChild(title);
    const p = document.createElement("p");
    p.textContent = group.note || "";
    div.appendChild(p);
    const box = document.createElement("div");
    group.items.forEach((it) => {
      const span = document.createElement("span");
      span.className = "pill";
      span.textContent = it;
      box.appendChild(span);
    });
    div.appendChild(box);
    return div;
  }

  function renderSkills(skills) {
    const grid = qs("#skills-grid");
    grid.innerHTML = "";
    skills.forEach((group) => grid.appendChild(createSkillCard(group)));
  }

  function renderProjects(projects) {
    const grid = qs("#projects-grid");
    grid.innerHTML = "";
    projects.forEach((proj) => {
      const card = document.createElement("article");
      card.className = "card project-card";
      card.tabIndex = 0;

      if (proj.image) {
        const img = document.createElement("img");
        img.className = "project-thumb";
        img.src = proj.image;
        img.alt = proj.name || "Project image";
        card.appendChild(img);
      }

      const body = document.createElement("div");
      body.className = "project-body";
      const h3 = document.createElement("h3");
      h3.className = "project-title";
      h3.textContent = proj.name;
      const tags = document.createElement("div");
      tags.className = "project-tech";
      proj.tech.forEach((t) => {
        const span = document.createElement("span");
        span.className = "pill";
        span.textContent = t;
        tags.appendChild(span);
      });
      body.append(h3, tags);
      card.appendChild(body);

      card.addEventListener("click", () => openProjectModal(proj));
      card.addEventListener("keypress", (e) => { if (e.key === "Enter") openProjectModal(proj); });
      grid.appendChild(card);
    });
  }

  function openProjectModal(project) {
    const modal = qs("#project-modal");
    const img = qs("#modal-image");
    const title = qs("#modal-title");
    const tech = qs("#modal-tech");
    const desc = qs("#modal-desc");
    const features = qs("#modal-features");
    const linksBox = qs("#modal-links");

    img.src = project.image || "";
    img.alt = project.name || "Project image";
    title.textContent = project.name || "Project";
    tech.innerHTML = "";
    (project.tech || []).forEach((t) => {
      const span = document.createElement("span");
      span.className = "pill";
      span.textContent = t;
      tech.appendChild(span);
    });
    desc.textContent = project.longDescription || project.description || "";
    features.innerHTML = "";
    (project.features || []).forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      features.appendChild(li);
    });
    linksBox.innerHTML = "";

    // Grouped links support: project.linkGroups = [{ title, items: [{label, href, variant}] }]
    if (Array.isArray(project.linkGroups)) {
      project.linkGroups.forEach((group) => {
        const wrapper = document.createElement("div");
        wrapper.className = "modal-links-group";
        if (group.title) {
          const h4 = document.createElement("h4");
          h4.textContent = group.title;
          wrapper.appendChild(h4);
        }
        const row = document.createElement("div");
        row.className = "group-actions";
        (group.items || []).forEach((lnk) => {
          const a = document.createElement("a");
          a.className = "btn" + (lnk.variant === "secondary" ? " secondary" : "");
          a.href = lnk.href; a.target = "_blank"; a.rel = "noopener"; a.textContent = lnk.label || "Open";
          row.appendChild(a);
        });
        wrapper.appendChild(row);
        linksBox.appendChild(wrapper);
      });
    } else if (Array.isArray(project.links)) {
      project.links.forEach((lnk) => {
        const a = document.createElement("a");
        a.className = "btn" + (lnk.variant === "secondary" ? " secondary" : "");
        a.href = lnk.href; a.target = "_blank"; a.rel = "noopener"; a.textContent = lnk.label || "Live";
        linksBox.appendChild(a);
      });
    } else if (project.demo) {
      const a = document.createElement("a");
      a.className = "btn"; a.href = project.demo; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Live Preview";
      linksBox.appendChild(a);
    }
    
    // Add GitHub button if available
    if (project.github && project.github.trim() !== "") {
      const githubBtn = document.createElement("a");
      githubBtn.className = "btn secondary"; 
      githubBtn.href = project.github; 
      githubBtn.target = "_blank"; 
      githubBtn.rel = "noopener"; 
      githubBtn.textContent = "GitHub";
      githubBtn.style.marginLeft = "10px";
      linksBox.appendChild(githubBtn);
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Update URL with project permalink
    if (project.permalink) {
      const newUrl = `${window.location.origin}${window.location.pathname}#project-${project.permalink}`;
      window.history.pushState({ project: project.permalink }, '', newUrl);
    }
  }

  function closeProjectModal() {
    const modal = qs("#project-modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    
    // Remove project from URL when closing modal
    if (window.location.hash.includes('#project-')) {
      const newUrl = window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  }

  function renderExperience(experience) {
    const list = qs("#experience-timeline");
    list.innerHTML = "";
    experience.forEach((item) => {
      const li = document.createElement("li");
      const box = document.createElement("div");
      box.className = "item";
      const header = document.createElement("div");
      header.className = "item-header";
      const logo = document.createElement("img");
      logo.className = "logo";
      logo.alt = item.company || "Company";
      if (item.logo) logo.src = item.logo; else logo.style.display = "none";
      const title = document.createElement("div");
      title.className = "title";
      const roleEl = document.createElement("div");
      roleEl.className = "role";
      roleEl.textContent = item.role;
      const companyEl = document.createElement("div");
      companyEl.className = "company";
      companyEl.textContent = item.company + (item.location ? ` • ${item.location}` : "");
      title.append(roleEl, companyEl);
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `${item.start} • ${item.end}`;
      header.append(logo, title, meta);

      const ul = document.createElement("ul");
      ul.className = "experience-points";
      item.achievements.forEach((a) => {
        const li2 = document.createElement("li");
        li2.textContent = a;
        ul.appendChild(li2);
      });
      box.append(header, ul);
      if (Array.isArray(item.skills) && item.skills.length) {
        const skills = document.createElement("div");
        skills.className = "skills";
        item.skills.forEach((s) => {
          const tag = document.createElement("span");
          tag.className = "pill";
          tag.textContent = s;
          skills.appendChild(tag);
        });
        box.appendChild(skills);
      }
      li.appendChild(box);
      list.appendChild(li);
    });
  }

  function renderEducation(education) {
    const list = qs("#education-list");
    list.innerHTML = "";
    education.forEach((ed) => {
      const li = document.createElement("li");
      li.className = "card edu-card";

      const accent = document.createElement("span");
      accent.className = "edu-accent";

      const icon = document.createElement("div");
      icon.className = "edu-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" role="img" aria-hidden="true"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13L5.5 12 12 8.5 18.5 12 12 16z" fill="currentColor"/></svg>';

      const content = document.createElement("div");
      content.className = "edu-content";

      const title = document.createElement("h3");
      title.textContent = ed.school;

      const degree = document.createElement("div");
      degree.className = "edu-degree";
      degree.textContent = ed.degree;

      // Extract major if embedded in school text ("• Major: ...")
      let majorText = ed.major;
      if (!majorText && typeof ed.school === "string" && ed.school.includes("Major:")) {
        const parts = ed.school.split("Major:");
        if (parts[1]) majorText = parts[1].trim();
      }
      if (majorText) {
        const major = document.createElement("div");
        major.className = "edu-major";
        major.textContent = `Major: ${majorText.replace(/^Major:\s*/i, "")}`;
        content.append(title, degree, major);
      } else {
        content.append(title, degree);
      }

      const meta = document.createElement("div");
      meta.className = "edu-meta";
      meta.textContent = `${ed.start} • ${ed.end}`;

      li.append(accent, icon, content, meta);
      list.appendChild(li);
    });
  }

  function renderContact(contact) {
    const block = qs("#contact-block");
    block.innerHTML = "";
    contact.forEach((c) => {
      const a = document.createElement("a");
      a.href = c.href;
      a.textContent = c.label;
      a.target = c.external ? "_blank" : "_self";
      a.rel = c.external ? "noopener" : "";
      block.appendChild(a);
    });
  }

  function createSocialIcon(platform) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    
    const path = document.createElementNS(ns, "path");
    
    if (platform.includes("github")) {
      path.setAttribute("d", "M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.85 9.71.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.13-1.52-1.13-1.52-.93-.66.07-.65.07-.65 1.03.07 1.57 1.08 1.57 1.08.92 1.61 2.41 1.14 3 .87.09-.69.36-1.14.65-1.4-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.26 9.26 0 0 1 12 7.1c.85 0 1.71.12 2.51.36 1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.11 2.73.64.72 1.02 1.64 1.02 2.76 0 3.95-2.34 4.81-4.57 5.07.37.33.7.98.7 1.98 0 1.43-.01 2.58-.01 2.93 0 .26.18.57.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z");
    } else if (platform.includes("linkedin")) {
      path.setAttribute("d", "M19 3A2.94 2.94 0 0 1 22 6v12a2.94 2.94 0 0 1-3 3H6a2.94 2.94 0 0 1-3-3V6a2.94 2.94 0 0 1 3-3h13zM8.34 18.34V10.5H6v7.84h2.34zM7.17 9.27a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72zM18.34 18.34V14c0-2.31-1.23-3.38-2.88-3.38a2.49 2.49 0 0 0-2.24 1.23h-.03V10.5H10.9c.03.7 0 7.84 0 7.84h2.29v-4.38c0-.23.02-.45.09-.62.2-.45.66-.92 1.43-.92 1.01 0 1.41.7 1.41 1.73v4.19h2.22z");
    } else {
      // Default external link icon
      path.setAttribute("d", "M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5V3H3v7h2V5z");
    }
    
    svg.appendChild(path);
    return svg;
  }

  function renderFooter(text, socialLinks) {
    const footerSocial = qs("#footer-social");
    footerSocial.innerHTML = "";
    
    if (socialLinks && socialLinks.length > 0) {
      const socialContainer = document.createElement("div");
      socialContainer.className = "footer-social-links";
      
      socialLinks.forEach(social => {
        const a = document.createElement("a");
        a.href = social.href;
        a.target = "_blank";
        a.rel = "noopener";
        a.className = "footer-social-link";
        a.setAttribute("aria-label", social.label);
        
        // Create SVG icon based on the social platform
        const icon = createSocialIcon(social.label.toLowerCase());
        a.appendChild(icon);
        
        socialContainer.appendChild(a);
      });
      
      footerSocial.appendChild(socialContainer);
    }
    
    qs("#footer-text").textContent = text;
  }

  async function loadData() {
    const res = await fetch("data.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load data");
    return res.json();
  }

  function hydrate(data) {
    renderHero(data.hero);
    renderAbout(data.about);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderContact(data.contact);
    renderFooter(data.footer, data.hero.social);
  }

  function initEvents() {
    const themeInput = qs("#themeToggle");
    if (themeInput) {
      themeInput.addEventListener("change", (e) => {
        const target = e.currentTarget;
        const next = target.checked ? "dark" : "light";
        setTheme(next);
      });
    }
    const menuBtn = qs("#mobileMenuToggle");
    menuBtn.addEventListener("click", toggleMobileMenu);
    qsa(".site-nav a").forEach((a) => a.addEventListener("click", () => qs(".site-header").classList.remove("open")));

    // Modal events
    const modal = qs("#project-modal");
    const backdrop = modal.querySelector(".modal-backdrop");
    const closeBtn = modal.querySelector(".modal-close");
    backdrop.addEventListener("click", closeProjectModal);
    closeBtn.addEventListener("click", closeProjectModal);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeProjectModal(); });

    // Handle browser back/forward buttons
    window.addEventListener("popstate", (event) => {
      if (event.state && event.state.project) {
        openProjectByPermalink(event.state.project);
      } else {
        closeProjectModal();
      }
    });
  }

  async function init() {
    initTheme();
    initEvents();
    try {
      state.data = await loadData();
      hydrate(state.data);
      
      // Check if there's a project permalink in the URL on page load
      if (window.location.hash.includes('#project-')) {
        const permalink = window.location.hash.replace('#project-', '');
        setTimeout(() => openProjectByPermalink(permalink), 100);
      }
    } catch (e) {
      console.error(e);
      const main = document.querySelector("main");
      const msg = document.createElement("p");
      msg.style.color = "#ff6b6b";
      msg.textContent = "Failed to load data. Make sure data.json exists.";
      main.prepend(msg);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();






