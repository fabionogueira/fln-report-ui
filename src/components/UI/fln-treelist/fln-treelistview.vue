<template>
<div class="fln-treeview">
    <ul class="fln-treeview-root" @click="onClick">
        <template v-for="node in root.children">
            <li level="0"
                v-if="node.visible"
                :tree-item="node.id" 
                :key="node.id" 
            >
                <div 
                    :class="'fln-tree-row ' + node.css"
                    :tree-item-selected="node.selected">
                    <div class="fln-label">{{node.label}}</div>
                </div>

                <fln-tree-item :root="node"></fln-tree-item>
            </li>
        </template>
    </ul>
</div>
</template>

<script>
import Vue from 'vue'
import flnTree from '../../../libs/fln-tree'

export default {
    created(){
        this.tree = flnTree({
            root: this.root
        })
    },
    props:{
        root: {
            type: Object,
            default(){
                return {
                    id: 0,
                    children:[]
                }
            }
        }
    },
    methods: {
        add(parentOrId, data){
            let parent = this.tree.find(parentOrId)

            if (parent && !parent.children){
                Vue.set(parent, 'children', [])
            }

            return this.tree.add(parentOrId, data)
        },
        remove(id){
            return this.tree.remove(id)
        },
        find(id){
            return this.tree.find(id)
        },
        findElement(id){
            let item = this.find(id)
            
            return item ? this.$el.querySelector(`[tree-item="${id}"]`) : null
        },
        getSelected(){
            let el = this.$el.querySelector('[tree-item]')

            if (el){
                return this.find(el.getAttribute('tree-item'))
            }
        },
        setSelected(id){
            let data = this.tree.find(id)

            if (data && !data.selected){
                this.unSelectedAll()
                data.selected = true
                this.$emit('itemselected', data)
            }
        },
        unSelected(id){
            let data = this.tree.find(id)

            if (data){
                data.selected = false
            }
        },
        unSelectedAll(){
            let i
            let nodes = this.tree.nodes()
            
            for (i in nodes){
                nodes[i].selected = false
            }
        },
        onClick(event){
            let data
            let item = event.target.closest('[tree-item]')

            if (item){
                data = this.tree.find(item.getAttribute('tree-item'))
                this.$emit('itemclick', data)
                this.setSelected(data.id)
            }
        }
    }
}

</script>

<style scoped>
    .fln-treelist{
        padding-right: 10px;
    }
    .fln-treelist ul{
        cursor: default;
        list-style: none;
        padding-left: 0px;
    }
    .fln-treelist ul, .fln-treelist li{
        position: relative;
    }
    .fln-treelist .fln-tree-row{
        position: relative;
        display: flex;
        height: 20px;
        align-items: center;
        padding-right: 10px;
        padding-left: 5px;
    }
    .fln-treelist [level="0"] .fln-tree-row{padding-left: 20px;}
    .fln-treelist [level="1"] .fln-tree-row{padding-left: 40px;}
    .fln-label{
        padding-left: 10px;
        border-left: solid 1px red;
    }
    .fln-treelist li{
        /* padding-left: 20px; */
    }
    .xxfln-treeview .fln-tree-item-label::before{
        content: "";
        position: relative;
        margin-top: 3px;
        margin-right: 4px;
        width: 10px;
        border-top: 1px dotted #607d8b;
    }
    .xxfln-treeview li::after{
        content: "";
        position: absolute;
        top: 0;
        left: 10px;
        bottom: -1px;
        border-left: 1px dotted #607d8b;
    }
    .fln-treelist li:last-child::after{
        /* bottom: 10px; */
    }
    
    .fln-treelist .fln-tree-item-label:hover{
        color: red
    }
    .fln-treelist [tree-item-selected]{
        background: blue;
        color: #fff;
        border-color:#fff;
    }
    .xxxfln-treeview [tree-item-selected]:before {
        position: absolute;
        content: "";
        right: 0;
        height: 100%;
        top: 0;
        left: -10px;
        background: red;
    }
</style>
