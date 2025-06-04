import {
    animateColorModeOne,
    animateColorModeTwoWithGradient,
    animateDefaultRedBar
} from './animator.js';

document.addEventListener("DOMContentLoaded", () => {
    const modeSelect = document.getElementById("mode-select");
    const restartBtn = document.getElementById("restart-btn");

    let currentModeClass = modeSelect.value;

    // Функция, чтобы применить выбранный класс и анимацию ко всем прогрессбарам
    function applyModeAndAnimate() {
        document.querySelectorAll(".progress").forEach(bar => {
            // Удаляем все возможные классы режимов
            bar.classList.remove("default", "solid-color-fill", "gradient-fill");

            // Добавляем класс из селекта
            bar.classList.add(currentModeClass);

            const fill = bar.querySelector(".fill");

            // Мгновенно обнуляем без анимации, починил так баг
            fill.style.background = "#333"
            fill.style.backgroundColor = "red"
            fill.style.transition = "none";
            fill.style.width = "0%";
            void fill.offsetWidth;
            fill.style.transition = "width 2s ease, background-color 2s ease";
        });

        setTimeout(() => {
            document.querySelectorAll(".progress").forEach(bar => {
                const percent = parseInt(bar.getAttribute("data-percent")) || 0;
                const fill = bar.querySelector(".fill");

                if (bar.classList.contains("default")) {
                    animateDefaultRedBar(fill, percent);
                } else if (bar.classList.contains("solid-color-fill")) {
                    animateColorModeOne(fill, percent);
                } else if (bar.classList.contains("gradient-fill")) {
                    animateColorModeTwoWithGradient(fill, percent);
                } else {
                    animateDefaultRedBar(fill, percent);
                }
            });
        }, 30);
    }

    modeSelect.addEventListener("change", () => {
        currentModeClass = modeSelect.value;
        applyModeAndAnimate();
    });

    restartBtn.addEventListener("click", () => {
        applyModeAndAnimate();
    });

    applyModeAndAnimate();
});
