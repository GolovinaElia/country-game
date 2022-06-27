export default function getRefs() {
    return {
        guesses: document.getElementById('guesses'),
        countryMatchList: document.getElementById('list'),
        countryField: document.getElementById('country'),
        mark: document.getElementById('mark'),
        placeholder: document.getElementById('placeholder'),
        guessWindow: document.getElementById('tips'),
        mapContainer: document.getElementById('map-container'),
        map: document.getElementById('map')
    }
}