<script>
import flnElement from './fln-element'

let dragIcon = document.createElement('div')
let count = 1

dragIcon.setAttribute('class', 'fln-text-drag-icon')
dragIcon.innerHTML = '<div class="fln-text-drag-icon1"></div><div class="fln-text-drag-icon2"></div>'

export default {
    extends: flnElement,
    
    dragIcon,

    data(){
        return {
            name:'fln-text',
            type: 'Text',
            properties:{
                text: {
                    value: '',
                    set(value){
                        this.setContent(value)
                    }
                },
                verticalAlign:{
                    type: 'select',
                    value: '',
                    values: ['top', 'bottom', 'center'],
                    set(value){
                        let alias = {top:'flex-start', bottom:'flex-end', center:'center'}
                        let el = this.getContentElement()

                        el.style['align-items'] = alias[value]
                    }
                },
                textAlign:{
                    set(value){
                        let alias = {left:'flex-start', right:'flex-end', center:'center'}
                        let el = this.getContentElement()

                        el.style['justify-content'] = alias[value]
                    }
                }
            }
        }
    },

    props:{
    },

    mounted(){
        this.dragIcon = dragIcon
        this.setProperty('text', 'fln-text-' + (count++))
    },

    methods:{
        
    }
}
</script>

<style>
.fln-text{
    width: 200px;
    height: 30px;
}
.fln-text-content{
    display: flex;
    align-items: center;
    padding: 0 4px;
}
.fln-text-drag-icon{
    position: absolute;
    border: solid 2px #000;
    width: 100px;
    height: 20px;
}
.fln-text-drag-icon1, .fln-text-drag-icon2{
    position: absolute;
    background: #fff;
}
.fln-text-drag-icon1{
    top: -2px;
    bottom: -2px;
    left: 4px;
    right: 4px;
}
.fln-text-drag-icon2{
    top: 4px;
    bottom: 4px;
    left: -2px;
    right: -2px;
}
</style>

