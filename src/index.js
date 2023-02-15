import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const inputSearchBox = document.querySelector("#search-box");
const countriesList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

inputSearchBox.addEventListener("input", debounce(handleInputSearch, DEBOUNCE_DELAY, {
      leading: true,
      trailing: false,
    }));
 

function handleInputSearch(event) {
    const country = event.currentTarget.value.trim();
    if (!country) {
        cleanCountriesList();
        cleanCountryInfo();
        return;
    }
    fetchCountries(country).then((countries) => {
        
    if (countries.length > 10) {
        cleanCountriesList();
        cleanCountryInfo();
        Notify.info("Too many matches found. Please enter a more specific name.");
    }
    if (countries.length >= 2 && countries.length <= 10) {
        cleanCountryInfo();
        renderCountrisName(countries);
    }
    if (countries.length === 1) {
        cleanCountriesList();
        renderCountryInfo(countries);
    }
    }).catch(error => Notify.failure("Oops, there is no country with that name"));

}


function renderCountrisName(arrayCountriesName) {
    const markup = arrayCountriesName.map(({name, flags}) => {
        return `<li><img src="${flags.svg}" alt="${flags.alt}" width="25" height="15"><span>${name.common}</span></li>`;
    }).join("");
    countriesList.innerHTML = markup;

}

function renderCountryInfo(countryName) {
    const markup = countryName.map(({name, flags, capital, population, languages}) => {
        return `<h2><img src="${flags.svg}" alt="${flags.alt}" width="40" height="30"><span class="country-name">${name.common}</span></H2>
        <p><b>Capital:</b>${capital}</p>
        <p><b>Population:</b>${population}</p>
        <p><b>Languages:</b>${Object.values(languages).join(", ")}</p>`
    });
    countryInfo.innerHTML = markup;
}

function cleanCountriesList() {
    countriesList.innerHTML = "";
}

function cleanCountryInfo() {
    countryInfo.innerHTML = "";
}