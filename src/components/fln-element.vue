<template>
    <div :class="'fln-element ' + name"
         :selected="selected"
         @mousedown="onMouseDown">
        <!-- <iframe ref="iframe" onload="this.contentWindow.onresize = ()=>{this.onresize()}"></iframe>         -->

        <div 
            ref="content" 
            :class="'fln-element-content ' + name + '-content'"></div>

        <div 
            ref="designer" 
            class="fln-element-designer"></div>
    </div>
</template>

<script>
import dragManager from '../libs/fln-drag-drop'
import selector from '../libs/fln-selector'

let allElements = {}
let globalSelectedEvent

export default {
    dragCursor: 'none',

    data(){
        return {
            name: '',
            selected: false,
            properties:{
                left: {
                    type: 'number',
                    value: 0,
                    set(value){
                        this.$el.style.left = value + 'px'
                    }
                },
                top: {
                    type: 'number',
                    value: 0,
                    set(value){
                        this.$el.style.top = value + 'px'
                    }
                },
                width: {
                    type: 'number',
                    value: 0,
                    set(value){
                        this.$el.style.width = value + 'px'
                    }
                },
                height: {
                    type: 'number',
                    value: 0,
                    set(value){
                        this.$el.style.height = value + 'px'
                    }
                },
                background:{
                    type: 'color',
                    value:'',
                    set(value){
                        this.$el.style['background'] = value
                    }
                },
                border:{
                    type: 'select',
                    value: '',
                    values: ['none', 'solid', 'dashed', 'dotted', 'double'],
                    set(value){
                        this.$el.style['border-style'] = value
                    }
                },
                borderWidth:{
                    type: 'number',
                    value: 1,
                    set(value){
                        this.$el.style['border-width'] = value + 'px'
                    }
                },
                borderColor: {
                    type: 'color',
                    set(value){
                        this.$el.style['border-color'] = value
                    }
                },
                textColor: {
                    type: 'color',
                    set(value){
                        this.$el.style['color'] = value
                    }
                },
                textAlign:{
                    type: 'select',
                    value: '',
                    values: ['left', 'right', 'center'],
                    set(value){
                        this.$el.style['text-align'] = value
                    }
                },
                fontSize: {
                    type: 'number',
                    set(value){
                        this.$el.style['font-size'] = value + 'px'
                    }
                },
                bold: {
                    type: 'boolean',
                    set(value){
                        this.$el.style['font-weight'] = value ? 'bold' : 'normal'
                    }
                }
            }
        }
    },

    props: {
        grid: {
            type: Number,
            default: 0,
            visibility: 'designer'
        },
        resizable:{
            type: Boolean,
            default: true,
            visibility: 'designer'
        },
        draggable:{
            type: Boolean,
            default: true,
            visibility: 'designer'
        },
        selectors:{
            type: Object,
            default: null,
            visibility: 'designer'
        }
    },

    created(){
        allElements[this._uid] = this
    },

    mounted(){
        let name, prop

        this.$el.style['z-index'] = 1 

        this.initializing = true

        for (name in this.properties){
            prop = this.properties[name]
            if (prop) this.setProperty(name, prop.value)
        }

        delete(this.initializing)
    },

    destroyed(){
        let el = this.$el

        if (this.__customListeners){
            this.__customListeners.forEach(item => {
                el.removeEventListener(item.event, item.callback)
            })

            delete(this.__customListeners)
        }
        
        if (this.selected){
            this.$emit('selected', null)
            if (globalSelectedEvent){
                globalSelectedEvent(null)
            }
        }

        delete(allElements[this._uid])
    },

    methods: {
        super(method, ...params){
            let s = this.$options.extends

            if (s){
                return s.methods[method].apply(this, params)
            }
        },

        // retorna a sessão do componente
        section(){
            let el = this.$el.closest('.fln-section')

            if (el){
                return el.__vue__
            }
        },

        ref(){
            return this.$vnode.key
        },

        on(event, callback){
            let fn = (evt) => {
                callback.call(this, evt)
            }

            this.__customListeners = this.__customListeners || []
            this.__customListeners.push({fn, event})

            this.$el.addEventListener(event, fn)
        },

        off(event, callback){
            let index

            if (this.__customListeners){
                index = this.__customListeners.findIndex(item => item.fn == callback && item.event == event)

                if (index >= 0){
                    this.$el.removeEventListener(event, callback)
                    this.__customListeners.splice(index, 1)
                }
            }
        },

        getJSON(){
            let i, prop
            let json = {}

            for (i in this.properties){
                prop = this.properties[i]
                
                if (prop && prop.value != undefined && prop.value != prop.default){
                    json[i] = prop.value
                }
            }

            this.$children.forEach(child => {
                let j, k
                let obj = {}

                if (!json.children) {
                    json.children = []
                }

                j = child.getJSON()

                for (k in j){
                    obj[k] = j[k]
                }
                obj.type = child.type

                json.children.push(obj)
            })

            return json
        },

        sendToBack(){
            let i = (Number(this.$el.style['z-index']) || 1) - 1

            if (i<0) i = 0

            this.$el.style['z-index'] = i
        },

        bringToFront(){
            let i = (Number(this.$el.style['z-index']) || 1) + 1

            this.$el.style['z-index'] = i
        },

        selectorRender(){
            selector.render()
        },

        setProperty(name, value){
            let v, old, changed
            let prop = this.properties[name]
            
            if (prop){
                old = prop.value
                changed = prop.value != value
                
                if (prop.set && (changed || this.initializing)){
                    switch (prop.type){
                        case 'boolean': value = toBoolean(value); break;
                        case 'number':  value = Number(value); break;
                    }

                    v = prop.set.call(this, value)
                    
                    if (v != undefined){
                        value = v
                    }
                    
                    prop.value = value
                    selector.render()
                    
                    this.$emit('changed', {name, value, old})
    
                    return true
                }
            }

            return false
        },

        getProperty(name){
            let prop = this.properties[name]
            let fn = this['get' + name[0].toUpperCase() + name.substring(1)]

            if (!prop) return

            return fn ? fn() : prop.value
        },

        getProperties(){
            let prop, name
            let properties = {name: this.name}

            for (name in this.properties){
                prop = this.properties[name]

                if (prop && prop.visible != false){
                    properties[name] = prop.value
                }

            }

            return properties
        },

        setSelected(persistence = false){
            let self = this

            if (this.selected){
                return
            }

            if (!persistence){
                this.unselectAll()
            }

            this.selected = true

            selector.show({
                selectors: this.selectors,
                target:this.$el,
                grid: this.grid,
                changed(){
                    self.setProperty('top', self.$el.offsetTop)
                    self.setProperty('left', self.$el.offsetLeft)
                    self.setProperty('width', self.$el.offsetWidth)
                    self.setProperty('height', self.$el.offsetHeight)
                }
            })

            this.$emit('selected', this)

            if (globalSelectedEvent){
                globalSelectedEvent(this)
            }
        },

        setContent(html){
            this.$refs.content.innerHTML = html
        },

        setContentDesigner(html){
            this.$refs.designer.innerHTML = html
        },

        getContentElement(){
            return this.$refs.content
        },

        unselect(){
            if (this.selected){
                this.selected = false
                selector.hide()
                this.$emit('unselected', this)

                if (globalSelectedEvent){
                    globalSelectedEvent(null)
                }
            }
        },

        unselectAll(){
            for(let uid in allElements){
                allElements[uid].unselect()
            }
        },

        create(Class, options = {}){
            let comp = new Class()

            return this.add(comp, options)
        },

        add(component, options){
            let n

            if (!component.$el){
                component.$mount() // $mount() cria $el
            }

            this.$refs.content.appendChild(component.$el)

            for (n in options){
                component.setProperty(n, options[n])
            }

            allElements[component._uid] = component
            this.$children.push(component)

            this.$emit('add', {component, parent:this})

            return component
        },

        remove(component){
            let index = this.$children.findIndex(child => child == component)

            component.$destroy()
            component.$el.parentNode.removeChild(component.$el)

            if (index >= 0){
                this.$children.splice(index, 1)
            }

            this.$emit('remove', {component, parent:this})
        },

        onMouseDown(event){
            let self = this

            if (event.target.getAttribute('stop-propagation')) return

            event.stopPropagation()

            if (!this.selected){
                this.setSelected()

            } else if (this.draggable) {
                dragManager.start({
                    grid: this.grid,
                    dragsource: this.$el,
                    dropdisabled: true,
                    cursor: 'move',
                    mouseX: event.mouseX,
                    mouseY: event.mouseY,
                    drag(){                    
                        self.setProperty('top', self.$el.offsetTop)
                        self.setProperty('left', self.$el.offsetLeft)
                    }
                })
            }
        }
    },
    onSelected(callback){
        globalSelectedEvent = callback
    }
}

function toBoolean(value){
    let values = {
        'true': true,
        'false': false
    }

    if (typeof(value) == 'string'){
        return values[value]
    }

    return Boolean(value)
}
</script>

<style>
.fln-element{
    position: absolute;
    cursor: default;
    border: none;
    background: #fff;
    box-sizing: border-box;
    user-select: none;
    width: 100px;
    height: 80px;
}
.fln-element-content{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    border: dashed 1px #75757538;
}
.fln-element-designer{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: visible;
}
/* .fln-element[selected]{
    background: #e0e0e030;
} */
.fln-element iframe{
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}
</style>

