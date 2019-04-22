<template>
    <div 
        drag
        :drag-cursor="dragCursor"
        @drag="onDrag"
        @dragstart="onDragStart"
        :class="'fln-splitter fln-splitter-' + dataOrientation"></div>
</template>

<script>

// import flnDragDrop from '../../../libs/fln-drag-drop'

export default {
    data(){
        return {
            dataOrientation: null,
            dataTarget: null,
            dragCursor: null
        }
    },
    props:{
        orientation: String, // vertical | horizontal
        target: String // (after|before) | id attribute
    },

    mounted(){
        let el = this.$el

        this.dataOrientation = this.orientation || (el.offsetWidth > el.offsetHeight ? 'horizontal' : 'vertical')
        this.dataTarget = this.target || 'before'
        this.dragCursor = this.dataOrientation == 'horizontal' ? 'ns-resize' : 'ew-resize'
    },

    methods: {
        onDragStart(){
            let el = this.$el
            let target = this.dataTarget == 'before' ? el.previousElementSibling : el.nextElementSibling

            if (target){
                this._height = target.offsetHeight
                this._width = target.offsetWidth
                console.log(this._width)
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
        }
    }
}

</script>

<style scoped>
    .fln-splitter{
        background: #e1e1e1;
    }
    .fln-splitter-vertical{
        min-width: 5px;
        cursor: ew-resize
    }
    .fln-splitter-horizontal{
        min-height: 6px;
        cursor: ns-resize
    }
</style>
