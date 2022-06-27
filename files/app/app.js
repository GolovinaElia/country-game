import {getRef} from "./ref";
// let button = document.querySelector('#submit')

let refs = getRef()

refs.button.addEventListener('click', onBtnClick);
function onBtnClick(event) {
    alert("Hello? World!")
};
