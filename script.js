// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Contact form — submits to Web3Forms (https://web3forms.com) via fetch so the
// page never redirects. Requires a real access_key in the hidden input in index.html.
const form = document.querySelector(".contact-form");
if (form) {
  const sendBtn = form.querySelector(".send-btn");
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const accessKey = form.querySelector('[name="access_key"]').value;
    if (!accessKey || accessKey === "YOUR-WEB3FORMS-ACCESS-KEY") {
      status.dataset.state = "error";
      status.textContent = "Form isn't set up yet — add a Web3Forms access key in index.html.";
      return;
    }

    sendBtn.disabled = true;
    status.dataset.state = "";
    status.textContent = "Sending…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const result = await res.json();

      if (result.success) {
        status.dataset.state = "success";
        status.textContent = "Thanks — your message has been sent!";
        form.reset();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      status.dataset.state = "error";
      status.textContent = "Something went wrong — please try again or email directly.";
    } finally {
      sendBtn.disabled = false;
    }
  });
}
