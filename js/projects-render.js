import projectsContent from "../content/projects/projects.json";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderProjectCard(project) {
  const categories = Array.isArray(project.categories) ? project.categories.join(" ") : "";
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const tagsMarkup = tags
    .map((tag, index) => {
      const className = index === 0 ? "project-card_tag is-gold" : "project-card_tag";
      return `<span class="${className}">${escapeHtml(tag)}</span>`;
    })
    .join("");

  return `
    <a href="#" class="project-card" data-categories="${escapeHtml(categories)}" data-project="${escapeHtml(project.id)}" aria-haspopup="dialog">
      <div class="project-card_image-wrap">
        <img src="${escapeHtml(project.cardImage)}" alt="${escapeHtml(project.cardImageAlt)}" class="project-card_image" loading="lazy">
      </div>
      <div class="project-card_body">
        <div class="project-card_tags">${tagsMarkup}</div>
        <h2 class="project-card_title">${escapeHtml(project.title)}</h2>
        <p class="project-card_desc">${escapeHtml(project.cardDescription)}</p>
        <span class="project-card_link">
          View project
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>
    </a>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("projects-grid");
  const noResults = document.getElementById("no-results");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectModal = document.getElementById("project-modal");
  const modalDialog = projectModal ? projectModal.querySelector(".project-modal_dialog") : null;
  const modalImage = document.getElementById("project-modal-image");
  const modalTags = document.getElementById("project-modal-tags");
  const modalTitle = document.getElementById("project-modal-title");
  const modalSummary = document.getElementById("project-modal-summary");
  const modalDetail = document.getElementById("project-modal-detail");
  const modalHighlights = document.getElementById("project-modal-highlights");
  const modalCta = document.getElementById("project-modal-cta");
  const modalCtaLabel = document.getElementById("project-modal-cta-label");
  const modalCloseButtons = projectModal ? projectModal.querySelectorAll("[data-modal-close='true'], #project-modal-close") : [];
  const orderedProjects = [...projectsContent.projects].sort(function (a, b) {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
  const projectDetails = Object.fromEntries(
    orderedProjects.map(function (project) {
      return [project.id, project];
    })
  );
  let cards = [];
  let activeTrigger = null;

  if (!grid || !noResults || !projectModal || !modalDialog) return;

  grid.innerHTML = orderedProjects.map(renderProjectCard).join("") + noResults.outerHTML;
  const refreshedNoResults = document.getElementById("no-results");
  cards = Array.from(document.querySelectorAll(".project-card[data-categories]"));

  function renderProjectModal(projectId) {
    const project = projectDetails[projectId];
    if (!project) return false;

    modalImage.src = project.cardImage;
    modalImage.alt = project.cardImageAlt;
    modalTitle.textContent = project.title;
    modalSummary.textContent = project.summary;
    modalDetail.textContent = project.detailText;
    modalCta.href = project.ctaHref;
    modalCtaLabel.textContent = project.ctaLabel;

    modalTags.innerHTML = "";
    project.tags.forEach(function (tag, index) {
      const tagEl = document.createElement("span");
      tagEl.className = index === 0 ? "project-card_tag is-gold" : "project-card_tag";
      tagEl.textContent = tag;
      modalTags.appendChild(tagEl);
    });

    modalHighlights.innerHTML = "";
    project.highlights.forEach(function (highlight) {
      const item = document.createElement("li");
      item.className = "project-modal_highlight";
      item.textContent = highlight;
      modalHighlights.appendChild(item);
    });

    return true;
  }

  function openProjectModal(card) {
    const projectId = card.dataset.project;
    if (!projectId || !renderProjectModal(projectId)) return;

    activeTrigger = card;
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("projects-modal-open");
    window.setTimeout(function () {
      modalDialog.focus();
    }, 10);
  }

  function closeProjectModal() {
    if (!projectModal.classList.contains("is-open")) return;

    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("projects-modal-open");
    if (activeTrigger) activeTrigger.focus();
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filter = btn.dataset.filter;

      filterBtns.forEach(function (button) {
        button.classList.remove("is-active");
      });
      btn.classList.add("is-active");

      let visible = 0;
      cards.forEach(function (card) {
        const cats = card.dataset.categories.split(" ");
        const match = filter === "all" || cats.includes(filter);
        card.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });

      refreshedNoResults.classList.toggle("is-visible", visible === 0);
    });
  });

  cards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      openProjectModal(card);
    });
  });

  modalCloseButtons.forEach(function (button) {
    button.addEventListener("click", closeProjectModal);
  });

  projectModal.addEventListener("click", function (e) {
    if (e.target === projectModal) closeProjectModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeProjectModal();
  });
});
