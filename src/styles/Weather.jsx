import { useState } from "react";
import "./Weather.css";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    const query = city.trim();

    if (!query) {
      setError("Enter a city or location to search.");
      return;
    }

    if (!apiKey) {
      setError("Weather API key is missing. Add VITE_OPENWEATHER_API_KEY to .env.local.");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const params = new URLSearchParams({
        q: query,
        appid: apiKey,
        units: "metric",
      });
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("We couldn't find that location. Check the spelling and try again.");
        }
        if (response.status === 401) {
          throw new Error("The weather API key was rejected. Check that it is active and correct.");
        }
        throw new Error(data.message || "Weather is unavailable right now. Please try again.");
      }

      setWeatherData(data);
    } catch (fetchError) {
      setError(fetchError instanceof TypeError
        ? "Couldn't connect to the weather service. Check your internet connection and try again."
        : fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="weather-app">
      <header className="weather-header">
        <a className="weather-brand" href="#" aria-label="Daylight weather home">
          <span className="weather-brand-icon" aria-hidden="true">☼</span>
          <span>daylight<span className="weather-brand-dot">.</span></span>
        </a>
        <span className="weather-live"><span /> LIVE WEATHER</span>
      </header>

      <section className="weather-intro">
        <p className="weather-eyebrow">YOUR WINDOW TO THE WORLD</p>
        <h1>A little forecast<br />for <span>where you are.</span></h1>
        <p className="weather-subtitle">Find the weather anywhere, anytime.</p>
      </section>

      <form className="weather-search-panel" onSubmit={handleSearch}>
        <label className="weather-search-label" htmlFor="city-search">CITY OR LOCATION</label>
        <div className="weather-search-row">
          <div className="weather-search-box">
            <span className="weather-search-icon" aria-hidden="true">⌕</span>
            <input
              className="search"
              id="city-search"
              type="search"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Try “Lisbon, Portugal”"
              autoComplete="off"
              required
            />
          </div>
          <button className="weather-search-button" type="submit" disabled={loading}>
            <span>{loading ? "Finding weather…" : "Find weather"}</span>
            {!loading && <span aria-hidden="true">↗</span>}
          </button>
        </div>
      </form>

      {error && <p className="weather-error" role="alert">{error}</p>}

      {weatherData && (
        <section className="weather" aria-live="polite" aria-label="Current weather">
          <div className="weather-heading">
            <div>
              <p className="weather-kicker">RIGHT NOW IN</p>
              <h2>{weatherData.name}, {weatherData.sys.country}</h2>
              <p className="weather-date">
                {new Intl.DateTimeFormat(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }).format(new Date())}
              </p>
            </div>
            <span className="weather-badge"><span /> CURRENT</span>
          </div>
          <div className="weather-main">
            <p className="weather-temperature">
              {Math.round(weatherData.main.temp)}<span>°C</span>
            </p>
            <div className="weather-condition">
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${encodeURIComponent(weatherData.weather[0].icon)}@2x.png`}
                alt={weatherData.weather[0].description}
              />
              <p className="weather-description">{weatherData.weather[0].description}</p>
            </div>
          </div>
          <div className="weather-footer">
            <span>Powered by OpenWeather</span>
            <span>Feels like {Math.round(weatherData.main.feels_like)}°C</span>
          </div>
        </section>
      )}

      <footer className="weather-page-footer">
        <span>MADE FOR THE MOMENT</span>
        <span>☁ &nbsp; Take the day as it comes.</span>
      </footer>
    </main>
  );
}

export default Weather;
