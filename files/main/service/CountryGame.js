import {faceService} from "./faceService/FaceService";
import {nationService} from "./nation/NationService";
import {cardService} from "./cardService/CardService";


class CountryGame {
    attempt = 0;
    currentGuess = {};
    country = {
        secret: nationService.getRandomCountry(),
        selected: {}
    }

    constructor() {
    }

    setup() {
        faceService.setup();
        cardService.setup();
        let self = this;
        nationService.getAverageCoordinates(this.country.secret);
        faceService.form.addEventListener('submit', function (e) {
            self.submit(e);
        })
        faceService.countryField.addEventListener('keyup', function () {
            let array = [];
            if (faceService.countryField.value.length >= 2) {
                faceService.clearMatchingCountries();
                array = nationService.findMatchingCountries(faceService.countryField.value);
            }
            if (array.length > 0) {
                faceService.showMatchingCountries(array);
            } else {
                faceService.clearMatchingCountries();
                faceService.hideMatchingCountries();
            }
        })
        faceService.countryField.addEventListener('focus', function () {
            faceService.focusInput();
        })
        faceService.countryField.addEventListener('blur', function () {
            faceService.blurInput();
        })
        faceService.placeholder.addEventListener('click', function () {
            faceService.focusInput();
        })
        faceService.tryAgainBtn.addEventListener('click', function () {
            self.restart();
        })
        faceService.giveUpBtn.addEventListener('click', function () {
            self.giveup();
        })
        faceService.resizeGuessWindow();
        window.addEventListener('resize', function () {
            faceService.resizeGuessWindow();
        })

        window.addEventListener('keyup', function (e) {
            if (e.which === 13) {
                self.submit(e);
            }
        })
    }

    submit (e) {
        let self = this;
        e.preventDefault();
        if (faceService.countryField.value.length > 0 && nationService.countryList.includes(faceService.countryField.value)) {
            self.country.selected = nationService.getCountryByName(faceService.countryField.value);
            faceService.clearInput()
            faceService.blurInput();
            if (self.country.selected.name === self.country.secret.name) {
                self.success()
            } else {
                self.guess(self.country.selected, self.country.secret);
            }
        }
    }

    guess() {
        this.attempt++;
        nationService.getAverageCoordinates(this.country.selected);
        this.currentGuess = nationService.compareTwoCountries(this.country.selected, this.country.secret);
        faceService.showGuess(this.country.selected, this.currentGuess, this.attempt);
    }

    restart() {
        faceService.showElement(faceService.form);
        faceService.hideElement(faceService.tryAgainBlock);
        cardService.hideCountry();
        faceService.clearGuesses();
        this.country.secret = nationService.getRandomCountry();
        nationService.getAverageCoordinates(this.country.secret);
    }

    giveup() {
        this.country.selected = this.country.secret;
        this.attempt++;
        this.success();
    }

    success() {
        faceService.clearInput();
        faceService.blurInput();
        faceService.hideMatchingCountries();
        this.currentGuess = {
            hemisphere: true,
            continent: true,
            temperature: true,
            population: true,
            coordinates: true
        }
        faceService.showGuess(this.country.selected, this.currentGuess, this.attempt);
        cardService.showCountry(this.country.selected.name);
        this.attempt = 0;
        faceService.hideElement(faceService.form);
        faceService.showElement(faceService.tryAgainBlock);
    }

    secret(country) {
        this.attempt = 0;
        faceService.showElement(faceService.form);
        faceService.hideElement(faceService.tryAgainBlock);
        cardService.hideCountry();
        faceService.clearGuesses();
        this.country.secret = nationService.getCountryByName(country);
        nationService.getAverageCoordinates(this.country.secret);
    }
}

export let countryGame = new CountryGame();
