<template>
    <transition name="flnmodal-fade">
        <div v-if="visible" class="fln-modal">

            <div v-if="visible" ref="content" class="fln-modal-content">
                <slot />
            </div>

        </div>
    </transition>
</template>

<script>

// import flnDragDrop from '../../../libs/fln-drag-drop'

export default {
    data(){
        return {
            hcentered: false,
            vcentered: false,
            visible: false
        }
    },
    props:{
        // fullscreen: Boolean,
        persistent: Boolean, //não fecha ao clicar fora
        // hideOverlay: Boolean, //esconde o background
        left: String,
        top: String,
        width: String,
        height: String,
        animation: {
            default: 'zoom'
        }
    },

    mounted(){
        // centraliza horizontalmente se não foi definido left
        if (!this.left){
            // this.hcentered = true
        }
        console.log(99)
        // centraliza verticamente se não foi definido top
        if (!this.top){
            setTimeout(()=>{
                this.show()
            }, 2000)
        }
    },

    methods: {
        show(){
            this.visible = true
        },
        onDragStart(){
            let el = this.$el
            let target = this.dataTarget == 'before' ? el.previousElementSibling : el.nextElementSibling

            if (target){
                this._height = target.offsetHeight
                this._width = target.offsetWidth
            }
        },

        onDrag(event){
            let el = this.$el
            let mouse = event.detail.mouse
            let target = this.dataTarget == 'before' ? el.previousElementSibling : el.nextElementSibling
            let dX = this.dataTarget == 'before' ? mouse.movimentX : -mouse.movimentX
            let dY = this.dataTarget == 'before' ? mouse.movimentY : -mouse.movimentY
            
            if (target){
                if (this.dataOrientation == 'horizontal'){
                    target.style.height = (this._height + dY) + 'px'
                } else {
                    target.style.width = (this._width + dX) + 'px'
                }
            }

            event.preventDefault()
        },

        onTransitionEnter(){
            let container = this.$el
            let content = this.$refs.content
            console.log(9)
            if (container.getAttribute('fullscreen') != null){
                content.style['margin-top'] = ''
            } else {
                content.style['margin-top'] = ((container.offsetHeight / 2) - (content.offsetHeight / 2) ) + 'px'
            }
        }
    }
}

</script>

<style scoped>
    .fln-modal{
        position: fixed;
        background: rgba(0, 0, 0, 0.04);
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
    }
    .fln-modal[hide-overlay]{
        width: 0;
        right: initial;
    }
    .fln-modal-content{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 300px;
        background: #fff;
        box-shadow: 0 2px 8px #2727276b;
    }
    [fullscreen] .fln-modal-content{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: initial;
        height: initial;
    }
    [hcentered]{
        display: flex;
        justify-content: center;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        height: 0;
    }
</style>
