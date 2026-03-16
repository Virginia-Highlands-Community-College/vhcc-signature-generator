/**
 * VHCC Email Signature Generator
 * Main application logic
 */

// ============================================================================
// ACCORDION MANAGEMENT (Multiple accordions)
// ============================================================================
const AccordionManager = {
  init() {
    // Query all accordion buttons dynamically
    const accordionButtons = document.querySelectorAll("[data-accordion-toggle]");
    accordionButtons.forEach((button) => {
      button.addEventListener("click", () => this.toggleAccordion(button));
    });
  },

  toggleAccordion(button) {
    const contentId = button.getAttribute("data-accordion-toggle");
    const content = document.getElementById(contentId);
    const chevron = button.querySelector("svg");

    if (!content) return;

    const isOpen =
      content.style.maxHeight && content.style.maxHeight !== "0px";

    if (isOpen) {
      content.style.maxHeight = "0px";
      if (chevron) chevron.style.transform = "rotate(0deg)";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      if (chevron) chevron.style.transform = "rotate(180deg)";
    }
  },
};

// ============================================================================
// SIGNATURE GENERATOR
// ============================================================================
const SignatureGenerator = {
  init() {
    this.form = document.getElementById("signature-form");
    this.preview = document.getElementById("signature-preview");
    this.copyButton = document.getElementById("copy-button");
    this.messageBox = document.getElementById("message-box");

    this.attachEventListeners();
  },

  attachEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.generateSignature();
    });

    this.copyButton.addEventListener("click", () => this.copySignature());
  },

  getFormData() {
    return {
      name: document.getElementById("name").value,
      title: document.getElementById("title").value,
      unit: document.getElementById("unit").value,
      officeLocation: document.getElementById("officeLocation").value,
      address1: document.getElementById("address1").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      website: document.getElementById("website").value,
      bookingsUrl: document.getElementById("bookingsUrl").value,
      facebookUrl: document.getElementById("facebookUrl").value,
      linkedInURL: document.getElementById("linkedInURL").value,
      instagramURL: document.getElementById("instagramURL").value,
    };
  },

  // Minimal inline styles — only what's strictly needed.
  // Over-declaring (especially border resets) triggers Outlook Web's
  // dark-mode engine to wrap the signature in a contrasting background.
  STYLES: {
    font: "font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 14pt; mso-line-height-rule: exactly;",
    bold: "font-weight: bold;",
    name: "font-weight: bold; font-size: 11pt;",
    link: "color: #3E79BB; text-decoration: underline;",
  },

  /**
   * Creates a styled link element for the signature.
   * @param {string} href - URL
   * @param {string} text - Display text
   * @returns {string} HTML anchor tag
   */
  makeLink(href, text) {
    return `<a href="${href}" style="${this.STYLES.font} ${this.STYLES.link}">${text}</a>`;
  },

  /**
   * Creates a social media link with consistent styling.
   * @param {string} customUrl - User-provided URL (may be empty)
   * @param {string} defaultUrl - Fallback URL
   * @param {string} label - Display label (e.g. "Facebook")
   * @returns {string} HTML anchor tag
   */
  makeSocialLink(customUrl, defaultUrl, label) {
    return this.makeLink(customUrl || defaultUrl, label);
  },

  buildSignatureHTML(data) {
    const {
      name,
      title,
      unit,
      officeLocation,
      address1,
      phone,
      email,
      website,
      bookingsUrl,
      facebookUrl,
      linkedInURL,
      instagramURL,
    } = data;

    const s = this.STYLES;
    const font = s.font;

    const webUrl = website || "https://www.vhcc.edu";
    const webDisplay = website
      ? website.replace(/^https?:\/\//, "")
      : "www.vhcc.edu";

    const officeLine = officeLocation
      ? `<span style="${font}">office:</span> <span style="${font}">${officeLocation}</span><br>`
      : "";

    const bookingsLine = bookingsUrl
      ? `<span style="${font}">book a meeting:</span> ${this.makeLink(bookingsUrl, "Schedule with me")}<br>`
      : "";

    const unitLine = unit ? `<span style="${font}">${unit}</span><br>` : "";

    // Using <br>-separated spans instead of a table.
    // Tables in email signatures cause Outlook Web to inject
    // a contrasting background wrapper in both light and dark mode.
    return `<div style="${font}">
<span style="${font} ${s.name}">${name}</span><br>
<span style="${font}">${title}</span><br>
${unitLine}<span style="${font}">Virginia Highlands Community College</span><br>
  <span style="${font}">${address1 || "P.O. Box 828, Abingdon, VA 24212"}</span><br>
<br>
${officeLine}<span style="${font}">phone:</span> <span style="${font}">${phone || ""}</span><br>
<span style="${font}">email:</span> ${this.makeLink("mailto:" + email, email)}<br>
<span style="${font}">web:</span> ${this.makeLink(webUrl, webDisplay)}<br>
${bookingsLine}<br>
${this.makeSocialLink(facebookUrl, "https://www.facebook.com/VirginiaHighlands", "Facebook")}
&nbsp;
${this.makeSocialLink(instagramURL, "https://www.instagram.com/virginiahighlands_cc", "Instagram")}
&nbsp;
${this.makeSocialLink(linkedInURL, "https://www.linkedin.com/school/virginia-highlands-community-college/", "LinkedIn")}<br>
<br>
<img src="https://virginia-highlands-community-college.github.io/vhcc-signature-generator/assets/logo.png" alt="Virginia Highlands Community College" width="250" style="width: 250px; max-width: 100%; height: auto; display: block;">
</div>`;
  },

  generateSignature() {
    const formData = this.getFormData();
    const signatureHtml = this.buildSignatureHTML(formData);

    this.preview.innerHTML = signatureHtml;
    this.copyButton.style.display = "block";
  },

  copySignature() {
    const html = this.preview.innerHTML;
    const plainText = this.preview.innerText;

    // Use the Clipboard API to write raw HTML directly.
    // This avoids appending to the DOM where the page's background
    // color gets inherited and copied along with the signature.
    const htmlBlob = new Blob([html], { type: "text/html" });
    const textBlob = new Blob([plainText], { type: "text/plain" });

    navigator.clipboard
      .write([
        new ClipboardItem({ "text/html": htmlBlob, "text/plain": textBlob }),
      ])
      .then(() => this.showMessageBox())
      .catch((err) => console.error("Failed to copy", err));
  },

  showMessageBox() {
    this.messageBox.style.opacity = "1";
    this.messageBox.style.transform = "scale(1)";
    setTimeout(() => {
      this.messageBox.style.opacity = "0";
      this.messageBox.style.transform = "scale(0.95)";
    }, 3000);
  },
};

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  AccordionManager.init();
  SignatureGenerator.init();
});
