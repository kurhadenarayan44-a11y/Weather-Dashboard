const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const searchForm = document.getElementById("search-form");
const themeToggle = document.getElementById("theme-toggle");
const recentSearches = document.getElementById("recent-searches");
const statusDiv = document.getElementById("status");
const currentCard = document.getElementById("current-card");
const forecastContainer = document.getElementById("forecast-container");

// Returns a readable description for a WMO weather code.
function getCondition(code) {
	if (code === 0) {
		return "Clear sky";
	}
	if (code >= 1 && code <= 3) {
		return "Partly cloudy";
	}
	if (code === 45 || code === 48) {
		return "Fog";
	}
	if (code >= 51 && code <= 67) {
		return "Rain";
	}
	if (code >= 71 && code <= 77) {
		return "Snow";
	}
	if (code >= 80 && code <= 82) {
		return "Showers";
	}
	if (code >= 95) {
		return "Thunderstorm";
	}
	return "Unknown";
}

// Displays a plain-text status message.
function showStatus(message) {
	statusDiv.textContent = message;
}

// Displays the loading indicator and message.
function showSpinner() {
	statusDiv.replaceChildren();

	const spinner = document.createElement("span");
	spinner.classList.add("spinner");
	spinner.setAttribute("aria-hidden", "true");

	const message = document.createElement("span");
	message.textContent = "Loading...";

	statusDiv.append(spinner, message);
}

// Displays an error message safely as text.
function showError(message) {
	statusDiv.replaceChildren();

	const errorMessage = document.createElement("p");
	errorMessage.classList.add("error");
	errorMessage.textContent = message;
	statusDiv.append(errorMessage);
}

// Clears the current weather and forecast results.
function clearResults() {
	currentCard.replaceChildren();
	forecastContainer.replaceChildren();
}

// Renders the selected city's current weather.
function showCurrentWeather(place, current) {
	const article = document.createElement("article");

	const heading = document.createElement("h2");
	heading.textContent = `${place.name}, ${place.country}`;

	const temperature = document.createElement("p");
	temperature.textContent = `${Math.round(current.temperature_2m)} °C`;

	const condition = document.createElement("p");
	condition.textContent = getCondition(current.weather_code);

	const wind = document.createElement("p");
	wind.textContent = `Wind: ${Math.round(current.wind_speed_10m)} km/h`;

	article.append(heading, temperature, condition, wind);
	currentCard.replaceChildren(article);
}

// Renders up to five daily forecast cards.
function showForecast(daily) {
	const daysToShow = Math.min(5, daily.time.length);

	for (let index = 0; index < daysToShow; index += 1) {
		const card = document.createElement("div");
		card.classList.add("forecast-card");

		const day = document.createElement("h3");
		day.textContent = new Date(`${daily.time[index]}T00:00`).toLocaleDateString("en-US", {
			weekday: "short",
		});

		const condition = document.createElement("p");
		condition.textContent = getCondition(daily.weather_code[index]);

		const high = document.createElement("p");
		high.textContent = `High: ${Math.round(daily.temperature_2m_max[index])} °C`;

		const low = document.createElement("p");
		low.textContent = `Low: ${Math.round(daily.temperature_2m_min[index])} °C`;

		card.append(day, condition, high, low);
		forecastContainer.append(card);
	}
}

// Looks up a city's coordinates using the Open-Meteo geocoding API.
async function getCoordinates(city) {
	const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	const data = await response.json();

	if (!data.results || data.results.length === 0) {
		throw new Error("City not found. Check the spelling.");
	}

	const result = data.results[0];
	return {
		name: result.name,
		country: result.country,
		latitude: result.latitude,
		longitude: result.longitude,
	};
}

// Retrieves current conditions and daily forecasts for coordinates.
async function getWeather(latitude, longitude) {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}

	return response.json();
}

// Saves a city in the recent-search list and refreshes its chips.
function saveRecentSearch(city) {
	let recentCities = [];

	try {
		const savedCities = localStorage.getItem("recentCities");
		const parsedCities = savedCities ? JSON.parse(savedCities) : [];
		recentCities = Array.isArray(parsedCities) ? parsedCities : [];
	} catch {
		recentCities = [];
	}

	recentCities = recentCities.filter(
		(savedCity) => typeof savedCity === "string" && savedCity.toLowerCase() !== city.toLowerCase(),
	);
	recentCities.unshift(city);
	recentCities = recentCities.slice(0, 5);

	try {
		localStorage.setItem("recentCities", JSON.stringify(recentCities));
	} catch {
		// Keep the dashboard usable when browser storage is unavailable.
	}

	renderRecentSearches();
}

// Renders saved recent cities as clickable chips.
function renderRecentSearches() {
	let recentCities = [];

	try {
		const savedCities = localStorage.getItem("recentCities");
		const parsedCities = savedCities ? JSON.parse(savedCities) : [];
		recentCities = Array.isArray(parsedCities) ? parsedCities : [];
	} catch {
		recentCities = [];
	}

	recentSearches.replaceChildren();
	recentSearches.hidden = recentCities.length === 0;

	for (const city of recentCities) {
		const chip = document.createElement("button");
		chip.setAttribute("type", "button");
		chip.classList.add("chip");
		chip.textContent = city;
		chip.dataset.city = city;
		recentSearches.append(chip);
	}
}

// Searches a city and updates the current weather and forecast.
async function handleSearch(rawCity) {
	const city = rawCity.trim();

	if (city === "") {
		showStatus("Please enter a city name");
		return;
	}

	showSpinner();
	clearResults();

	try {
		const place = await getCoordinates(city);
		const weather = await getWeather(place.latitude, place.longitude);
		showCurrentWeather(place, weather.current);
		showForecast(weather.daily);
		saveRecentSearch(place.name);
		showStatus("");
	} catch (error) {
		if (error instanceof TypeError) {
			showError("Network error. Please check your internet connection.");
		} else {
			showError(error.message);
		}
	}
}

// Toggles the dark theme and stores the selected preference.
function toggleTheme() {
	const isDark = document.body.classList.toggle("dark-mode");

	try {
		localStorage.setItem("weatherTheme", isDark ? "dark" : "light");
	} catch {
		// Keep the selected theme for this page even when storage is unavailable.
	}

	themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
}

// Applies the previously saved theme preference.
function loadTheme() {
	let savedTheme = "light";

	try {
		savedTheme = localStorage.getItem("weatherTheme") || "light";
	} catch {
		savedTheme = "light";
	}

	const isDark = savedTheme === "dark";
	document.body.classList.toggle("dark-mode", isDark);
	themeToggle.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
}

// Handles city searches submitted from the form.
searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	handleSearch(cityInput.value);
});

// Toggles the page theme when the theme button is clicked.
themeToggle.addEventListener("click", toggleTheme);

// Handles clicks on recent-search chips.
recentSearches.addEventListener("click", (event) => {
	const chip = event.target.closest(".chip");

	if (chip) {
		cityInput.value = chip.dataset.city;
		handleSearch(chip.dataset.city);
	}
});

loadTheme();
renderRecentSearches();
