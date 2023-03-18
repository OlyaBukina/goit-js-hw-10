export default function fetchCountries(countryName) {
  const url = `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`;
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    if (response.status === 404) {
      throw new Error('Oops, there is no country with that name');
    }
    throw new Error('Oops, something goes wrong!')
  });
}
