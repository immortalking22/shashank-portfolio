/* ============================================================
 Shashank Agarwal — Architecture Portfolio 2026
 script.js — Refined Interactions
 ============================================================ */

'use strict';

// Load portfolio.json via fetch() - works on GitHub Pages (HTTPS)
// Falls back to embedded data for local file:// testing (browser security blocks fetch on file://)
let PROJECTS = {};

// Embedded fallback data for local testing when fetch fails (file:// protocol)
const PROJECTS_FALLBACK = {"project1":{"title":"9th Semester Academic Project","subtitle":"Residential Design","year":"2026","type":"Residential","location":"India","tools":"AutoCAD · SketchUp · Lumion","area":"Multi-storey","category":"residential","heroGradient":"linear-gradient(135deg, #B8A88C 0%, #7A6A58 100%)","description":["A comprehensive residential design project from 9th Semester.","Complete architectural documentation from site plan to structural drawings."],"details":[{"label":"Type","value":"Residential"},{"label":"Floors","value":"Multi-storey"},{"label":"Semester","value":"9th"}],"heroSrc":"../assets/projects/project1/img/9TH_SEM_C0_ST-7_BY_SA_PAGE-0001.jpg","images":[{"src":"../assets/projects/project1/img/9TH_SEM_C0_ST-7_BY_SA_PAGE-0001.jpg","caption":"9TH SEM C0 ST 7 BY SA PAGE 0001"},{"src":"../assets/projects/project1/img/9TH_SEM_CS_ST-2_BY_SA.jpg","caption":"9TH SEM CS ST 2 BY SA"},{"src":"../assets/projects/project1/img/9TH_SEM_CS_ST-3_BY_SA.jpg","caption":"9TH SEM CS ST 3 BY SA"},{"src":"../assets/projects/project1/img/9TH_SEM_INTRO_ST-1_BY_SA.jpg","caption":"9TH SEM INTRO ST 1 BY SA"},{"src":"../assets/projects/project1/img/9TH_SEM_LS_ST-5_BY_SA.jpg","caption":"9TH SEM LS ST 5 BY SA"},{"src":"../assets/projects/project1/img/9TH_SEM_SA_ST-6_BY_SA.jpg","caption":"9TH SEM SA ST 6 BY SA"},{"src":"../assets/projects/project1/img/ELEVATION.jpg","caption":"ELEVATION"},{"src":"../assets/projects/project1/img/FIRST_FLOOR_PLAN.jpg","caption":"FIRST FLOOR PLAN"},{"src":"../assets/projects/project1/img/FOUTH_FLOOR_PLAN.jpg","caption":"FOUTH FLOOR PLAN"},{"src":"../assets/projects/project1/img/SECOND_FLOOR_PLAN.jpg","caption":"SECOND FLOOR PLAN"},{"src":"../assets/projects/project1/img/SECTION.jpg","caption":"SECTION"},{"src":"../assets/projects/project1/img/SITE_PLAN.jpg","caption":"SITE PLAN"},{"src":"../assets/projects/project1/img/ST-2_(THRUST_AREA).jpg","caption":"ST 2 (THRUST AREA)"},{"src":"../assets/projects/project1/img/TERRACE_FLOOR_PLAN.jpg","caption":"TERRACE FLOOR PLAN"},{"src":"../assets/projects/project1/img/WHATSAPP_IMAGE_2026-03-16_AT_6.11.59_PM.jpeg","caption":"WHATSAPP IMAGE 2026 03 16 AT 6.11.59 PM"}],"downloads":[{"name":"9TH SEM C0 ST 7 BY SA","file":"../assets/projects/project1/download/9TH_SEM_C0_ST-7_BY_SA.pdf","size":"PDF"},{"name":"9TH SEM CS ST 2 BY SA","file":"../assets/projects/project1/download/9TH_SEM_CS_ST-2_BY_SA.pdf","size":"PDF"},{"name":"9TH SEM CS ST 3 BY SA","file":"../assets/projects/project1/download/9TH_SEM_CS_ST-3_BY_SA.pdf","size":"PDF"},{"name":"9TH SEM INTRO ST 1 BY SA","file":"../assets/projects/project1/download/9TH_SEM_INTRO_ST-1_BY_SA.pdf","size":"PDF"},{"name":"9TH SEM LS ST 5 BY SA","file":"../assets/projects/project1/download/9TH_SEM_LS_ST-5_BY_SA.pdf","size":"PDF"},{"name":"9TH SEM SA ST 6 BY SA","file":"../assets/projects/project1/download/9TH_SEM_SA_ST-6_BY_SA.pdf","size":"PDF"},{"name":"ELEVATION","file":"../assets/projects/project1/download/ELEVATION.pdf","size":"PDF"},{"name":"FIRST FLOOR PLAN","file":"../assets/projects/project1/download/FIRST_FLOOR_PLAN.pdf","size":"PDF"},{"name":"FOUTH FLOOR PLAN","file":"../assets/projects/project1/download/FOUTH_FLOOR_PLAN.pdf","size":"PDF"},{"name":"SECOND FLOOR PLAN","file":"../assets/projects/project1/download/SECOND_FLOOR_PLAN.pdf","size":"PDF"},{"name":"SECTION","file":"../assets/projects/project1/download/SECTION.pdf","size":"PDF"},{"name":"SITE PLAN","file":"../assets/projects/project1/download/SITE_PLAN.pdf","size":"PDF"},{"name":"ST 2 (THRUST AREA)","file":"../assets/projects/project1/download/ST-2_(THRUST_AREA).pdf","size":"PDF"},{"name":"STRUCTURE DRAWING","file":"../assets/projects/project1/download/STRUCTURE_DRAWING.pdf","size":"PDF"},{"name":"TERRACE FLOOR PLAN","file":"../assets/projects/project1/download/TERRACE_FLOOR_PLAN.pdf","size":"PDF"}]},"project2":{"title":"Sports Complex","subtitle":"Academic Project","year":"2024","type":"Sports Facility","location":"India","tools":"AutoCAD · SketchUp · Lumion","area":"Masterplan","category":"public","heroGradient":"linear-gradient(135deg, #1b2838 0%, #2a475e 100%)","description":["Sports Complex with pneumatic form structures.","Masterplan with specialized sporting facilities."],"details":[{"label":"Type","value":"Sports Complex"},{"label":"Feature","value":"Pneumatic Structures"},{"label":"Year","value":"2024"}],"heroSrc":"../assets/projects/project2/img/ADMIN_AND_SWIMMING_POOL_BLOCK.jpg","images":[{"src":"../assets/projects/project2/img/ADMIN_AND_SWIMMING_POOL_BLOCK.jpg","caption":"ADMIN AND SWIMMING POOL BLOCK"},{"src":"../assets/projects/project2/img/CASE_STUDY_1.jpg","caption":"CASE STUDY 1"},{"src":"../assets/projects/project2/img/CASE_STUDY_2.jpg","caption":"CASE STUDY 2"},{"src":"../assets/projects/project2/img/CASE_STUDY_3.jpg","caption":"CASE STUDY 3"},{"src":"../assets/projects/project2/img/CONCEPT.jpg","caption":"CONCEPT"},{"src":"../assets/projects/project2/img/MAIN_BUILDING_BLOCK_1.jpg","caption":"MAIN BUILDING BLOCK 1"},{"src":"../assets/projects/project2/img/MAIN_BUILDING_BLOCK_2.jpg","caption":"MAIN BUILDING BLOCK 2"},{"src":"../assets/projects/project2/img/PNEUMATIC_STRUCTURE_2.jpg","caption":"PNEUMATIC STRUCTURE 2"},{"src":"../assets/projects/project2/img/PNEUMATIC_STRUCTURE.jpg","caption":"PNEUMATIC STRUCTURE"},{"src":"../assets/projects/project2/img/SHEET_NO.7.jpg","caption":"SHEET NO.7"},{"src":"../assets/projects/project2/img/SITE_ANALYIS.jpg","caption":"SITE ANALYIS"},{"src":"../assets/projects/project2/img/SITE_PLAN.png","caption":"SITE PLAN"},{"src":"../assets/projects/project2/img/STANDARDS_SHEET.jpg","caption":"STANDARDS SHEET"}],"downloads":[{"name":"ADMIN AND SWIMMING POOL BLOCK","file":"../assets/projects/project2/download/ADMIN_AND_SWIMMING_POOL_BLOCK.png","size":"PNG"},{"name":"CASE STUDY 1","file":"../assets/projects/project2/download/CASE_STUDY_1.png","size":"PNG"},{"name":"CASE STUDY 2","file":"../assets/projects/project2/download/CASE_STUDY_2.png","size":"PNG"},{"name":"CASE STUDY 3","file":"../assets/projects/project2/download/CASE_STUDY_3.png","size":"PNG"},{"name":"CONCEPT","file":"../assets/projects/project2/download/CONCEPT.png","size":"PNG"},{"name":"MAIN BUILDING BLOCK 1","file":"../assets/projects/project2/download/MAIN_BUILDING_BLOCK_1.png","size":"PNG"},{"name":"MAIN BUILDING BLOCK 2","file":"../assets/projects/project2/download/MAIN_BUILDING_BLOCK_2.png","size":"PNG"},{"name":"PNEUMATIC STRUCTURE 2","file":"../assets/projects/project2/download/Pneumatic_Structure_2.png","size":"PNG"},{"name":"PNEUMATIC STRUCTURE","file":"../assets/projects/project2/download/Pneumatic_structure.png","size":"PNG"},{"name":"SHEET NO.7","file":"../assets/projects/project2/download/SHEET_NO.7.png","size":"PNG"},{"name":"SITE ANALYIS","file":"../assets/projects/project2/download/SITE_ANALYIS.png","size":"PNG"},{"name":"SITE PLAN","file":"../assets/projects/project2/download/site_plan.png","size":"PNG"},{"name":"STANDARDS SHEET","file":"../assets/projects/project2/download/STANDARDS_SHEET.png","size":"PNG"}]},"project3":{"title":"Academic Portfolio","subtitle":"Design Studies Collection","year":"2024-2025","type":"Academic Work","location":"India","tools":"AutoCAD · SketchUp · V-Ray","area":"Various","category":"public","heroGradient":"linear-gradient(135deg, #2D3748 0%, #4A5568 100%)","description":["A comprehensive collection of academic work spanning multiple semesters.","Projects range from conceptual explorations to detailed architectural drawings."],"details":[{"label":"Type","value":"Academic Collection"},{"label":"Span","value":"Multiple Semesters"},{"label":"Focus","value":"Design Development"}],"heroSrc":"../assets/projects/project3/img/0.jpg","images":[{"src":"../assets/projects/project3/img/0.jpg","caption":"0"},{"src":"../assets/projects/project3/img/1.jpg","caption":"1"},{"src":"../assets/projects/project3/img/2.jpg","caption":"2"},{"src":"../assets/projects/project3/img/3.jpg","caption":"3"},{"src":"../assets/projects/project3/img/4.jpg","caption":"4"},{"src":"../assets/projects/project3/img/5.jpg","caption":"5"},{"src":"../assets/projects/project3/img/6.jpg","caption":"6"},{"src":"../assets/projects/project3/img/7.png","caption":"7"},{"src":"../assets/projects/project3/img/12.png","caption":"12"},{"src":"../assets/projects/project3/img/13.png","caption":"13"},{"src":"../assets/projects/project3/img/14.png","caption":"14"},{"src":"../assets/projects/project3/img/15.png","caption":"15"},{"src":"../assets/projects/project3/img/16.png","caption":"16"},{"src":"../assets/projects/project3/img/17.png","caption":"17"},{"src":"../assets/projects/project3/img/18.png","caption":"18"},{"src":"../assets/projects/project3/img/19.png","caption":"19"},{"src":"../assets/projects/project3/img/20.png","caption":"20"},{"src":"../assets/projects/project3/img/21.png","caption":"21"},{"src":"../assets/projects/project3/img/22.png","caption":"22"},{"src":"../assets/projects/project3/img/23.png","caption":"23"},{"src":"../assets/projects/project3/img/24.png","caption":"24"},{"src":"../assets/projects/project3/img/25.png","caption":"25"},{"src":"../assets/projects/project3/img/26.png","caption":"26"},{"src":"../assets/projects/project3/img/29.png","caption":"29"},{"src":"../assets/projects/project3/img/30.png","caption":"30"},{"src":"../assets/projects/project3/img/31.png","caption":"31"},{"src":"../assets/projects/project3/img/32.png","caption":"32"},{"src":"../assets/projects/project3/img/33.png","caption":"33"},{"src":"../assets/projects/project3/img/34.png","caption":"34"},{"src":"../assets/projects/project3/img/37.png","caption":"37"},{"src":"../assets/projects/project3/img/38.png","caption":"38"},{"src":"../assets/projects/project3/img/39.png","caption":"39"},{"src":"../assets/projects/project3/img/40.png","caption":"40"},{"src":"../assets/projects/project3/img/41.png","caption":"41"}],"downloads":[]},"project4":{"title":"Pool Design Project","subtitle":"Leisure Facility","year":"2024","type":"Leisure Architecture","location":"India","tools":"AutoCAD · SketchUp · Lumion","area":"Leisure Facility","category":"public","heroGradient":"linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)","description":["Leisure facility designed around a central swimming pool.","Addressing circulation patterns, safety protocols, and user experience."],"details":[{"label":"Type","value":"Leisure Facility"},{"label":"Feature","value":"Swimming Pool"},{"label":"Year","value":"2024"}],"heroSrc":"../assets/projects/project4/img/0.jpg","images":[{"src":"../assets/projects/project4/img/0.jpg","caption":"0"},{"src":"../assets/projects/project4/img/1.jpg","caption":"1"},{"src":"../assets/projects/project4/img/2.jpg","caption":"2"},{"src":"../assets/projects/project4/img/3.jpg","caption":"3"},{"src":"../assets/projects/project4/img/4.jpg","caption":"4"},{"src":"../assets/projects/project4/img/5.jpg","caption":"5"},{"src":"../assets/projects/project4/img/6.jpg","caption":"6"},{"src":"../assets/projects/project4/img/7.jpg","caption":"7"},{"src":"../assets/projects/project4/img/8.jpg","caption":"8"},{"src":"../assets/projects/project4/img/9.jpg","caption":"9"},{"src":"../assets/projects/project4/img/10.jpg","caption":"10"},{"src":"../assets/projects/project4/img/11.jpg","caption":"11"},{"src":"../assets/projects/project4/img/12.jpg","caption":"12"},{"src":"../assets/projects/project4/img/13.jpg","caption":"13"},{"src":"../assets/projects/project4/img/14.jpg","caption":"14"},{"src":"../assets/projects/project4/img/15.jpg","caption":"15"},{"src":"../assets/projects/project4/img/16.jpg","caption":"16"},{"src":"../assets/projects/project4/img/17.jpg","caption":"17"},{"src":"../assets/projects/project4/img/18.jpg","caption":"18"},{"src":"../assets/projects/project4/img/19.jpg","caption":"19"},{"src":"../assets/projects/project4/img/20.jpg","caption":"20"},{"src":"../assets/projects/project4/img/21.jpg","caption":"21"},{"src":"../assets/projects/project4/img/22.jpg","caption":"22"},{"src":"../assets/projects/project4/img/23.jpg","caption":"23"},{"src":"../assets/projects/project4/img/24.jpg","caption":"24"}],"downloads":[]},"project5":{"title":"6th Semester Portfolio","subtitle":"Academic Work","year":"2024","type":"Academic Portfolio","location":"India","tools":"AutoCAD · SketchUp · Photoshop","area":"Various","category":"public","heroGradient":"linear-gradient(135deg, #744210 0%, #B7791F 100%)","description":["Academic portfolio demonstrating spatial thinking and architectural representation.","Collection includes sketches, technical drawings, and digital renderings."],"details":[{"label":"Type","value":"Academic Portfolio"},{"label":"Semester","value":"6th"},{"label":"Focus","value":"Spatial Design"}],"heroSrc":"../assets/projects/project5/img/9.jpg","images":[{"src":"../assets/projects/project5/img/9.jpg","caption":"9"},{"src":"../assets/projects/project5/img/18.jpg","caption":"18"},{"src":"../assets/projects/project5/img/19.jpg","caption":"19"},{"src":"../assets/projects/project5/img/31.jpg","caption":"31"},{"src":"../assets/projects/project5/img/32.jpg","caption":"32"},{"src":"../assets/projects/project5/img/33.jpg","caption":"33"}],"downloads":[{"name":"9","file":"../assets/projects/project5/download/9.jpg","size":"JPG"},{"name":"18","file":"../assets/projects/project5/download/18.jpg","size":"JPG"},{"name":"19","file":"../assets/projects/project5/download/19.jpg","size":"JPG"},{"name":"31","file":"../assets/projects/project5/download/31.jpg","size":"JPG"},{"name":"32","file":"../assets/projects/project5/download/32.jpg","size":"JPG"},{"name":"33","file":"../assets/projects/project5/download/33.jpg","size":"JPG"}]}};

