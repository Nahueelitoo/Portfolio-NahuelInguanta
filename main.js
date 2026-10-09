const buttons = {
    es: document.getElementById("lang-es"),
    en: document.getElementById("lang-en")
};

function changeLanguage(language) {
    document.querySelectorAll("[data-es]").forEach(element => {
        element.textContent = element.getAttribute(`data-${language}`);
    });
    document.documentElement.lang = language;
    document.querySelectorAll(".project-card").forEach(card => {
        const suffix = language === "es" ? "Es" : "En";
        card.querySelector(".project-info > span").textContent = card.dataset[`category${suffix}`];
        card.querySelector(".project-info p").textContent = card.dataset[`description${suffix}`];
    });
}

buttons.es.addEventListener("click", () => changeLanguage("es"));
buttons.en.addEventListener("click", () => changeLanguage("en"));

const lightbox = document.getElementById("project-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxImageView = document.getElementById("lightbox-image-view");
const lightboxGallery = document.getElementById("lightbox-gallery");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const detailLink = document.getElementById("lightbox-detail");
const githubLink = document.getElementById("lightbox-github");
let previousFocus = null;
let imageDrag = null;
let ignoreImageClick = false;

function resetImagePan() {
    lightboxImageView.style.setProperty("--pan-x", "0px");
    lightboxImageView.style.setProperty("--pan-y", "0px");
}

lightboxImageView.addEventListener("click", () => {
    if (ignoreImageClick) {
        ignoreImageClick = false;
        return;
    }
    const zoomed = lightboxImageView.classList.toggle("is-zoomed");
    if (!zoomed) resetImagePan();
});
lightboxImageView.addEventListener("pointerdown", event => {
    if (event.button !== 0 || !lightboxImageView.classList.contains("is-zoomed")) return;
    imageDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        panX: parseFloat(lightboxImageView.style.getPropertyValue("--pan-x")) || 0,
        panY: parseFloat(lightboxImageView.style.getPropertyValue("--pan-y")) || 0,
        moved: false
    };
    lightboxImageView.setPointerCapture(event.pointerId);
    lightboxImageView.classList.add("is-dragging");
    event.preventDefault();
});
lightboxImageView.addEventListener("pointermove", event => {
    if (!imageDrag || imageDrag.pointerId !== event.pointerId) return;
    const scale = 1.7;
    const viewWidth = lightboxImageView.clientWidth;
    const viewHeight = lightboxImageView.clientHeight;
    const fitScale = Math.min(viewWidth / lightboxImage.naturalWidth, viewHeight / lightboxImage.naturalHeight);
    const maxX = lightboxImage.naturalWidth * fitScale * (scale - 1) / 2;
    const maxY = lightboxImage.naturalHeight * fitScale * (scale - 1) / 2;
    const panX = Math.max(-maxX, Math.min(maxX, imageDrag.panX + event.clientX - imageDrag.startX));
    const panY = Math.max(-maxY, Math.min(maxY, imageDrag.panY + event.clientY - imageDrag.startY));
    if (Math.abs(event.clientX - imageDrag.startX) > 3 || Math.abs(event.clientY - imageDrag.startY) > 3) imageDrag.moved = true;
    lightboxImageView.style.setProperty("--pan-x", `${panX}px`);
    lightboxImageView.style.setProperty("--pan-y", `${panY}px`);
});
function endImageDrag(event) {
    if (imageDrag?.pointerId !== event.pointerId) return;
    ignoreImageClick = imageDrag.moved;
    imageDrag = null;
    lightboxImageView.classList.remove("is-dragging");
}
lightboxImageView.addEventListener("pointerup", endImageDrag);
lightboxImageView.addEventListener("pointercancel", endImageDrag);

function closeProject() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    if (previousFocus) previousFocus.focus();
}

function openProject(card) {
    const suffix = document.documentElement.lang === "en" ? "En" : "Es";
    const images = card.dataset.gallery.split("|");
    previousFocus = card;
    document.getElementById("lightbox-title").textContent = card.dataset.title;
    document.getElementById("lightbox-category").textContent = card.dataset[`category${suffix}`];
    document.getElementById("lightbox-description").textContent = card.dataset[`description${suffix}`];
    detailLink.href = card.getAttribute("href");
    githubLink.href = card.dataset.github || "#";
    githubLink.hidden = !card.dataset.github;

    lightboxGallery.replaceChildren();
    images.forEach((src, index) => {
        const button = document.createElement("button");
        const image = document.createElement("img");
        button.type = "button";
        button.className = "gallery-thumb";
        button.setAttribute("aria-label", `${suffix === "En" ? "Show image" : "Mostrar imagen"} ${index + 1}`);
        image.alt = `${card.dataset.title} — ${index + 1}`;
        image.src = new URL(src, document.baseURI).href;
        button.append(image);
        button.addEventListener("click", () => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            resetImagePan();
            lightboxGallery.querySelectorAll(".gallery-thumb").forEach(thumb => thumb.classList.remove("is-selected"));
            button.classList.add("is-selected");
        });
        lightboxGallery.append(button);
        if (index === 0) button.click();
    });

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
}

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", event => {
        event.preventDefault();
        openProject(card);
    });
});

lightboxClose.addEventListener("click", closeProject);
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeProject();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeProject();
});
