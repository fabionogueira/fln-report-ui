// @ts-check

import FElement from './element'

class FRect extends FElement{
    draw(){
        return `<div class="element rect" ${this.getStyleAttribute()}></div>`;
    }
}

export default FRect
