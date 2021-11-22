const RECENT_SEARCH = 'RECENT_SEARCH';

const DIRECTION = {
    1: 'N',
    2: 'NNE',
    3: 'NE',
    4: 'ENE',
    5: 'E',
    6: 'ESE',
    7: 'SE',
    8: 'SSE',
    9: 'S',
    10: 'SSW',
    11: 'SW',
    12: 'WSW',
    13: 'W',
    14: 'WNW',
    15: 'NW',
    16: 'NNW',
    17: 'N',
}

const debounced = _.debounce(searchCities, 500);

function handleInputChange() {
    debounced();
}

async function searchCities() {
    const searchInputElement = document.querySelector('.search__input');
    const foundCities = await getCities(searchInputElement.value);
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];

    toggleSuggestion(searchInputElement.value.length);

    if (foundCities.length) {
        loadSuggestion(foundCities);
        setRecentSearch(foundCities);
    } else {
        const emptyElement = `<div class="empty__message"><span>${searchInputElement.value} is not founded...</span><span>Please enter another...</span>`;
        suggestionElement.innerHTML = emptyElement;
    }
}

function handleInputBlur() {
    setTimeout(() => toggleSuggestion(false), 300)
}

function handelInputFocus() {
    const recentCities = JSON.parse(localStorage.getItem(RECENT_SEARCH));
    if (recentCities && recentCities.length) {
        loadSuggestion(recentCities);
        toggleSuggestion(true);
    }
}

async function selectCity(city) {
    const inputElement = document.querySelector('.search__input');
    inputElement.value = city.name;

    const response = await getCurrentWeather(city.id);
    const fiveDays = await getFiveDaysWeather(city.id);
    await changCurrentWeatherInfo(response);
    await changeFiveDays(fiveDays);


    // console.log(city, response, fiveDays)
}

function loadSuggestion(Cities) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];
    const items = document.getElementsByClassName('search__items')[0];
    items && items.remove();
    const ul = document.createElement('UL');
    ul.classList.add('search__items');
    Cities.forEach(city => {
        const element = document.createElement('LI');
        element.classList.add('search__item');
        element.onclick = () => selectCity(city);
        element.innerText = city.name;
        ul.appendChild(element);
    })
    suggestionElement.appendChild(ul);
    // let items = `<ul class="search__items">`;
    // Cities.forEach(city => {
    //     const itemElement = `<li class="search__item">${city.name}</li>`
    //     items += itemElement;
    // });
    // items += `</ul>`
    // suggestionElement.innerHTML = items;
}

function toggleSuggestion(isShow) {
    const suggestionElement = document.getElementsByClassName('search__suggestion')[0];
    isShow ?
        suggestionElement.classList.add('search__suggestion--active') :
        suggestionElement.classList.remove('search__suggestion--active');


    !isShow && (() => { // if left is true then right is work;
        suggestionElement.innerHTML = "";
    })()
}


function setRecentSearch(cities) {
    let data = cities.slice(0, 4);
    data = JSON.stringify(data);
    localStorage.setItem(RECENT_SEARCH, data);

}

function changCurrentWeatherInfo(weather) {
    const cityEL = document.querySelector('.city-temperature__title');
    const dayEl = document.querySelector('.city-temperature__current-day');
    const degreeEl = document.querySelector('.temperature__current-degree');
    const pressureEl = document.querySelector('.pressure');
    const windEl = document.querySelector('.wind');
    const humidityEl = document.querySelector('.humidity');
    const iconEl = document.querySelector('.weather__icon');
    cityEL.innerHTML = weather.name;
    dayEl.innerHTML = moment(weather.dt, 'X').format('dddd'); //convert weather.dt to time with new Date(...000);
    degreeEl.innerHTML = `${Math.round(weather.main.temp)}°c`;
    pressureEl.innerHTML = `${weather.main.pressure} hPa`;
    const deg = Math.round((weather.wind.deg / 22.5) + 1);  // for navigation
    windEl.innerHTML = `${DIRECTION[deg]}, ${weather.wind.speed}m/s`;
    humidityEl.innerHTML = `${weather.main.humidity}%`
    iconEl.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;
}


function changeFiveDays(weathers) {
    const dayE1 = document.querySelector('.city-day-card1');
    const dayE2 = document.querySelector('.city-day-card2');
    const dayE3 = document.querySelector('.city-day-card3');
    const dayE4 = document.querySelector('.city-day-card4');
    const dayE5 = document.querySelector('.city-day-card5');
    const degreeDay1 = document.querySelector('.city-degree-1');
    const degreeDay2 = document.querySelector('.city-degree-2');
    const degreeDay3 = document.querySelector('.city-degree-3');
    const degreeDay4 = document.querySelector('.city-degree-4');
    const degreeDay5 = document.querySelector('.city-degree-5');
    const iconDay1 = document.querySelector('.icon-day-1');
    const iconDay2 = document.querySelector('.icon-day-2');
    const iconDay3 = document.querySelector('.icon-day-3');
    const iconDay4 = document.querySelector('.icon-day-4');
    const iconDay5 = document.querySelector('.icon-day-5');
    
    const result = weathers.list.filter((i,index) =>index % 8 === 0);

    dayE1.innerHTML = moment(result[0].dt, 'X').format('dddd');
    dayE2.innerHTML = moment(result[1].dt, 'X').format('dddd');
    dayE3.innerHTML = moment(result[2].dt, 'X').format('dddd');
    dayE4.innerHTML = moment(result[3].dt, 'X').format('dddd');
    dayE5.innerHTML = moment(result[4].dt, 'X').format('dddd');

    degreeDay1.innerHTML =  `${Math.round(result[0].main.temp)}°c`;
    degreeDay2.innerHTML =  `${Math.round(result[1].main.temp)}°c`;
    degreeDay3.innerHTML =  `${Math.round(result[2].main.temp)}°c`;
    degreeDay4.innerHTML =  `${Math.round(result[3].main.temp)}°c`;
    degreeDay5.innerHTML =  `${Math.round(result[4].main.temp)}°c`;

    iconDay1.src = `http://openweathermap.org/img/wn/${result[0].weather[0].icon}@4x.png`;   
    iconDay2.src = `http://openweathermap.org/img/wn/${result[1].weather[0].icon}@4x.png`;   
    iconDay3.src = `http://openweathermap.org/img/wn/${result[2].weather[0].icon}@4x.png`;   
    iconDay4.src = `http://openweathermap.org/img/wn/${result[3].weather[0].icon}@4x.png`;   
    iconDay5.src = `http://openweathermap.org/img/wn/${result[4].weather[0].icon}@4x.png`;   
    

}