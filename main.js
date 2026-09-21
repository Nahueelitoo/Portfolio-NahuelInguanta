const buttons = {
    es: document.getElementById("lang-es"),
    en: document.getElementById("lang-en")
};

function changeLanguage(language) {

    document.querySelectorAll("[data-es]").forEach(element => {
        element.textContent = element.getAttribute(`data-${language}`);
    });

}

buttons.es.addEventListener("click", () => {
    changeLanguage("es");
});

buttons.en.addEventListener("click", () => {
    changeLanguage("en");
});