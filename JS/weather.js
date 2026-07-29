let currentWeather = null;

async function getWeather(lat, lon) {
    const apiKey = localStorage.getItem('weatherApiKey') || "YOUR_API_KEY_HERE";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        console.error("No valid API key found for weather API.");
        return null;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error("Error fetching weather data:", response.status, response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function parseWeatherData(data) {
    return {
        condition: data.weather[0].main,
        temp: data.main.temp,
        isNight: data.dt < data.sys.sunset && data.dt > data.sys.sunrise ? false : true
    };
}

function displayWeather(weather) {
    const weatherElement = document.getElementById("weather");
    if (!localStorage.getItem('weatherApiKey')) {
        weatherElement.textContent = "No API key set for weather data";
        return;
    }
    if (!weather) {
        weatherElement.textContent = "Weather data unavailable";
    } else {
        weatherElement.textContent = `${weather.condition}, ${weather.temp}°C, ${weather.isNight ? "Night" : "Day"}`;
    }
}

function updateWeather() {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const rawData = await getWeather(lat, lon);

            if (!rawData) {
                displayWeather(null);
                return;
            }

            const parsed = parseWeatherData(rawData);
            currentWeather = parsed;
            displayWeather(parsed);
        },
        (error) => {
            console.error("Error getting geolocation:", error);
            currentWeather = null;
            displayWeather(null);
        }
    );
}

const apiKeyInput = document.getElementById('apiKey');
apiKeyInput.value = localStorage.getItem('weatherApiKey') || "";
updateWeather();