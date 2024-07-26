import { useState } from 'react';


function WeatherBoxUnit({ dayTittle, dayImg, dayTemp }) {
  return (
    <div className="weather-box__unit">
      <h2 className="weather-box__unit-title">{dayTittle}</h2>
      <img className="weather-box__unit-img img-0" src={dayImg} alt=""></img>
      <p className="weather-box__unit__temperature temp-0">{dayTemp}</p>
    </div>
  );
}

function Search( {onUserLocationChange} ) {

  

  return (
    <form action="" name="locationForm" className="locationForm" 
    onSubmit={(event) => {
      event.preventDefault();
      onUserLocationChange(event.currentTarget.elements.locationInput.value)
    }} >
      <input type="text" name="locationInput" className="searchLocation" placeholder="Search location"></input>
      <button type="submit" className="submit">
        find
      </button>
    </form>
  );
}

function WeatherStats({ currentTemp, status, wind, humidity, pressure }) {
  return (
    <>
      <p className="weather-today__info-temperature">{currentTemp}°</p>
      <p className="weather-today__info-status">{status}</p>
      <p className="weather-today__info-wind">Wind: {wind} km/h</p>
      <p className="weather-today__info-humidity">Air humidity: {humidity}%</p>
      <p className="weather-today__info-pressure">Pressure: {pressure}</p>
    </>
  );
}

function TodaysWeatherInfo({ currentTemp, status, wind, humidity, pressure, onUserLocationChange }) {
  return (
    <div className="weather-today__info">
      <Search onUserLocationChange={onUserLocationChange} />
      <WeatherStats 
        currentTemp={currentTemp} status={status} wind={wind} humidity={humidity} pressure={pressure}
      />
    </div>  
  );
}

function TodaysWeatherLabel({ city, todaysImg, todaysTemp }) {
  return (
    <div className="weather-today__label">
      <h1 className="weather-today__info-city">{city}</h1>
      <img className="weather-today-image" src={todaysImg} alt=""></img>
      <p className="weather-today__label__temperature">{todaysTemp}</p>
    </div>  
  );
}

function TodaysWeather( {userLocation, onUserLocationChange} ) {
  const [todaysImg, setTodaysImg] = useState('');
  const [todaysTemp, setTodaysTemp] = useState('20/10');

  const [currentTemp, setCurrentTemp] = useState('20');
  const [status, setStatus] = useState('no');
  const [wind, setWind] = useState('no');
  const [humidity, setHumidity] = useState('no');
  const [pressure, setPressure] = useState('no');

  fetch(`http://api.weatherapi.com/v1/forecast.json?key=c60bec5c81494e47918105425242407&q=${userLocation}&days=7&aqi=no&alerts=no`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      setTodaysTemp(`${data.forecast.forecastday[0].day.maxtemp_c}° / ${data.forecast.forecastday[0].day.mintemp_c}°`);
      setTodaysImg(data.current.condition.icon);

      setCurrentTemp(data.current.temp_c);
      setStatus(data.current.condition.text);
      setWind(data.current.wind_kph);
      setHumidity(data.current.humidity);
      setPressure(data.current.pressure_in);
    })
    .catch(function(error) {
        console.error(error);
    });
  return (
    <div className="weather-today">
      <TodaysWeatherLabel city={userLocation} todaysImg={todaysImg} todaysTemp={todaysTemp} />
      <TodaysWeatherInfo 
        onUserLocationChange={onUserLocationChange}
        currentTemp={currentTemp} status={status} wind={wind} humidity={humidity} pressure={pressure}
      />
    </div>
  );
}

function WeatherBox( {userLocation} ) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [daysTittle, setDaysTittle] = useState(Array(7).fill('Monnday'));
  const [daysImg, setDaysImg] = useState(Array(7).fill(''));
  const [daysTemp, setDaysTemp] = useState(Array(7).fill('20/30'));
  
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=c60bec5c81494e47918105425242407&q=${userLocation}&days=7&aqi=no&alerts=no`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const nextDaysTittle = daysTittle.slice();
      const nextDaysImg = daysImg.slice();
      const nextDaysTemp = daysTemp.slice();
      for (let i = 0; i < 7; i++) {
        const date = new Date(data.forecast.forecastday[i].date);
        nextDaysTittle[i] = daysOfWeek[date.getDay()];
        nextDaysImg[i] = data.forecast.forecastday[i].day.condition.icon;
        nextDaysTemp[i] = `${data.forecast.forecastday[i].day.maxtemp_c}°/${data.forecast.forecastday[i].day.mintemp_c}°`
      }
      setDaysTittle(nextDaysTittle);
      setDaysImg(nextDaysImg);
      setDaysTemp(nextDaysTemp);
    })
    .catch(function(error) {
        console.error(error);
    });

  return (
    <div className="weather-box">
      <WeatherBoxUnit dayTittle={daysTittle[0]} dayImg={daysImg[0]} dayTemp={daysTemp[0]} />
      <WeatherBoxUnit dayTittle={daysTittle[1]} dayImg={daysImg[1]} dayTemp={daysTemp[1]} />
      <WeatherBoxUnit dayTittle={daysTittle[2]} dayImg={daysImg[2]} dayTemp={daysTemp[2]} />
      <WeatherBoxUnit dayTittle={daysTittle[3]} dayImg={daysImg[3]} dayTemp={daysTemp[3]} />
      <WeatherBoxUnit dayTittle={daysTittle[4]} dayImg={daysImg[4]} dayTemp={daysTemp[4]} />
      <WeatherBoxUnit dayTittle={daysTittle[5]} dayImg={daysImg[5]} dayTemp={daysTemp[5]} />
      <WeatherBoxUnit dayTittle={daysTittle[6]} dayImg={daysImg[6]} dayTemp={daysTemp[6]} />
    </div>
  );
}

export default function App() {
  const [userLocation, setUserLocation] = useState(null);

  if (userLocation === null) {
    fetch("https://ipapi.co/json/")
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        setUserLocation(data.city);
      });
  }

  return (
    <div className="wrapper">
      <main className="main">
        <TodaysWeather userLocation={userLocation} onUserLocationChange={setUserLocation} />
        <WeatherBox userLocation={userLocation} />
      </main>
    </div>
  );
}

