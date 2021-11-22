const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const API_KEY = 'f8fef9ff009aa8814e62a520597a9164';

async function getCurrentWeather(cityId){
    const result = await fetch(`${BASE_URL}/weather?id=${cityId}&appid=${API_KEY}&units=metric`); // convert Kelvin to celsius with => &units=metric
    return result.json();
}

async function getFiveDaysWeather(cityId){
    const result = await fetch(`${BASE_URL}/forecast?id=${cityId}&appid=${API_KEY}&units=metric`);
    return result.json();
}