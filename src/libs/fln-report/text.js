// @ts-check

import FElement from './element'

let idIndex = 0;

class FText extends FElement{
    
    constructor(){
        super()
        this._ids = []
    }

    /**
     * param {Array} data 
     */
    draw(){
        let id='';

        if (this._definition.$fields['${#pages}']){
            this._ids.push(++idIndex)
            id = `id="idIndex${idIndex}" `
        }

        return `<div ${id}class="element statictext" data-element="Text" ${this.getStyleAttribute()}>${this.value()}</div>`
    }

    onComplete(){
        let doc = this._report.getDocument()
        let obj = this._report.getInternalVars()

        //substitui as variáveis __pages__ pelo seu valor
        this._ids.forEach((i)=>{
            let e= doc.getElementById(`idIndex${i}`)
            e.innerHTML = e.innerHTML.replace('__pages__', obj['#pages'])
        });
    }
}

export default FText
