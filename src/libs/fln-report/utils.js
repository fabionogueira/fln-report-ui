// ts-check

let pxPerCm

const Utils = {
    
    px2cm(px) {
        return px / Utils.getPxPerCm()
    },

    cm2px(cm) {
        return cm * Utils.getPxPerCm()
    },
    
    getPxPerCm(){
        let d
            
        if (pxPerCm===undefined){
            d = document.createElement('div')
            d.style.cssText = "position:absolute;top:-1000cm;left:-1000cm;height:1000cm;width:1000cm"
            document.body.appendChild(d)
            pxPerCm = d.offsetHeight / 1000
            document.body.removeChild(d)
        }
        
        return pxPerCm
    },

    /**
     * @param {*} context 
     * @param {*} events 
     * @param {*} event 
     * @param {Array} params
     */
    dispatch(context, events, event, ...params){
        let f = events[event]
        
        if (f){
            f.apply(context, params)
        }
    },

    /**
     * @param {HTMLElement} el 
     */
    getProperties(el){
        return  [
            {name:"height", type:'int', value: el.offsetHeight}
        ]
    },

    /**
     * @param {String} template 
     * @param {Array<String>} internalIdentifiers 
     * @param {Array<String>} userIdentifiers 
     */
    compilerTemplate(template, internalIdentifiers, userIdentifiers) {
        let i, params, p = '', parts1, parts2, code = '', v

        parts1 = template.split('}')
        for (i = 0; i < parts1.length; i++) {
            parts2 = parts1[i].split('${')
            if (parts2.length === 2) {
                v = internalIdentifiers.indexOf(parts2[1])!=-1  ? `internalIdentifiers["${parts2[1]}"]`  : 
                    userIdentifiers.indexOf(parts2[1])!=-1 ? `userIdentifiers["${parts2[1]}"]` : 
                    `data["${parts2[1]}"]`

                code += (`${p}'${parts2[0]}'+(${v})`)  //(p + "'" + parts2[0] + "'+(" + v + ")")
            } else {
                code += (`${p}'${parts2[0]}'`)
            }
            p = '+'
        }

        params = ['internalIdentifiers','userIdentifiers', 'data', 'return ' + code + '']

        return Function.apply(null, params)
    }
}

export default Utils
