/* =========================================================
   1. VARIABLES GÉNÉRALES
   ========================================================= */

const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const header = document.getElementById("header");


/* =========================================================
   2. MENU MOBILE
   ========================================================= */

if (menuToggle && nav) {

    menuToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        nav.classList.toggle("open");

        const icon = menuToggle.querySelector("i");

        if (icon) {

            if (nav.classList.contains("open")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

                menuToggle.setAttribute(
                    "aria-label",
                    "Fermer le menu"
                );

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

                menuToggle.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );

            }

        }

    });


    /* Fermer après clic sur un lien */

    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            const icon = menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

            menuToggle.setAttribute(
                "aria-label",
                "Ouvrir le menu"
            );

        });

    });


    /* Fermer en cliquant à l'extérieur */

    document.addEventListener("click", (event) => {

        if (
            nav.classList.contains("open") &&
            !nav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            nav.classList.remove("open");

            const icon = menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });

}


/* =========================================================
   3. HEADER AU SCROLL
   ========================================================= */

if (header) {

    function updateHeader() {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();

}


/* =========================================================
   4. NAVIGATION ACTIVE
   ========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");


function updateActiveNavigation() {

    let currentSection = "";

    const scrollPosition =
        window.scrollY + 180;


    sections.forEach(section => {

        const sectionTop = section.offsetTop;
        const sectionBottom =
            sectionTop + section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (
            href === "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* =========================================================
   5. CAROUSEL
   ========================================================= */

const track =
    document.getElementById("carousel-track");

const prevButton =
    document.getElementById("prev-project");

const nextButton =
    document.getElementById("next-project");

const carousel =
    document.querySelector(".carousel");

let currentIndex = 0;
let visibleCards = 3;
let autoSlide = null;


/* ---------------------------------------------------------
   Déterminer le nombre de cartes visibles
   --------------------------------------------------------- */

function updateVisibleCards() {

    if (window.innerWidth <= 768) {

        visibleCards = 1;

    } else if (window.innerWidth <= 1000) {

        visibleCards = 2;

    } else {

        visibleCards = 3;

    }

}


/* ---------------------------------------------------------
   Récupérer les cartes visibles
   --------------------------------------------------------- */

function getVisibleProjectCards() {

    if (!track) return [];

    return Array.from(
        track.querySelectorAll(".project-card")
    ).filter(card => {

        return window.getComputedStyle(card).display !== "none";

    });

}


/* ---------------------------------------------------------
   Nombre maximum de positions
   --------------------------------------------------------- */

function getMaxIndex() {

    const cards =
        getVisibleProjectCards();

    return Math.max(
        0,
        cards.length - visibleCards
    );

}


/* ---------------------------------------------------------
   Créer automatiquement les dots
   --------------------------------------------------------- */

function createDots() {

    const dotsContainer =
        document.getElementById("carousel-dots");

    if (!dotsContainer) return;

    const cards =
        getVisibleProjectCards();

    const maxIndex =
        Math.max(
            0,
            cards.length - visibleCards
        );

    dotsContainer.innerHTML = "";


    for (
        let i = 0;
        i <= maxIndex;
        i++
    ) {

        const dot =
            document.createElement("button");

        dot.className = "dot";

        dot.type = "button";

        dot.setAttribute(
            "aria-label",
            `Afficher les projets ${i + 1}`
        );


        if (i === currentIndex) {

            dot.classList.add("active");

        }


        dot.addEventListener("click", () => {

            currentIndex = i;

            updateCarousel();

            restartAutoSlide();

        });


        dotsContainer.appendChild(dot);

    }

}


/* ---------------------------------------------------------
   Mettre à jour les dots
   --------------------------------------------------------- */

function updateDots() {

    const dots =
        document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentIndex
        );

    });

}


/* ---------------------------------------------------------
   Déplacer le carousel
   --------------------------------------------------------- */

