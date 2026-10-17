import { useState } from "react";
import Weather from "./Weather";
import "./Weather.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);

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

      <Weather onWeatherData={setWeatherData} />

      <section className="weather" aria-live="polite" aria-label="Current weather" hidden={!weatherData}>
        {weatherData && (
          <>
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
          </>
        )}
      </section>

      <footer className="weather-page-footer">
        <span>MADE FOR THE MOMENT</span>
        <span>☁ &nbsp; Take the day as it comes.</span>
      </footer>
    </main>
  );
}

export default App;
