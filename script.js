// ===== Загрузка прайс-листа =====
fetch('prices.json')
    .then(response => response.json())
    .then(prices => {
        const list = document.getElementById('price-list');

        prices.forEach(item => {
            list.innerHTML += `
                <div>
                  <span>• ${item.time}</span>
                  <span><b>— ${item.price}</b></span>
                </div>
              `;
        });
    })
    .catch(error => console.error('Ошибка загрузки цен:', error));

// Подставляем текущий год автоматически
document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
    // ===== Карусель =====
    const slides = document.querySelectorAll(".carousel-item");
    const dots = document.querySelectorAll(".dot");
    const inner = document.querySelector(".carousel-inner");
    const carouselEl = document.querySelector(".carousel");
    let index = 0;
    let autoSlideInterval;
    let isScrolling = false;

    function showSlide(i) {
        index = (i + slides.length) % slides.length;
        inner.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, n) => dot.classList.toggle("active", n === index));
    }

    function nextSlide() {
        showSlide(index + 1);
    }
    function prevSlide() {
        showSlide(index - 1);
    }

    function autoSlide() {
        autoSlideInterval = setInterval(nextSlide, 10000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlide();
    }

    dots.forEach((dot, i) =>
        dot.addEventListener("click", () => {
            showSlide(i);
            resetAutoSlide();
        })
    );

    carouselEl.addEventListener(
        "wheel",
        (event) => {
            const delta = Math.sign(event.deltaY);
            const rect = carouselEl.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isInViewport) return;
            event.preventDefault();
            if (isScrolling) return;
            isScrolling = true;
            if (delta > 0) nextSlide();
            else prevSlide();
            setTimeout(() => (isScrolling = false), 500);
        },
        { passive: false }
    );

    // Свайпы на мобильных
    let touchStartX = 0,
        touchEndX = 0,
        touchMoved = false,
        swipeTimeout;
    carouselEl.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchMoved = false;
        clearInterval(autoSlideInterval);
        clearTimeout(swipeTimeout);
    });

    carouselEl.addEventListener("touchmove", (e) => {
        touchEndX = e.touches[0].clientX;
        touchMoved = true;
    });

    carouselEl.addEventListener("touchend", () => {
        if (!touchMoved) return;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        swipeTimeout = setTimeout(resetAutoSlide, 5000);
    });

    showSlide(index);
    autoSlide();

    // ===== Анимация появления текста (.fly) =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("show");
        });
    });
    document.querySelectorAll(".fly").forEach((el) => observer.observe(el));

    // ===== Бургер-меню =====
    const burger = document.querySelector(".burger");
    const headerEl = document.querySelector("header");
    const navEl = headerEl.querySelector("nav");

    function openMenu() {
        headerEl.classList.add("active");
        burger.classList.add("active");
        setTimeout(() => navEl.classList.add("show"), 50);
    }

    function closeMenu() {
        navEl.classList.remove("show");
        burger.classList.remove("active");
        headerEl.classList.remove("active");
    }

    burger.addEventListener("click", (e) => {
        e.stopPropagation(); // чтобы клик на бургер не закрывал меню сразу
        if (headerEl.classList.contains("active")) closeMenu();
        else openMenu();
    });

    // Закрытие меню при клике на ссылку и прокрутка
    navEl.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // отключаем стандартный переход

            const targetID = this.getAttribute("href").substring(1);
            const targetEl = document.getElementById(targetID);
            if (!targetEl) return;

            const headerHeight = headerEl.offsetHeight; // высота хедера
            const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            // Закрываем меню после прокрутки
            navEl.classList.remove("show");
            burger.classList.remove("active");
            headerEl.classList.remove("active");
        });
    });

    // Закрытие при клике вне nav
    document.addEventListener("click", (e) => {
        if (!headerEl.contains(e.target)) closeMenu();
    });

    // Закрытие при скролле
    window.addEventListener("scroll", () => {
        if (headerEl.classList.contains("active")) closeMenu();
    });
});
