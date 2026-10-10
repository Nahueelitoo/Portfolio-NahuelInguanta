document.querySelectorAll('#lang-es, #lang-en').forEach(button => {
    button.addEventListener('click', () => {
        const language = button.id.endsWith('en') ? 'en' : 'es';
        document.documentElement.lang = language;
        document.querySelectorAll('[data-es]').forEach(element => {
            element.textContent = element.getAttribute(`data-${language}`);
        });
        translateProjectControls();
    });
});

const filters = { category: 'all', status: 'all' };
// Keep paused projects hidden even when visitors change filters.
const cards = document.querySelectorAll('.catalog-card:not([data-catalog-hidden="true"])');
const emptyState = document.getElementById('catalog-empty');

function applyFilters() {
    let visibleCount = 0;
    cards.forEach(card => {
        const categoryMatches = filters.category === 'all' || card.dataset.category === filters.category;
        const statusMatches = filters.status === 'all' || card.dataset.status === filters.status;
        card.hidden = !(categoryMatches && statusMatches);
        if (!card.hidden) visibleCount += 1;
    });
    emptyState.hidden = visibleCount > 0;
}

for (const dimension of ['category', 'status']) {
    const buttons = document.querySelectorAll(`[data-filter-${dimension}]`);
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            filters[dimension] = button.getAttribute(`data-filter-${dimension}`);
            buttons.forEach(filter => {
                filter.setAttribute('aria-pressed', String(filter === button));
            });
            applyFilters();
        });
    });
}

applyFilters();

const projectDialog = document.getElementById('catalog-project');
const projectImage = document.getElementById('catalog-project-image');
const projectGallery = document.getElementById('catalog-project-gallery');
const projectContent = document.getElementById('catalog-project-content');
const closeProjectButton = document.getElementById('catalog-project-close');
let activeCard = null;

function translateProjectControls() {
    const english = document.documentElement.lang === 'en';
    closeProjectButton.setAttribute('aria-label', english ? 'Close project' : 'Cerrar proyecto');
    projectGallery.setAttribute('aria-label', english ? 'Project images' : 'Imágenes del proyecto');
    projectGallery.querySelectorAll('button').forEach((button, index) => {
        button.setAttribute('aria-label', `${english ? 'Show image' : 'Mostrar imagen'} ${index + 1}`);
    });
}

function copyTranslatedText(source, target) {
    target.dataset.es = source.dataset.es || source.textContent.trim();
    target.dataset.en = source.dataset.en || source.textContent.trim();
    target.textContent = target.dataset[document.documentElement.lang === 'en' ? 'en' : 'es'];
}

function openCatalogProject(card) {
    activeCard = card;
    const title = card.querySelector('h2').textContent;
    document.getElementById('catalog-project-title').textContent = title;
    const tags = document.getElementById('catalog-project-tags');
    tags.replaceChildren();
    const statusTag = document.createElement('span');
    statusTag.className = 'project-tag project-tag-status';
    copyTranslatedText(card.querySelector('.project-status'), statusTag);
    tags.append(statusTag);
    const category = card.querySelector('.catalog-category');
    const spanishCategories = category.dataset.es.split('·').map(text => text.trim());
    const englishCategories = category.dataset.en.split('·').map(text => text.trim());
    spanishCategories.forEach((text, index) => {
        const tag = document.createElement('span');
        tag.className = 'project-tag';
        tag.dataset.es = text;
        tag.dataset.en = englishCategories[index] || text;
        tag.textContent = document.documentElement.lang === 'en' ? tag.dataset.en : tag.dataset.es;
        tags.append(tag);
    });
    projectContent.replaceChildren(card.querySelector('.project-detail-content').content.cloneNode(true));
    projectContent.querySelectorAll('[data-es]').forEach(element => {
        element.textContent = element.dataset[document.documentElement.lang === 'en' ? 'en' : 'es'];
    });
    projectGallery.replaceChildren();
    card.dataset.gallery.split('|').forEach((src, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gallery-thumb';
        button.setAttribute('aria-pressed', 'false');
        const image = document.createElement('img');
        image.src = src;
        image.alt = `${title} — ${index + 1}`;
        image.loading = 'lazy';
        button.append(image);
        button.addEventListener('click', () => {
            projectImage.src = src;
            projectImage.alt = image.alt;
            projectGallery.querySelectorAll('button').forEach(thumb => {
                const selected = thumb === button;
                thumb.classList.toggle('is-selected', selected);
                thumb.setAttribute('aria-pressed', String(selected));
            });
        });
        projectGallery.append(button);
        if (index === 0) button.click();
    });
    translateProjectControls();
    projectDialog.showModal();
    projectDialog.scrollTop = 0;
    document.body.classList.add('lightbox-open');
    closeProjectButton.focus();
}

cards.forEach(card => card.addEventListener('click', () => openCatalogProject(card)));
closeProjectButton.addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => {
    if (event.target !== projectDialog) return;
    const bounds = projectDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        projectDialog.close();
    }
});
projectDialog.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    activeCard?.querySelector('.catalog-open').focus();
});

// "Ver detalle completo" on the home page links directly to this project.
function openLinkedProject() {
    const linkedProject = Array.from(cards).find(card => `#${card.id}` === window.location.hash);
    if (linkedProject && !projectDialog.open) openCatalogProject(linkedProject);
}
window.addEventListener('hashchange', openLinkedProject);
openLinkedProject();
