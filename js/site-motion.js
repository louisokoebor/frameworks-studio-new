const MOTION_STAGGER_STEP = 85;
const REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");

function shouldSkipElement(element) {
  const inlineStyle = element.getAttribute("style") || "";
  return element.hasAttribute("data-w-id") && inlineStyle.includes("opacity:0");
}

function addRevealElement(element, options = {}) {
  if (!(element instanceof HTMLElement)) return;
  if (element.dataset.motionPrepared === "true") return;
  if (options.skipIfWebflowHidden !== false && shouldSkipElement(element)) return;

  element.classList.add("motion-reveal", options.variant || "motion-fade-up");

  if (options.delay != null) {
    element.style.setProperty("--motion-delay", `${options.delay}ms`);
  }
  if (options.distance) {
    element.dataset.motionDistance = options.distance;
  }
  if (options.threshold != null) {
    element.dataset.motionThreshold = String(options.threshold);
  }

  element.dataset.motionPrepared = "true";
}

function addRevealSelector(selector, options = {}) {
  document.querySelectorAll(selector).forEach((element) => {
    addRevealElement(element, options);
  });
}

function addStaggerGroup(groupSelector, childSelector, options = {}) {
  document.querySelectorAll(groupSelector).forEach((group) => {
    if (!(group instanceof HTMLElement)) return;

    group.classList.add("motion-stagger-group");

    const children =
      childSelector === ":scope > *"
        ? Array.from(group.children)
        : Array.from(group.querySelectorAll(childSelector));

    children.forEach((child, index) => {
      if (!(child instanceof HTMLElement)) return;
      child.classList.add("motion-stagger-item");
      addRevealElement(child, {
        variant: options.variant || "motion-fade-up",
        delay: (options.baseDelay || 0) + index * (options.step || MOTION_STAGGER_STEP),
        distance: options.distance,
        threshold: options.threshold,
        skipIfWebflowHidden: options.skipIfWebflowHidden,
      });
    });
  });
}

function prepareCommonMotionTargets() {
  addRevealSelector(".hero_trust-bar", { delay: 60 });
  addRevealSelector(".services_header");
  addStaggerGroup(".services_grid", ".services_card");
  addRevealSelector(".steps_header");
  addStaggerGroup(".steps_grid", ".steps_card");
  addRevealSelector(".platforms_header");
  addStaggerGroup(".platforms_grid", ".platforms_card");
  addRevealSelector(".common-issue_heading-wrap");
  addStaggerGroup(".common-issue_grid", ".common-issues_card");
  addRevealSelector(".audience_heading-wrap");
  addStaggerGroup(".audience_list", ".audience_list-item");
  addRevealSelector(".audience_image-wrap", { delay: 120, variant: "motion-fade" });
  addRevealSelector(".features_header");
  addStaggerGroup(".features_grid", ".features_item");
  addRevealSelector(".manage_component");
  addRevealSelector(".pricing_header");
  addStaggerGroup(".pricing_grid", ".pricing_card");
  addRevealSelector(".faq_header");
  addStaggerGroup(".faq_grid", ".faq_item");
  addRevealSelector(".section_cta .cta_component");
}

function preparePageSpecificMotionTargets(pathname) {
  if (pathname.endsWith("/projects.html") || pathname === "/projects.html") {
    addRevealSelector(".projects-hero_content");
    addRevealSelector(".projects_filter-bar", { delay: 40 });
    addStaggerGroup("#projects-grid", ".project-card");
    addRevealSelector("#no-results", { variant: "motion-fade", threshold: 0.05 });
  }

  if (pathname.endsWith("/pricing.html") || pathname === "/pricing.html") {
    addRevealSelector(".pricing-hero_content");
    addRevealSelector(".pricing-toolbar_copy");
    addRevealSelector(".pricing-toggle", { delay: 90, variant: "motion-fade" });
    addRevealSelector(".pricing-section_note", { delay: 70, variant: "motion-fade" });
    addRevealSelector(".pricing-comparison_header");
    addRevealSelector(".pricing-comparison_wrap", { delay: 60 });
    addRevealSelector(".pricing-build_header");
    addStaggerGroup(".pricing-build_grid", ".pricing-build_card");
  }

  if (
    pathname.endsWith("/privacy.html") ||
    pathname === "/privacy.html" ||
    pathname.endsWith("/terms.html") ||
    pathname === "/terms.html"
  ) {
    addRevealSelector(".legal-hero_content");
    addRevealSelector(".legal-sidebar");
    addStaggerGroup(".legal-prose", ":scope > section", { step: 70, threshold: 0.08 });
  }
}

function isInInitialViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.top < windowHeight * 0.86 && rect.bottom > 0;
}

function markInitiallyVisible(elements) {
  elements.forEach((element) => {
    if (isInInitialViewport(element)) {
      element.classList.add("is-revealed");
    }
  });
}

function observeRevealElements(elements) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.14,
    }
  );

  elements.forEach((element) => {
    if (!element.classList.contains("is-revealed")) {
      observer.observe(element);
    }
  });
}

function initializeSiteMotion() {
  prepareCommonMotionTargets();
  preparePageSpecificMotionTargets(window.location.pathname);

  const revealElements = Array.from(document.querySelectorAll(".motion-reveal"));
  if (!revealElements.length) return;

  if (REDUCED_MOTION_QUERY.matches) {
    document.documentElement.classList.add("has-site-motion");
    revealElements.forEach((element) => {
      element.classList.add("is-revealed");
    });
    return;
  }

  markInitiallyVisible(revealElements);
  document.documentElement.classList.add("has-site-motion");
  observeRevealElements(revealElements);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSiteMotion);
} else {
  initializeSiteMotion();
}
