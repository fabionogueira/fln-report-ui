<script>
import dragManager from '../libs/fln-drag-drop'
import flnElement from './fln-element'

export default {
    extends: flnElement,
    data(){
        return {
            name: 'fln-section',
            properties:{
                left: null,
                top: null,
                width: null,
                height:{
                    value: 50,
                    set(value){
                        if (value < 25){
                            value = 25
                        }

                        this.$el.style.height = (value + 21) + 'px'

                        return value
                    }
                },
                border: null,
                borderWidth: null,
                borderColor: null
            }
        }
    },

    props:{
        type: String,
        label: String,
        resizable:{
            default: false
        },
        draggable:{
            default: false
        },
        selectors:{
            default(){
                return {}
            }
        }
    },

    mounted(){
        // .on faz parte do fln-element, o $on do Vue não aceita eventos nativos, somente eventos chamados com $emit
        this.on('mousedown', this.onMouseDownResizer)

        //   ajuste da área da área 'droptarget', isso diz ao fln-drag-drop para 
        // considerar o elemento this.$refs.content no cálculo da posição dentro do 'droptarget'
        this.$el.droptarget = this.$refs.content

        this.setContentDesigner(`
            <div class="section section-title">${this.label}</div>
            <div class="section-bottom" resizer="1" stop-propagation="1"></div>`)
    },

    methods:{
        // exemplo de como usar o super (método do fln-element)
        // add(component, options){
        //     return this.super('add', component, options)
        // },

        onMouseDownResizer(event){
            let height
            let section = this
            let isResizer = event.target.getAttribute('resizer')
            
            if (isResizer){
                height = section.getProperty('height')

                // cancela o evento para que o fln-element não selecione este 
                event.stopPropagation()

                dragManager.start({
                    dragsource: event.target,
                    cursor: 'ns-resize',
                    mouseX: event.mouseX,
                    mouseY: event.mouseY,
                    drag(evt){
                        section.setProperty('height', height + evt.mouse.movimentY)
                        return false
                    }
                })
            }
        }
    }
}
</script>

<style>
    .section-bottom{
        background: transparent;
        position: absolute;
        bottom: -5px;
        height: 5px;
        left: 0;
        right: 0;
        cursor: ns-resize;
    }
    .section-title{
        background: #e1e1e1;
        text-align: center;
        color: #505050;
        width: 100%;
        padding: 2px 0;
        font-size: 12px;
        height:16px;
        overflow: hidden
    }
    .fln-section{
        width: 100%;
        position: relative;
        transition: background-color .8s;
        margin-bottom: 4px;
    }
    .fln-section-content{
        border-style: solid;
        border-top: none;
        top: 20px;
    }
    .fln-section[selected] .fln-section-content{
        background: #e4e4e445;
    }
    .fln-section[selected] .fln-section-selector{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background:#a4a4a4;
    }
    .fln-section[dropzone-active]{
        background-color: #607d8b8c;
    }
</style>
