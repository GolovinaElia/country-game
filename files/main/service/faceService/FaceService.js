import getRefs from '../refs/refs';
import {TYPES} from "../data/data";

const refs = getRefs();

 class FaceService {
    types = TYPES; // типы значений шариков

    // получает фокус инпут
    focusInput() {
        this.countryField.focus();
        this.placeholder.classList.add('focus')
    }

    // теряет фокус инпут
    blurInput() {
        if (this.countryField.value.length === 0) {
            this.placeholder.classList.remove('focus');
        }
    }

    // очищают инпут
    clearInput() {
        this.countryField.value = '';
    }

    // показ любого элемента
    showElement(element) {
        if (!element.classList.contains('show')) {
            element.style.display = 'flex';
            element.classList.add('show')
            setTimeout(function () {
                element.style.opacity = 1;
            }, 10)
        }
    }

    // скрытие любого элемента
    hideElement(element) {
        if (element.classList.contains('show')) {
            element.style.opacity = 0;
            setTimeout(function () {
                element.style.display = 'none';
                element.classList.remove('show');
            }, 310)
        }
    }

    // удаление любого элемента
    clearElement(element) {
        element.innerHTML = '';
    }

    // изменение размера окна шариков и карты
    resizeGuessWindow() {
        let self = this;
        refs.guessWindow.removeAttribute('style');
        setTimeout(function () {
            self.guessWindow.style.maxHeight = self.guessWindow.offsetHeight + 'px';
        }, 10)
    }

    // показ стран по введенным буквам
    showMatchingCountries(array) {
        let self = this;
        let ul = document.createElement('ul');
        for (let i = 0; i < array.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = array[i];
            li.addEventListener('click', function () {
                self.countryField.value = array[i];
                self.hideMatchingCountries();
                self.clearMatchingCountries();
            })
            ul.appendChild(li);
        }
        refs.countryMatchList.style.height = (array.length * 40) + 'px'
        refs.countryMatchList.style.top = -((array.length * 40) + 15) + 'px'
        refs.countryMatchList.appendChild(ul);
        this.showElement(refs.countryMatchList);
    }


    clearMatchingCountries() {
        refs.countryMatchList.innerHTML = '';
    }

    hideMatchingCountries() {
        this.hideElement(refs.countryMatchList);
    }

    scrollGuessListToBottom() {
        if (this.guesses.clientHeight > this.scrollWindow.clientHeight) {
            this.scrollWindow.scrollTo({top: this.guesses.clientHeight, behavior: "smooth"});
        }

    }

    // очищают от шариков
    clearGuesses() {
        this.clearElement(refs.guesses)
    }


    // добавление шариков
    showGuess(selected, guess, attempt) {
        let div = document.createElement('div');
        let title = document.createElement('div');
        title.innerHTML = attempt + '. ' + selected.name;
        title.classList.add('title');
        div.appendChild(title);
        div.classList.add('guess')
        let matches = document.createElement('div');
        matches.classList.add('matches');
        for (let i = 0; i < this.types.length; i++) {
            let match = document.createElement('div');
            let span = document.createElement('span');
            match.classList.add('match');
            match.classList.add(this.types[i]);
            match.classList.add(guess[this.types[i]]);
            switch (this.types[i]) {
                case 'hemisphere':
                    span.innerHTML = selected[this.types[i]];
                    break;
                case 'continent':
                    span.innerHTML = selected[this.types[i]];
                    break;
                case 'temperature':
                    span.innerHTML = selected[this.types[i]] + ' °C';
                    break;
                case 'population':
                    let p = selected[this.types[i]];
                    let m = (p / 1000000).toFixed(1);
                    if (m > 1) {
                        span.innerHTML = m + 'M';
                    } else {
                        span.innerHTML = (p / 1000).toFixed(0) + 'K'
                    }
                    break;
                case 'coordinates':
                    if (guess.coordinates !== true) {
                        span.innerHTML = guess[this.types[i]];
                    }
                    break;
            }
            match.appendChild(span);
            matches.appendChild(match);
        }
        div.appendChild(matches);
        refs.guesses.appendChild(div);
        this.scrollGuessListToBottom()
    }

    // ставят метку, когда угадали страну
    showMark(x,y) {
        this.showElement(refs.mark);
        refs.mark.style.top = parseInt(y) +'px'
        refs.mark.style.left = parseInt(x) +'px'
    }

    // убирают метку
    hideMark() {
        this.hideElement(refs.mark);
        refs.mark.removeAttribute('style');
    }
}
const faceService = new FaceService();
export { faceService };