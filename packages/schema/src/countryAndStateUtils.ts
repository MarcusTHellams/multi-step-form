import states from 'states-us';
import countries from 'world-countries';

export const getModifiedCountries = () => {
  const _countries = structuredClone(countries);
  const usaIndex = _countries.findIndex((country) => country.cca2.toLowerCase() === 'us');
  const usa = _countries.splice(usaIndex, 1)[0];
  _countries.splice(0, 0, usa);
  return _countries;
};

export const getStateCd = (stateName: string) => {
  return states.find((state) => state.name === stateName)?.abbreviation || '';
};

export const getCountryIsoCd = (countryName: string) => {
  return countries.find((country) => country.name.official === countryName)?.cca2 || '';
};
