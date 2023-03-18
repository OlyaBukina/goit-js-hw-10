import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfoContainer: document.querySelector('.country-info'),
};

function updateCountriesList(countries) {
  const listItems = countries
    .map(({ flags, name }) => {
      return `<li>
      <img src="${flags.svg}" alt="${flags.alt}" width="40" /> 
      <p>${name.official}</p>
    </li>`;
    })
    .join('');

  refs.countryList.innerHTML = listItems;
}

function clearCountriesList() {
  refs.countryList.innerHTML = '';
}

function updateFoundCountryInfo({
  flags,
  name,
  capital,
  population,
  languages,
}) {
  const countryInfo = `<div class="js-title-container">
  <img src="${flags.svg}" alt="${flags.alt}" width="60"/>
  <h1>${name.official}</h1>
  </div>
  <ul>
  <li>
  <b>Capital</b>
  <p>${capital}</p>
  </li>
  <li>
  <b>Population</b>
  <p>${population}</p>
  </li>
  <li>
  <b>Languages</b>
  <p>${Object.values(languages).join(', ')}</p>
  </li>
  </ul>`;

  refs.countryInfoContainer.innerHTML = countryInfo;
}

function clearCountryInfoContainer() {
  refs.countryInfoContainer.innerHTML = '';
}

function clearAllContainers() {
  clearCountryInfoContainer();
  clearCountriesList();
}

function onInputChange(e) {
  const inputValue = e.target.value.trim();

  if (inputValue === '') {
    clearAllContainers();
  } else {
    fetchCountries(inputValue)
      .then(countries => {
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          clearAllContainers();
        } else if (countries.length === 1) {
          clearCountriesList();
          updateFoundCountryInfo(countries[0]);
        } else {
          clearCountryInfoContainer();
          updateCountriesList(countries);
        }
      })
      .catch(error => {
        Notify.failure(error.message);
        clearAllContainers();
      });
  }
}

refs.searchInput.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);
