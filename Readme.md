# 🌦️ Weather Dashboard

A responsive and interactive weather application that allows users to search for any city and view its current weather conditions along with a 5-day weather forecast.

**Live Demo:** https://weatherdashboard-chi.vercel.app/

## 📌 About the Project

Weather Dashboard is a web-based application built using HTML, CSS, and JavaScript. It retrieves real-time weather information using the Open-Meteo API and presents it through a clean, user-friendly interface.

The application also includes dark mode, recent city searches, loading indicators, and error handling to provide a smooth user experience.

## ✨ Features

- **City Search:** Search for cities to retrieve their weather information.
- **Current Weather:** View temperature, weather conditions, and wind speed.
- **5-Day Forecast:** Check daily weather conditions and expected high and low temperatures.
- **Dark and Light Mode:** Switch between themes according to your preference.
- **Recent Searches:** Quickly revisit recently searched cities.
- **Responsive Design:** Access the dashboard on desktop, tablet, and mobile devices.
- **Loading Indicator:** Get visual feedback while weather information loads.
- **Error Handling:** Receive helpful messages for invalid cities and network issues.
- **Persistent Preferences:** Save your selected theme and recent searches using browser local storage.

## 🛠️ Technologies Used

- **HTML5** — Application structure
- **CSS3** — Styling, responsive layouts, and themes
- **JavaScript (ES6+)** — Application logic and API integration
- **Open-Meteo API** — Weather forecasts and geocoding
- **Vercel** — Application deployment
- **Git & GitHub** — Version control and source code management

## 🌐 APIs Used

**1. Open-Meteo Geocoding API**

Used to find a city's geographical coordinates.

https://geocoding-api.open-meteo.com/

**2. Open-Meteo Weather Forecast API**

Used to retrieve current weather conditions and daily forecasts.

https://open-meteo.com/

The project uses these APIs without requiring an API key for its standard public usage.

## 📂 Project Structure

```text
Weather_Dashboard/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 Run Locally

Follow these steps to run the project on your computer.

**Step 1: Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**Step 2: Navigate to the project folder**

```bash
cd Weather_Dashboard
```

**Step 3: Run the application**

Open `index.html` in your browser, or use the Live Server extension in Visual Studio Code.

Make sure you have an active internet connection to retrieve weather data from the APIs.

## 💡 How It Works

1. Enter a city name in the search field.
2. The application retrieves the city's geographical coordinates.
3. It requests current weather information and a 5-day forecast.
4. The results are displayed in weather cards.
5. Recently searched cities are saved in browser local storage.
6. Users can switch between dark and light themes.

## 🎯 Project Objective

The objective of this project is to develop a practical weather application while applying core web development concepts, including DOM manipulation, asynchronous JavaScript, API integration, event handling, responsive CSS, and browser local storage.

## 🔮 Future Improvements

- Add weather icons and more detailed weather information.
- Display humidity and the probability of precipitation.
- Add automatic location-based weather information.
- Improve accessibility and weather data visualization.
- Introduce additional forecast details and unit preferences.

## 👨‍💻 Author

**Hanmant Kurhade**

B.Tech Student | AI & Machine Learning

## 📄 License

This project is available for educational and personal learning purposes. Add a formal open-source license if you intend to distribute the project under specific reuse permissions.