function updateCarousel() {

    if (!track) return;

    const cards =
        getVisibleProjectCards();

    if (!cards.length) return;


    const firstCard =
        cards[0];

    const cardWidth =
        firstCard.getBoundingClientRect().width;


    /*
     * On récupère le gap réel du CSS.
     */

    const trackStyle =
        window.getComputedStyle(track);

    let gap =
        parseFloat(trackStyle.gap);


    /*
     * Si gap n'est pas disponible,
     * on utilise 25px.
     */

    if (isNaN(gap)) {

        gap = 25;

    }


    const maxIndex =
        Math.max(
            0,
            cards.length - visibleCards
        );


    /*
     * Sécurité
     */

    if (currentIndex > maxIndex) {

        currentIndex = maxIndex;

    }

    if (currentIndex < 0) {

        currentIndex = 0;

    }


    const distance =
        currentIndex *
        (cardWidth + gap);


    track.style.transform =
        `translateX(-${distance}px)`;


    updateDots();

}


/* ---------------------------------------------------------
   Projet suivant
   --------------------------------------------------------- */

function nextProject() {

    if (!track) return;

    const maxIndex =
        getMaxIndex();


    if (maxIndex === 0) {

        currentIndex = 0;

    } else {

        currentIndex++;

        if (currentIndex > maxIndex) {

            currentIndex = 0;

        }

    }


    updateCarousel();

}


/* ---------------------------------------------------------
   Projet précédent
   --------------------------------------------------------- */

function previousProject() {

    if (!track) return;

    const maxIndex =
        getMaxIndex();


    if (maxIndex === 0) {

        currentIndex = 0;

    } else {

        currentIndex--;

        if (currentIndex < 0) {

            currentIndex = maxIndex;

        }

    }


    updateCarousel();

}


/* ---------------------------------------------------------
   Boutons
   --------------------------------------------------------- */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        () => {

            nextProject();

            restartAutoSlide();

        }
    );

}


if (prevButton) {

    prevButton.addEventListener(
        "click",
        () => {

            previousProject();

            restartAutoSlide();

        }
    );

}


/* ---------------------------------------------------------
   Initialisation carousel
   --------------------------------------------------------- */

function initializeCarousel() {

    updateVisibleCards();

    currentIndex = 0;

    createDots();

    updateCarousel();

}


/* ---------------------------------------------------------
   Responsive
   --------------------------------------------------------- */

window.addEventListener(
    "resize",
    () => {

        updateVisibleCards();

        currentIndex = 0;

        createDots();

        updateCarousel();

    }
);


/* =========================================================
   6. AUTO CAROUSEL
   ========================================================= */

function startAutoSlide() {

    if (!nextButton) return;

    clearInterval(autoSlide);

    autoSlide = setInterval(
        () => {

            nextProject();

        },
        5000
    );

}


function stopAutoSlide() {

    clearInterval(autoSlide);

}


function restartAutoSlide() {

    stopAutoSlide();

    startAutoSlide();

}


/* Pause au survol */

if (carousel) {

    carousel.addEventListener(
        "mouseenter",
        stopAutoSlide
    );


    carousel.addEventListener(
        "mouseleave",
        startAutoSlide
    );

}


/* Initialiser */

initializeCarousel();

startAutoSlide();


/* =========================================================
   7. FILTRE DES PROJETS
   ========================================================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const filter =
                button.getAttribute(
                    "data-filter"
                );


            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            const cards =
                document.querySelectorAll(
                    ".project-card"
                );


            cards.forEach(card => {

                const category =
                    card.getAttribute(
                        "data-category"
                    );


                if (
                    filter === "all" ||
                    category === filter
                ) {

                    card.style.display = "";

                } else {

                    card.style.display =
                        "none";

                }

            });


            currentIndex = 0;

            createDots();

            updateCarousel();

            restartAutoSlide();

        }
    );

});


/* =========================================================
   8. EMAILJS
   ========================================================= */

const contactForm =
    document.getElementById("contact-form");

const formMessage =
    document.getElementById("form-message");


/*
 * Vérifier qu'EmailJS est disponible
 */

