const navLinks = Array.from(document.querySelectorAll(".legal-sidebar_link"));

if (navLinks.length) {
  const sectionMap = new Map();

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href")?.slice(1);
    if (!targetId) return;

    const section = document.getElementById(targetId);
    if (!section) return;

    sectionMap.set(section, link);
  });

  const setActiveLink = (activeSection) => {
    navLinks.forEach((link) => {
      const isActive = link === sectionMap.get(activeSection);
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const sections = Array.from(sectionMap.keys());
  if (sections.length) {
    setActiveLink(sections[0]);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const targetId = link.getAttribute("href")?.slice(1);
        const section = targetId ? document.getElementById(targetId) : null;
        if (section) setActiveLink(section);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length) {
          setActiveLink(visibleEntries[0].target);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}
