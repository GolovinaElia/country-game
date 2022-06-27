import {Nation} from "./Nation";
import {COUNTRIES, COUNTRIES_LIST} from "../data/data";

export class NationService {
    countries = COUNTRIES;
    countryList = COUNTRIES_LIST;

    constructor() {
    }

    compareHemisphere(selected, secret) {
        return selected.hemisphere === secret.hemisphere
    }

    compareContinent(selected, secret) {
        return selected.continent === secret.continent
    }

    compareTemperature(selected, secret) {
        let d = Math.abs(selected.temperature - secret.temperature);
        if (d < 1.5) {
            return 'true'
        } else if (d < 3) {
            return 'near'
        } else if (selected.temperature > secret.temperature) {
            return 'lower'
        } else {
            return 'higher'
        }
    }

    comparePopulation(selected, secret) {
        let d = Math.abs(selected.population - secret.population);
        if (d > 0.9 && d < 1.1) {
            return 'true'
        } else if (d > 0.75 && d < 1.25) {
            return 'near'
        } else if (selected.population > secret.population) {
            return 'lower'
        } else {
            return 'higher'
        }
    }

    getAverageCoordinates(country) {
        country.coordinates.v = (country.coordinates.north + country.coordinates.south) / 2;
        country.coordinates.h = (country.coordinates.west + country.coordinates.east) / 2;
    }

    getAngle(selected, secret) {
        let h = secret.coordinates.h - selected.coordinates.h;
        let v = secret.coordinates.v - selected.coordinates.v;

        if (v > 180) {
            v = -(180 - v % 180);
        } else if (v < -180) {
            v = 180 + v % 180;
        }
        if (h > 180) {
            h = -(180 - h % 180);
        } else if (h < -180) {
            h = 180 + h % 180;
        }

        return (Math.atan2(v, h) * 180) / Math.PI;
    }

    compareCoordinates(selected, secret) {
        this.getAverageCoordinates(selected);
        let angle = this.getAngle(selected, secret)
        if (angle === 0) {
            return true;
        } else if (angle > -22.5 && angle <= 22.5) {
            return 'e';
        } else if (angle > 22.5 && angle <= 67.5) {
            return 'ne';
        } else if (angle > 67.5 && angle <= 112.5) {
            return 'n';
        } else if (angle > 112.5 && angle <= 157.5) {
            return 'nw';
        } else if (angle > 157.5 && angle <= 180 || angle > -180 && angle <= -157.5) {
            return 'w';
        } else if (angle > -157.5 && angle <= -112.5) {
            return 'sw';
        } else if (angle > -112.5 && angle <= -67.5) {
            return 's';
        } else if (angle > -67.5 && angle <= -22.5) {
            return 'se';
        }
    }

    findMatchingCountries(letters) {
        let array = [];
        let capitalize = letters.charAt(0).toUpperCase() + letters.slice(1);
        for (let i = 0; i < this.countryList.length; i++) {
            if (this.countryList[i].indexOf(capitalize) !== -1) {
                array.push(this.countryList[i]);
            }
        }
        return array;
    }

    getRandomCountry() {
        return new Nation(this.countries[this.countryList[Math.floor(Math.random() * (this.countryList.length + 1))]]);
    }

    getCountryByName(name) {
        return new Nation(this.countries[name])
    }

    compareTwoCountries(selected, secret) {
        return {
            hemisphere: this.compareHemisphere(selected, secret),
            continent: this.compareContinent(selected, secret),
            temperature: this.compareTemperature(selected, secret),
            population: this.comparePopulation(selected, secret),
            coordinates: this.compareCoordinates(selected, secret)
        }
    }
}

const nationService = new NationService();
export { nationService };