if (
    typeof emailjs !== "undefined" &&
    contactForm
) {

    /*
     * Initialisation EmailJS
     */

    emailjs.init({
        publicKey: "15udPd9iNNhEt_pt2"
    });


    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /*
             * Éviter plusieurs envois
             */

            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerHTML =
                    'Envoi en cours... <i class="fa-solid fa-spinner fa-spin"></i>';

            }


            /*
             * Message
             */

            if (formMessage) {

                formMessage.textContent =
                    "Envoi du message...";

                formMessage.style.color =
                    "#004d9e";

            }


            /*
             * Envoi EmailJS
             */

            emailjs.sendForm(
                "service_px494uw",
                "template_4gzkrvs",
                contactForm
            )


            /* -------------------------------------------------
               SUCCÈS
               ------------------------------------------------- */

            .then(() => {

                if (formMessage) {

                    formMessage.textContent =
                        "✓ Votre message a été envoyé avec succès !";

                    formMessage.style.color =
                        "green";

                }


                /*
                 * Vider le formulaire
                 */

                contactForm.reset();


                /*
                 * Restaurer le bouton
                 */

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML =
                        'Envoyer le message <i class="fa-solid fa-paper-plane"></i>';

                }

            })


            /* -------------------------------------------------
               ERREUR
               ------------------------------------------------- */

            .catch(error => {

                console.error(
                    "Erreur EmailJS :",
                    error
                );


                if (formMessage) {

                    formMessage.textContent =
                        "✕ Impossible d'envoyer le message. Veuillez réessayer.";

                    formMessage.style.color =
                        "red";

                }


                /*
                 * Restaurer le bouton
                 */

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML =
                        'Envoyer le message <i class="fa-solid fa-paper-plane"></i>';

                }

            });

        }
    );

}


/* =========================================================
   9. ANNÉE AUTOMATIQUE
   ========================================================= */

const currentYear =
    document.getElementById(
        "current-year"
    );


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   10. BARRE DE PROGRESSION DU SCROLL
   ========================================================= */

const scrollProgress =
    document.createElement("div");

scrollProgress.className =
    "scroll-progress";

document.body.prepend(
    scrollProgress
);


function updateScrollProgress() {

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    const progress =
        documentHeight > 0
            ? (window.scrollY / documentHeight) * 100
            : 0;


    scrollProgress.style.width =
        `${progress}%`;

}


window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
);

updateScrollProgress();


/* =========================================================
   11. ANIMATIONS D'APPARITION
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".section-title, " +
        ".service-card, " +
        ".about-image, " +
        ".about-content, " +
        ".project-card, " +
        ".skill-box, " +
        ".timeline-item, " +
        ".cv-card, " +
        ".contact-info, " +
        ".contact-form"
    );


revealElements.forEach(
    (element, index) => {

        element.classList.add(
            "reveal"
        );


        if (index % 4 === 1) {

            element.classList.add(
                "reveal-delay-1"
            );

        }


        if (index % 4 === 2) {

            element.classList.add(
                "reveal-delay-2"
            );

        }


        if (index % 4 === 3) {

            element.classList.add(
                "reveal-delay-3"
            );

        }

    }
);


/*
 * Intersection Observer
 */

if (
    "IntersectionObserver"
    in window
) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "revealed"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    /*
     * Fallback pour vieux navigateurs
     */

    revealElements.forEach(
        element => {

            element.classList.add(
                "revealed"
            );

        }
    );

}


/* =========================================================
   12. BARRES DE COMPÉTENCES ANIMÉES
   ========================================================= */

const skillBars =
    document.querySelectorAll(
        ".skill-bar span"
    );


skillBars.forEach(bar => {

    const width =
        bar.style.width || "0%";


    bar.style.setProperty(
        "--skill-width",
        width
    );


    bar.style.width =
        "0%";

});


const skillsSection =
    document.getElementById(
        "competences"
    );


