document.documentElement.classList.add("js");

const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const menuLabel = menuToggle.querySelector(".sr-only");
const mainNav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const progressBar = document.querySelector("[data-scroll-progress]");
const backToTop = document.querySelector("[data-back-to-top]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");

const closeMenu = () => {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-label", "Otwórz menu");
  menuToggle.setAttribute("aria-expanded", "false");
  menuLabel.textContent = "Otwórz menu";
  body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const shouldOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  mainNav.classList.toggle("is-open", shouldOpen);
  menuToggle.setAttribute("aria-label", shouldOpen ? "Zamknij menu" : "Otwórz menu");
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  menuLabel.textContent = shouldOpen ? "Zamknij menu" : "Otwórz menu";
  body.classList.toggle("menu-open", shouldOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const updateScrollUi = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  header.classList.toggle("is-scrolled", window.scrollY > 32);
  backToTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.7);
};

let scrollFrame;
window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      updateScrollUi();
      scrollFrame = null;
    });
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) closeMenu();
  updateScrollUi();
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-28% 0px -62%", threshold: 0 },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.1 },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("is-revealed");
  });
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightboxImage.alt = item.dataset.caption;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.showModal();
    body.classList.add("lightbox-open");
  });
});

const closeLightbox = () => {
  lightbox.close();
  body.classList.remove("lightbox-open");
};

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener("close", () => {
  body.classList.remove("lightbox-open");
});

// Beer details tabs
const beerTabs = [...document.querySelectorAll("[data-beer-tab]")];
const beerPanel = document.querySelector("[data-beer-panel]");
const beerDetailKicker = document.querySelector("[data-beer-detail-kicker]");
const beerDetailTitle = document.querySelector("[data-beer-detail-title]");
const beerDetailCopy = document.querySelector("[data-beer-detail-copy]");
const beerDetailProfile = document.querySelector("[data-beer-detail-profile]");
const beerDetailServe = document.querySelector("[data-beer-detail-serve]");
const beerDetails = {
  pilsner: {
    kicker: "Styl 01 / klasyczny wybór",
    title: "Pilsner",
    copy: "Rześki i wytrawny styl z lekką chmielową goryczką. Dobry pierwszy krok w świat piw rzemieślniczych i prosty kompan codziennego spotkania.",
    profile: "Lekki i świeży",
    serve: "Dobrze schłodzony",
  },
  ipa: {
    kicker: "Styl 02 / wyrazisty chmiel",
    title: "IPA",
    copy: "Aromatyczna i zdecydowana. Cytrusowe nuty spotykają się tu z żywiczną goryczką oraz mocniejszym chmielowym finiszem, który zostaje na dłużej.",
    profile: "Cytrusy i goryczka",
    serve: "Do burgera lub grilla",
  },
  lager: {
    kicker: "Styl 03 / spokojna klasyka",
    title: "Lager",
    copy: "Łagodny, czysty i dobrze zbalansowany. Lager stawia na prostotę, delikatny słodowy charakter i lekki finisz, dzięki któremu łatwo do niego wrócić.",
    profile: "Łagodny i czysty",
    serve: "Na spotkanie przy stole",
  },
  wheat: {
    kicker: "Styl 04 / owocowa lekkość",
    title: "Wheat",
    copy: "Pszeniczne piwo o lekkim, owocowym profilu. Jest miękkie, przystępne i przyjemnie świeże, dlatego dobrze łączy się z lekkimi daniami.",
    profile: "Pszeniczny i owocowy",
    serve: "Do sałatki i cytrusów",
  },
  stout: {
    kicker: "Styl 05 / ciemna głębia",
    title: "Stout",
    copy: "Ciemny i aksamitny styl z nutami kawy, palonego słodu oraz kakao. Wolniejszy, deserowy charakter dobrze sprawdza się na spokojny wieczór.",
    profile: "Kawowy i deserowy",
    serve: "Do gorzkiej czekolady",
  },
};

let beerDetailTimer;

