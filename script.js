/* VARIABLES */
let score = 0;
let streak = 0;
let correctID = 0;
let flagButtons = [];
let allCountries = {};
let countryKeys = [];

/* FUNCTIONS */
async function setup() {
    await getCountriesJSON();
    document.getElementById("start-button").addEventListener("click", startGame);
    flagButtons = document.getElementsByClassName("flag-button");
    for (let button of flagButtons) {
        button.addEventListener("click", selectedFlag);
    }
}

async function getCountriesJSON() {
    try {
        let response = await fetch("country.json");
        allCountries = await response.json();
        countryKeys = Object.keys(allCountries);
    } catch (error) {
        console.error("Error fetching country data:", error);
    }
}

function startGame() {
    if (!countryKeys.length) {
        alert("Country data is still loading. Please wait a moment.");
        return;
    }
    document.querySelector(".start-container").style.display = "none";
    document.querySelector(".game-container").style.display = "flex";
    score = 0;
    streak = 0;
    drawFlag();
}

class Country {
    constructor(name, code) {
        this.name = name;
        this.code = code;
        this.flagUrl = `https://flagcdn.com/w320/${this.code}.png`;
    }
}

function selectedFlag(e) {
    let isCorrect = parseInt(e.target.id) === correctID;

    if (isCorrect) {
        streak++;
        score++;
        drawFlag();
    } else {
        gameOver();
    }

    document.getElementById("score-label").innerHTML = `Streak: ${streak}`;
}

function drawFlag() {
    // Choose a random correct country from the full list
    let randomIndex = Math.floor(Math.random() * countryKeys.length);
    let correctCode = countryKeys[randomIndex];
    let currentCountry = new Country(allCountries[correctCode], correctCode);

    // Set the flag image source to the correct country's flag
    document.getElementById("flag").src = currentCountry.flagUrl;

    // Build the answer options including the correct country
    let options = new Set([currentCountry]);
    while (options.size < 4) {
        let randIdx = Math.floor(Math.random() * countryKeys.length);
        let code = countryKeys[randIdx];
        // Only add if this country isn’t already in the options
        if (!Array.from(options).some(c => c.code === code)) {
            options.add(new Country(allCountries[code], code));
        }
    }

    let shuffledOptions = Array.from(options);
    shuffle(shuffledOptions);

    // Assign option text to the flag buttons and store the id for the correct answer
    shuffledOptions.forEach((country, index) => {
        let buttonId = (index + 1).toString();
        document.getElementById(buttonId).innerHTML = country.name;
        if (country.name === currentCountry.name) {
            correctID = index + 1;
        }
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function gameOver() {
    document.querySelector(".game-container").style.display = "none";
    document.querySelector(".result-container").style.display = "flex";
    document.getElementById("final-streak").innerText = streak;
    document.getElementById("restart-button").addEventListener("click", restartGame);
}

function restartGame() {
    location.reload();
}

/* START */
setup();