if (
    skillsSection &&
    "IntersectionObserver" in window
) {

    const skillsObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            const bars =
                                skillsSection.querySelectorAll(
                                    ".skill-bar span"
                                );


                            bars.forEach(
                                bar => {

                                    bar.classList.add(
                                        "is-visible"
                                    );

                                }
                            );


                            skillsObserver.disconnect();

                        }

                    }
                );

            },
            {
                threshold: 0.25
            }
        );


    skillsObserver.observe(
        skillsSection
    );

}


/* =========================================================
   13. LIGHTBOX — AGRANDIR LES IMAGES
   ========================================================= */

const lightbox =
    document.createElement(
        "div"
    );


lightbox.className =
    "image-lightbox";


lightbox.innerHTML = `
    <button
        class="lightbox-close"
        aria-label="Fermer">
        <i class="fa-solid fa-xmark"></i>
    </button>

    <img
        src=""
        alt="Aperçu du projet">
`;


document.body.appendChild(
    lightbox
);


const lightboxImage =
    lightbox.querySelector(
        "img"
    );


const lightboxClose =
    lightbox.querySelector(
        ".lightbox-close"
    );


/*
 * Ouvrir
 */

function openLightbox(
    src,
    alt
) {

    if (!src) return;


    lightboxImage.src =
        src;

    lightboxImage.alt =
        alt || "Aperçu";


    lightbox.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


/*
 * Fermer
 */

function closeLightbox() {

    lightbox.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


/*
 * Images concernées
 */

document.querySelectorAll(
    ".project-image img, " +
    ".about-image img, " +
    ".hero-image img"
).forEach(img => {

    /*
     * Ne pas rendre cliquables
     * les images avec src vide
     */

    if (
        img.getAttribute("src")
    ) {

        img.style.cursor =
            "zoom-in";


        img.addEventListener(
            "click",
            () => {

                openLightbox(
                    img.src,
                    img.alt
                );

            }
        );

    }

});


/*
 * Bouton fermer
 */

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


/*
 * Cliquer sur le fond
 */

lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target === lightbox
        ) {

            closeLightbox();

        }

    }
);


/*
 * Touche Escape
 */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeLightbox();

        }

    }
);


/* =========================================================
   14. BOUTON RETOUR EN HAUT
   ========================================================= */

const backTop =
    document.createElement(
        "button"
    );


backTop.className =
    "back-to-top";


backTop.setAttribute(
    "aria-label",
    "Retour en haut"
);


backTop.innerHTML =
    '<i class="fa-solid fa-arrow-up"></i>';


document.body.appendChild(
    backTop
);


/*
 * Afficher après 500px
 */

window.addEventListener(
    "scroll",
    () => {

        backTop.classList.toggle(
            "show",
            window.scrollY > 500
        );

    },
    { passive: true }
);


/*
 * Retour haut
 */

backTop.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   15. EFFET 3D DES CARTES
   ========================================================= */

if (
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    const cards =
        document.querySelectorAll(
            ".service-card, " +
            ".project-card, " +
            ".skill-box"
        );


    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;


                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;


                const rotateX =
                    -y * 3;


                const rotateY =
                    x * 3;


                card.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX.toFixed(2)}deg)
                     rotateY(${rotateY.toFixed(2)}deg)
                     translateY(-7px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });

}


/* =========================================================
   16. SMOOTH SCROLL
   ========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const targetId =
                link.getAttribute(
                    "href"
                );


            if (
                !targetId ||
                targetId === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(
                    targetId
                );


            if (!target) return;


            event.preventDefault();


            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const targetPosition =
                target.offsetTop -
                headerHeight;


            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        }
    );

});


/* =========================================================
   17. FIN
   ========================================================= */

console.log(
    "✓ Portfolio Safidy Ephraïm chargé avec succès."
);

if (
    typeof emailjs !== "undefined"
) {

    console.log(
        "✓ EmailJS est disponible."
    );

} else {

    console.warn(
        "⚠ EmailJS n'est pas chargé."
    );

}