// const PROJECTS_FALLBACK  = require("./../public/portfolio.json")

async function loadProjects() {
  try {
    // Cache-bust with timestamp to avoid serving stale portfolio.json
		const response = await fetch('../public/portfolio.json?v=' + Date.now());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    PROJECTS = await response.json();
    initDynamicProjects();
  } catch (err) {
    // FIX: Fall back to embedded data when fetch fails (e.g., local file:// testing)
    // On GitHub Pages, fetch succeeds and fallback is not used
    console.warn('fetch() failed, using fallback data:', err.message);
    PROJECTS = PROJECTS_FALLBACK;
    initDynamicProjects();
  }
}

// Dynamically render project cards using loaded data
function initDynamicProjects() {
  const showcase = document.getElementById('projectsShowcase');
  if (!showcase) return;

  const projectKeys = Object.keys(PROJECTS);
  const projectCount = projectKeys.length;

  // Update the intro text to show actual project count
  const introText = document.querySelector('.projects-intro');
  if (introText) {
    const countText = projectCount === 1 ? 'one project' :
      projectCount === 2 ? 'two projects' :
      projectCount === 3 ? 'three projects' :
      projectCount === 4 ? 'four projects' :
      `${projectCount} projects`;
    introText.textContent = `${countText} spanning residential design, public architecture, and academic exploration — each a conversation between site, structure, and intention.`;
  }

  showcase.innerHTML = projectKeys.map((key, index) => {
    const proj = PROJECTS[key];
    const num = String(index + 1).padStart(2, '0');
    const stagger = index + 1;
    const typeTag = proj.type || 'Project';
    const yearTag = proj.year || '';

    return `
  <article class="project-module reveal stagger-${stagger}" onclick="openProject('${key}')">
    <div class="project-module-content">
      <div class="project-number">${num}</div>
      <div class="project-details">
        <h3 class="project-name">${proj.title || key}</h3>
        <p class="project-desc">${proj.description ? proj.description[0] : 'Project description.'}</p>
        <div class="project-tags">
          <span>${typeTag}</span>
          ${yearTag ? `<span>${yearTag}</span>` : ''}
        </div>
      </div>
      <div class="project-arrow">↗</div>
    </div>
    <div class="project-module-image">
      ${proj.heroSrc ? `<img src="${proj.heroSrc}" alt="${proj.title}" onerror="this.parentElement.querySelector('.module-image-overlay').style.background='${proj.heroGradient || '#666'}'">` : ''}
      <div class="module-image-overlay"></div>
    </div>
  </article>
  `;
  }).join('');

  initRevealDynamic();
  console.log(`Loaded ${projectCount} projects from ../public/portfolio.json`);
}

