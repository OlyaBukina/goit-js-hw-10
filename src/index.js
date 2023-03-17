import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfoContainer: document.querySelector('.country-info'),
};

function onInputSearch(e) {
  const inputValue = e.target.value.trim();

  if (inputValue !== '') {
    fetchCountries(inputValue);
  }
}

function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  fetch(url)
    .then(response => response.json())
    .then(countriesArray => {
      if (countriesArray.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearCountriesList();
        clearCountryInfoContainer();
      } else if (countriesArray.length <= 10 && countriesArray.length >= 2) {
        clearCountryInfoContainer();
        appendCountriesList(countriesArray);
      } else if (countriesArray.length === 1) {
        clearCountriesList();
        console.log(countriesArray);
        appendInfoAboutFindCountry(countriesArray[0]);
      }
    })
    .catch(error => console.log(error));
}

refs.searchInput.addEventListener(
  'input',
  debounce(onInputSearch, DEBOUNCE_DELAY)
);

function appendCountriesList(countries) {
  const listItems = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="${country.flags.alt}" width="40" /> 
      <p>${country.name.official}</p>
    </li>`;
    })
    .join('');

  refs.countryList.innerHTML = listItems;
}

function clearCountriesList() {
  refs.countryList.innerHTML = '';
}

function appendInfoAboutFindCountry(country) {
  const countryInfo = `<div class="title-container">
        <img src="${country.flags.svg}" alt="${country.flags.alt}" width="200"/>
        <h1>${country.name.official}</h1>
      </div>
      <ul>
        <li>
          <b>Capital</b>
          <p>${country.capital}</p>
        </li>
        <li>
          <b>Population</b>
          <p>${country.population}</p>
        </li>
        <li>
          <b>Languages</b>
          <p>${country.languages}</p>
        </li>
      </ul>`;

  refs.countryInfoContainer.innerHTML = countryInfo;
}
function clearCountryInfoContainer() {
  refs.countryInfoContainer.innerHTML = '';
}
