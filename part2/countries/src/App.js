import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/all`).then((res) => {
      setCountries(res.data);
    });
  }, []);

  const countriesToDisplay =
    searchTerm.length > 0
      ? countries.filter((e) =>
          e.name.common.toLowerCase().trim().includes(searchTerm)
        )
      : countries;

  const onSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value.trim());
  };

  return (
    <div>
      <div>
        find countries <input onChange={onSearch} />
      </div>
      {countriesToDisplay.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : (
        <CountriesDisplay countries={countriesToDisplay} />
      )}
    </div>
  );
}

const CountriesDisplay = ({ countries }) => {
  return (
    <>
      {countries.map((e) => (
        <Country
          key={e.cca2}
          country={e}
          defaultToShow={countries.length == 1}
        />
      ))}
    </>
  );
};

const Country = ({ country, defaultToShow }) => {
  const [toShow, setToShow] = useState(false);
  const [weatherDetails, setWeatherDetails] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const lat = country.latlng[0];
  const lng = country.latlng[1];

  useEffect(() => {
    if ((toShow || defaultToShow) && weatherDetails == null) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        )
        .then((res) => {
          setWeatherDetails(res.data);
        });
    }
  }, [toShow, defaultToShow]);

  return (
    <>
      <div>
        {!defaultToShow && (
          <>
            <div>
              {country.name.common}{" "}
              <button onClick={() => setToShow(!toShow)}>
                {toShow ? "Hide" : "Show"}
              </button>
            </div>
          </>
        )}
      </div>
      {(toShow || defaultToShow) && (
        <>
          <CountryDetails country={country} />
          {weatherDetails != null && (
            <WeatherDetails country={country} weatherDetails={weatherDetails} />
          )}
        </>
      )}
    </>
  );
};

const CountryDetails = ({ country }) => (
  <>
    <h1>{country.name.common}</h1>
    <p>{`capital ${country.capital[0]}`}</p>
    <p>{`area ${country.area}`}</p>
    <h3>languages</h3>
    <ul>
      {Object.keys(country.languages).map((e) => (
        <li>{country.languages[e]}</li>
      ))}
    </ul>
    <img src={country.flags.png} />
  </>
);

const WeatherDetails = ({ weatherDetails, country }) => (
  <>
    <h2>{`Weather in ${country.capital}`}</h2>
    <div>temperature {weatherDetails.main.temp} Celsius</div>
    <img src={"http://openweathermap.org/img/wn/02n@2x.png"} />
    <div>wind {weatherDetails.wind.speed} m/s</div>
  </>
);

export default App;
