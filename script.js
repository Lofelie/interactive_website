const modal = document.getElementById("character-modal");
const imageModal = document.getElementById("modal-image");
const boutonFermer = document.getElementById("modal-close");
const cartesPersonnages = document.querySelectorAll(".character-card");
const boutonTheme = document.getElementById("theme-toggle");

boutonTheme.addEventListener("click", function() {
    const modeSombre = document.body.classList.toggle("theme-dark");
    boutonTheme.textContent = modeSombre ? "Mode clair" : "Mode sombre";
    boutonTheme.setAttribute("aria-pressed", String(modeSombre));
});

function fermerModal() {
    if (modal.open) {
        modal.close();
    }
    document.body.style.overflow = "";
}

document.querySelector(".text").addEventListener("click", function(event) {
    const bouton = event.target.closest(".character-title");

    if (!bouton) return;

    imageModal.src = bouton.dataset.image;
    imageModal.alt = bouton.textContent.trim();
    modal.classList.add("is-open");
    modal.showModal();
    document.body.style.overflow = "hidden";
    boutonFermer.focus();
});

boutonFermer.addEventListener("click", fermerModal);

modal.addEventListener("close", function() {
    modal.classList.remove("is-open");
});

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        fermerModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && modal.open) {
        fermerModal();
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
}, {
    threshold: 0.15
});

cartesPersonnages.forEach((carte) => observer.observe(carte));

const megabot = document.querySelector("#megabot-scroll");

function moveMegabot() {
    const cartesVisibles = [...cartesPersonnages]
        .map((carte, index) => ({ index, rect: carte.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight);

    if (cartesVisibles.length === 0) return;

    const screenCenter = window.innerHeight / 2;
    const carteActuelle = cartesVisibles.reduce((plusProche, carte) =>
        Math.abs(carte.rect.top + carte.rect.height / 2 - screenCenter) <
        Math.abs(plusProche.rect.top + plusProche.rect.height / 2 - screenCenter)
            ? carte
            : plusProche
    );

    const tailleImage = 600;
    const aGauche = carteActuelle.index % 2 === 0;

    const espace = aGauche
        ? carteActuelle.rect.left
        : window.innerWidth - carteActuelle.rect.right;

    const x = aGauche
        ? (espace - tailleImage) / 2
        : carteActuelle.rect.right + (espace - tailleImage) / 2;

    const y = carteActuelle.rect.top + (carteActuelle.rect.height - tailleImage) / 2;

    megabot.style.left = `${Math.max(8, Math.min(window.innerWidth - tailleImage - 8, x))}px`;
    megabot.style.top = `${Math.max(8, y)}px`;

    const image = aGauche ? "img/good_megabot.png" : "img/bad_megabot.png";
    if (!megabot.src.endsWith(image)) {
        megabot.style.opacity = "0";
        setTimeout(() => {
            megabot.src = image;
            megabot.style.opacity = "1";
        }, 200);
    }
}

window.addEventListener("scroll", moveMegabot);
window.addEventListener("resize", moveMegabot);
moveMegabot();
