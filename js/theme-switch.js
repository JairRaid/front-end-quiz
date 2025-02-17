const themeEl = document.getElementById("theme-switch");
const toggleBtn = document.querySelector("#switch");
const sunIcon = document.getElementById("sun");
const moonIcon = document.getElementById("moon");

function initialisation() {
    toggleBtn.checked = false;
    if (toggleBtn.checked) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
}

initialisation();

function setLightTheme() {
    themeEl.setAttribute("href", "./css/styles.css");
    sunIcon.src = "./assets/images/icon-sun-dark.svg";
    sunIcon.alt = "sun dark icon";
    moonIcon.src = "./assets/images/icon-moon-dark.svg";
    moonIcon.src = "./assets/images/icon-moon-dark.svg";
    moonIcon.alt = "moon dark icon";
}

function setDarkTheme() {
    themeEl.setAttribute("href", "./css/dark.css");
    sunIcon.src = "./assets/images/icon-sun-light.svg";
    sunIcon.alt = "sun light icon";
    moonIcon.src = "./assets/images/icon-moon-light.svg";
    moonIcon.src = "./assets/images/icon-moon-light.svg";
    moonIcon.alt = "moon light icon";
}

toggleBtn.addEventListener("click", (event) => {
    if (event.target.checked) {
        setDarkTheme();
    } else {
        setLightTheme();
    }
});
