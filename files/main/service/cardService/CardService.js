import getRefs from '../refs/refs';
import { faceService } from '../faceService/FaceService';

const refs = getRefs();

export class CardService {
    country = {};
    mapWindow = {}
    delta = 0;
    exceptions = ['Tonga', 'Marshall Islands']

    showCountry(countryName) {
        let self = this;
        this.findPosition(countryName);
        this.country.width = this.country.right - this.country.left;
        this.country.height = this.country.bottom - this.country.top;
        this.mapWindow.width = faceService.guesses.querySelector('.guess').offsetWidth;
        this.mapWindow.height = faceService.guessWindow.offsetHeight - faceService.guesses.querySelector('.guess').offsetHeight;

        this.findRelevantPosition();

        if (this.mapWindow.width > this.mapWindow.height) {
            this.delta = this.mapWindow.height / this.country.height;
        } else {
            this.delta = this.mapWindow.width / this.country.width;
        }

        this.writeInConsole('country delta', this.delta);

        if (this.delta > 20) {
            this.delta = 10
        } else if (this.delta > 10) {
            this.delta = parseInt(this.delta * 0.5);
        } else {
            this.delta = parseInt(this.delta * 0.8);
        }

        this.writeInConsole('country delta', this.delta);

        refs.map.style.width = parseInt(refs.map.clientWidth * this.delta) + 'px';
        refs.map.style.height = parseInt(refs.map.clientHeight * this.delta) + 'px';
        refs.map.style.left = -parseInt(this.country.left * this.delta - ((this.mapWindow.width - this.country.width * this.delta) / 2)) + 'px';
        refs.map.style.top = -parseInt(this.country.top * this.delta - appearanceService.guesses.querySelector('.guess').offsetHeight - ((this.mapWindow.height - this.country.height * this.delta) / 2)) + 'px';

        setTimeout(function () {
            if (self.country.height * self.delta < 10 || self.country.width * self.delta < 10 || self.exceptions.includes(countryName)) {
                self.findPosition(countryName);
                self.findRelevantPosition();
                faceService.showMark((self.country.right + self.country.left) / 2, self.country.top);
            }
        },310)


    }

    findPosition(country) {
        let self = this;
        if (country.indexOf(' ') !== -1) {
            country = country.toString().replace(/\s/g, '_');
        }
        let dots = [];
        this.map.querySelectorAll('.' + country).forEach(function (el) {
            el.classList.add('highlight');
            dots.push(self.findCountryElementPosition(el));
        })
        this.country = this.findEdgeCoordinates(dots);
    }

    findRelevantPosition() {
        let offsetTop = appearanceService.header.clientHeight;
        let offsetLeft = refs.mapContainer.getBoundingClientRect().left;
        if (offsetTop < 0) {
            offsetTop = 0
        }
        if (offsetLeft < 0) {
            offsetLeft = 0
        }
        this.country.top = this.country.top - offsetTop;
        this.country.bottom = this.country.bottom - offsetTop;
        this.country.left = this.country.left - offsetLeft;
        this.country.right = this.country.right - offsetLeft;
    }

    findEdgeCoordinates(array) {
        let top = [], left = [], bottom = [], right = [];
        for (let i = 0; i < array.length; i++) {
            top.push(array[i].top);
            bottom.push(array[i].bottom);
            left.push(array[i].left);
            right.push(array[i].right);
        }
        return {
            top: Math.min.apply(null, top),
            bottom: Math.max.apply(null, bottom),
            left: Math.min.apply(null, left),
            right: Math.max.apply(null, right)
        }
    }


    hideCountry() {
        this.map.querySelectorAll('.highlight').forEach(function (el) {
            el.classList.remove('highlight');
        })
        faceService.hideMark();
        this.map.setAttribute('style', 'height:100%')
    }

    findCountryElementPosition(country) {
        let {top, bottom, left, right} = country.getBoundingClientRect();
        return {top: top, bottom: bottom, left: left, right: right};
    }

    writeInConsole(text, v) {
        console.log(text + ': ' + v);
    }


}

const cardService = new CardService();
export { cardService };