const selectBeerTab = (tab, shouldFocus = false) => {
  const details = beerDetails[tab.dataset.beerTab];

  beerTabs.forEach((item) => {
    const isSelected = item === tab;
    item.classList.toggle("is-selected", isSelected);
    item.setAttribute("aria-selected", String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });

  beerPanel.classList.add("is-updating");
  window.clearTimeout(beerDetailTimer);
  beerDetailTimer = window.setTimeout(() => {
    beerPanel.setAttribute("aria-labelledby", tab.id);
    beerDetailKicker.textContent = details.kicker;
    beerDetailTitle.textContent = details.title;
    beerDetailCopy.textContent = details.copy;
    beerDetailProfile.textContent = details.profile;
    beerDetailServe.textContent = details.serve;
    beerPanel.classList.remove("is-updating");
  }, 140);

  if (shouldFocus) tab.focus();
};

beerTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectBeerTab(tab));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + beerTabs.length) % beerTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % beerTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = beerTabs.length - 1;
    selectBeerTab(beerTabs[nextIndex], true);
  });
});

// Counter animation
const counterSection = document.querySelector(".numbers");
const counters = [...document.querySelectorAll("[data-counter]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const showCounterValue = (counter, value) => {
  counter.textContent = `${value}${counter.dataset.counterSuffix || ""}`;
};

const showFinalCounterValues = () => {
  counters.forEach((counter) => showCounterValue(counter, Number(counter.dataset.counter)));
};

const animateCounters = () => {
  const startTime = performance.now();
  const duration = 1250;

  const updateCounters = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    counters.forEach((counter) => {
      const target = Number(counter.dataset.counter);
      showCounterValue(counter, Math.round(target * easedProgress));
    });

    if (progress < 1) requestAnimationFrame(updateCounters);
  };

  requestAnimationFrame(updateCounters);
};

if (counterSection && counters.length) {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    showFinalCounterValues();
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        animateCounters();
        observer.disconnect();
      },
      { threshold: 0.34 },
    );

    counterObserver.observe(counterSection);
  }
}

/* Beer Finder */
const finderButtons = [...document.querySelectorAll("[data-finder-choice]")];
const finderResult = document.querySelector("[data-finder-result]");
const finderRecommendations = {
  ciemne: {
    beer: "Stout",
    text: "Ciemny, aksamitny i kawowy. Dobry wybór, jeśli szukasz głębszego smaku.",
  },
  gorzkie: {
    beer: "IPA",
    text: "Cytrusowa, żywiczna i wyraźnie chmielowa. W sam raz dla fanów goryczki.",
  },
  klasyczne: {
    beer: "Lager",
    text: "Czysty, łagodny i dobrze zbalansowany. Klasyka, do której łatwo wrócić.",
  },
  lekkie: {
    beer: "Pilsner",
    text: "Rześki, wytrawny i lekki. Dobry kierunek na pierwszą degustację.",
  },
  owocowe: {
    beer: "Wheat",
    text: "Lekki, pszeniczny i owocowy. Łagodna propozycja z przyjemnym aromatem.",
  },
};

finderButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    const recommendation = finderRecommendations[button.dataset.finderChoice];

    finderButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    finderResult.classList.add("is-updating");
    window.setTimeout(() => {
      const title = document.createElement("h3");
      const text = document.createElement("p");
      const label = document.createElement("strong");

      title.textContent = recommendation.beer;
      label.textContent = "Nasza rekomendacja: ";
      text.append(label, recommendation.text);
      finderResult.replaceChildren(title, text);
      finderResult.classList.remove("is-updating");
    }, 160);
  });
});

const fieldLabels = {
  email: "Email",
  message: "Wiadomość",
  name: "Imię",
};

document.querySelectorAll("[data-mail-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const lines = [...new FormData(form).entries()].map(([key, value]) => {
      return `${fieldLabels[key] || key}: ${value}`;
    });
    const recipient = form.dataset.recipient;
    const subject = form.dataset.subject;
    const status = form.querySelector("[role='status']");

    if (status) status.textContent = "Otwieramy program pocztowy...";
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n\n"))}`;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
updateScrollUi();
