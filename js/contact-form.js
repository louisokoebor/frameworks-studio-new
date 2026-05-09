document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form='true']");

  if (!form) return;

  const endpoint = form.getAttribute("data-form-endpoint");
  const formWrapper = form.closest(".contact-form-block");
  const successMessage = formWrapper?.querySelector(".w-form-done");
  const failureMessage = formWrapper?.querySelector(".w-form-fail");
  const submitButton = form.querySelector('input[type="submit"]');
  const projectTypeSelect = form.querySelector(".contact-select");
  const originalButtonLabel = submitButton?.value ?? "Send your message";

  function hideStatusMessages() {
    if (successMessage) successMessage.style.display = "none";
    if (failureMessage) failureMessage.style.display = "none";
  }

  function updateSelectColor() {
    if (!projectTypeSelect) return;
    projectTypeSelect.classList.toggle("has-value", projectTypeSelect.value !== "");
  }

  function setSubmittingState(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("is-disabled", isSubmitting);
    submitButton.value = isSubmitting ? "Sending..." : originalButtonLabel;
  }

  hideStatusMessages();
  updateSelectColor();
  projectTypeSelect?.addEventListener("change", updateSelectColor);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    hideStatusMessages();

    if (!endpoint || endpoint.includes("your-form-id")) {
      if (failureMessage) failureMessage.style.display = "block";
      return;
    }

    if (!form.reportValidity()) {
      return;
    }

    setSubmittingState(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      form.reset();
      updateSelectColor();
      form.style.display = "none";
      if (successMessage) successMessage.style.display = "block";
    } catch (error) {
      console.error("Contact form submission failed:", error);
      if (failureMessage) failureMessage.style.display = "block";
    } finally {
      setSubmittingState(false);
    }
  }, true);
});
