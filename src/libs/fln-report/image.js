// @ts-check

import FElement from './element'

class FImage extends FElement{
    draw(){     
        return `<div class="element image" ${this.getStyleAttribute()}>
                    <img src="${this.value()}" style="width:100%;height:100%"/>
                </div>`;
    }
}

export default FImage
