// element.ts
// @ts-check

import utils from './utils'

class Element{

    constructor(){
        this._report = null
        this._section = null
        this._pageInfo = null
        this._fields = []
        this._key = null
        this._autoWrap = null
        this._onBeforePrint = null
        this._visible = null
        this._value = null
        this._identifiers = null
        this._definition = null
        this._style = null
    }

    //{value:String, x:Number, y:Number, width:Number, height:Number, key, autoWrap, onBeforePrint:Function, visible:Boolean, style:String}
    /**
     * @param {*} report 
     * @param {*} section 
     * @param {*} definition 
     */
    init(report, section, definition){
        let k, a, fn, style

        style = (definition.x===undefined      ? '' : `left:${definition.x}px;`) +
                (definition.y===undefined      ? '' : `top:${definition.y}px;`) +
                (definition.width===undefined  ? '' : `width:${definition.width}px;`) +
                (definition.height===undefined ? '' : `height:${definition.height}px;`)
        
        for (k in definition){
            fn = (CssPropertiesConverter)[k]
            if (fn){
                style += (fn(definition[k]) + '')
            }
        }
        
        
        if (definition.value){
            this._identifiers = report.getIdentifiers()
            
            definition.value = definition.$value || definition.value
            definition.$value = definition.value
            
            // cria definition.$fields
            definition['$fields'] = {}
            a = definition.value.match(/\${[^}]+}/g) || []
            a.forEach((field)=>{
                definition['$fields'][field] = 1
            })
            
            definition.value = definition.value.replace('${#pages}', '__pages__')

            //cria definition.$getValue
            definition['$getValue'] = utils.compilerTemplate(definition.value, this._identifiers.internal, this._identifiers.userDef)
            a = definition.value.match(/\${[^}]+}/g) || []
            a.forEach((field)=>{
                this._fields.push(field.replace('${', '').replace('}',''))
            })
        }

        this._report = report
        this._section= section

        this._pageInfo      = report.getPageInfo()
        this._definition    = definition
        this._key           = definition.key
        this._autoWrap      = definition.autoWrap
        this._onBeforePrint = definition.onBeforePrint
        this._visible       = definition.visible
        this._value         = definition.value || ''
        this._style         = style + (definition.style ? (''+definition.style) : '')
        
        return this
    }

    value(){
        return this._definition.$getValue ? 
               this._definition.$getValue( this._report.getInternalVars(), this._report.getUserVars(), this._report.getRow()) : 
               this._value
    }

    draw(/* row [optional]*/){
        return '<pre>draw not implemented</pre>'
    }

    getStyle(){
        let o = {}, 
            a = this._style.split('')

        a.forEach((item)=>{
            let p = item.split(':')
            o[p[0]] = p[1]
        })

        return o
    }

    getStyleAttribute(){
        return this._style ? `style="${this._style}"` : ''
    }

    onComplete(){}
}
  
let CssPropertiesConverter = {
    "fontBold"(value){
        return "font-weight:" + (value ? "bold" : "normal")
    },
    "fontSize"(value){
        return "font-size:" + (value + "px")
    },
    "fontUnderline"(value){
        return "text-decoration:" + (value ? "underline" : "normal")
    },
    "fontItalic"(value){
        return "font-style:" + (value ? "italic" : "")
    },
    "textAlign"(value){
        return "text-align:" + (value)
    },
    "background"(value){
        return "background-color:" + value
    },
    "borderStyle"(value){
        return "border-style:" + value
    },
    "borderWidth"(value){
        return "border-width:" + (value + "px")
    },
    "borderColor"(value){
        return "border-color:" + value
    }
}

export default Element