function initRevealDynamic() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('#projectsShowcase .reveal').forEach(el => {
    observer.observe(el);
  });
}

/* ===================================================
 NAVIGATION
 =================================================== */
(function initNav() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    nav.classList.toggle('scrolled', currentScroll > 50);
    lastScroll = currentScroll;
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
})();

/* ===================================================
 THEME TOGGLE
 =================================================== */
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ===================================================
 SCROLL REVEAL — Intersection Observer
 =================================================== */
(function initReveal() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-line').forEach(el => {
    observer.observe(el);
  });
})();

/* ===================================================
 PROJECT DETAIL OVERLAY
 =================================================== */
function openProject(key) {
  const project = PROJECTS[key];
  if (!project) return;

  const overlay = document.getElementById('projectDetail');
  const content = document.getElementById('detailContent');

  // Build gallery - paths in JSON are already relative to index.html
  const galleryItems = (project.images || []).map((img, i) => {
    const sheetNum = String(i + 1).padStart(2, '0');
    if (img.src) {
      return `
      <div class="gallery-item" onclick="openLightbox(${i}, '${key}')">
        <div class="gallery-item-corner gallery-item-corner--top"></div>
        <div class="gallery-item-corner gallery-item-corner--bottom"></div>
        <div class="gallery-item-image">
          <img src="${img.src}" alt="${img.caption}" >
        </div>
        <div class="gallery-item-border"></div>
        <div class="gallery-info-bar">
          <div class="gallery-sheet-number">Sheet ${sheetNum}</div>
          <div class="gallery-caption">${img.caption}</div>
        </div>
        <div class="gallery-scale">1:1</div>
      </div>
    `;
    }
    return '';
  }).join('');

  const downloadsHtml = (project.downloads && project.downloads.length) ? `
    <div class="proj-downloads">
      <div class="gallery-title">Downloads</div>
      <div class="downloads-grid">
        ${project.downloads.map(d => `
        <a href="${d.file}" class="download-item" download>
          <span class="download-icon">↓</span>
          <span class="download-name">${d.name}</span>
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--light-gray); margin-left: auto;">${d.size}</span>
        </a>
      `).join('')}
      </div>
    </div>
  ` : '';

  const specsHtml = (project.details || []).map(d => `
    <li>
      <span>${d.label}</span>
      <span>${d.value}</span>
    </li>
  `).join('');

  const heroHtml = project.heroSrc
    ? `<div class="project-detail-hero">
        <img src="${project.heroSrc}" alt="${project.title}" onerror="this.style.display='none'; this.parentElement.style.background='${project.heroGradient}'">
      </div>`
    : `<div class="project-detail-hero" style="background: ${project.heroGradient || '#666'}"></div>`;

  content.innerHTML = `
    ${heroHtml}
    <div class="project-detail-meta">
      <dl class="meta-item">
        <dt>Year</dt>
        <dd>${project.year || 'N/A'}</dd>
      </dl>
      <dl class="meta-item">
        <dt>Type</dt>
        <dd>${project.type || 'Project'}</dd>
      </dl>
      <dl class="meta-item">
        <dt>Location</dt>
        <dd>${project.location || 'India'}</dd>
      </dl>
      <dl class="meta-item">
        <dt>Area</dt>
        <dd>${project.area || 'Various'}</dd>
      </dl>
    </div>
    <div class="project-detail-body">
      <div class="project-description">
        <h2>${project.title || key}<br><span style="font-style: italic; color: var(--accent);">${project.subtitle || ''}</span></h2>
        ${(project.description || []).map(p => `<p>${p}</p>`).join('')}
      </div>
      <div class="project-specs">
        <h4>Project Details</h4>
        <ul class="specs-list">${specsHtml}</ul>
      </div>
    </div>
    <div class="project-gallery">
      <div class="gallery-title">Image Gallery — click to enlarge</div>
      <div class="gallery-grid">${galleryItems}</div>
    </div>
    ${downloadsHtml}
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}

function closeProject() {
  const overlay = document.getElementById('projectDetail');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('detailClose')?.addEventListener('click', closeProject);
document.getElementById('projectDetail')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeProject();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProject();
    closeLightbox();
  }
});

/* ===================================================
 LIGHTBOX
 =================================================== */
let currentLightboxImages = [];
let currentLightboxIndex = 0;

function openLightbox(index, key) {
  const project = PROJECTS[key];
  if (!project) return;

  currentLightboxImages = project.images || [];
  currentLightboxIndex = index;

  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
}

function updateLightbox() {
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const current = currentLightboxImages[currentLightboxIndex];

  if (!current) return;

  img.src = current.src || '';
  img.alt = current.caption || '';
  caption.textContent = `${current.caption || ''} — ${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function lightboxNext() {
  if (currentLightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightbox();
}

function lightboxPrev() {
  if (currentLightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightbox();
}

document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
document.getElementById('lightboxNext')?.addEventListener('click', lightboxNext);
document.getElementById('lightboxPrev')?.addEventListener('click', lightboxPrev);
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowRight') lightboxNext();
  if (e.key === 'ArrowLeft') lightboxPrev();
});

/* ===================================================
 SMOOTH SCROLL
 =================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===================================================
 PARALLAX HERO
 =================================================== */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroGrid = document.querySelector('.hero-grid-bg');
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    if (scrollY < vh) {
      const progress = scrollY / vh;
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - (progress * 0.8);
      if (heroGrid) {
        heroGrid.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    }
  }, { passive: true });
})();

/* ===================================================
 SCROLL VELOCITY DETECTION
 =================================================== */
(function initScrollVelocity() {
  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const velocity = scrollTop - lastScrollTop;
        document.body.style.setProperty('--scroll-velocity', Math.min(Math.abs(velocity) / 10, 1));
        lastScrollTop = scrollTop;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ===================================================
 CUSTOM CURSOR
 =================================================== */
(function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    document.documentElement.style.cursor = 'auto';
    return;
  }

  cursor.style.transform = 'translate3d(-100px, -100px, 0)';

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isActive = false;
  const smoothFactor = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isActive) {
      cursorX = mouseX;
      cursorY = mouseY;
      isActive = true;
      cursor.style.opacity = '1';
    }
  }, { passive: true });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * smoothFactor;
    cursorY += (mouseY - cursorY) * smoothFactor;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverElements = document.querySelectorAll(
    'a, button, [role="button"], input, textarea, select, .project-card, .filter-btn, .gallery-item, .contact-link'
  );

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
})();

// Initialize by fetching portfolio.json on page load
loadProjects();

console.log('Architecture Portfolio — Dynamic Loading · Shashank Agarwal 2026');

