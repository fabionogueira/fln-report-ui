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
                    :class="'fln-tree-item-label ' + node.css"
                    :tree-item-selected="node.selected">{{node.label}}</div>

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

<style>
    .fln-treeview{
        padding-right: 10px;
    }
    .fln-treeview ul{
        cursor: default;
        list-style: none;
        padding-left: 0px;
    }
    .fln-treeview ul, .fln-treeview li{
        position: relative;
    }
    .fln-treeview .fln-tree-item-label{
        display: flex;
        height: 20px;
        align-items: center;
        padding-right: 10px;
        padding-left: 5px;
        white-space: nowrap;
    }
    .fln-treeview li{
        padding-left: 20px;
    }
    .fln-treeview li::before{
        content: "";    
        position: absolute;
        top: 10px;
        left: 10px;
        width: 10px;
        border-top: 1px dotted #607d8b;
    }
    .fln-treeview li::after{
        content: "";
        position: absolute;
        top: 0;
        left: 10px;
        bottom: -1px;
        border-left: 1px dotted #607d8b;
    }
    .fln-treeview li:last-child::after{
        bottom: 10px;
    }
    
    .fln-treeview .fln-tree-item-label:hover{
        color: red
    }
    .fln-treeview [tree-item-selected]{
        background: blue;
        color: #fff;
        border-color:#fff;
    }
</style>
