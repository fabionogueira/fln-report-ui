<template>
    <ul class="fln-treeview-ul-item" v-if="root.children">
        <template v-for="node in root.children">
            <li 
                v-if="node.visible"
                :level="level"
                :tree-item="node.id" 
                :key="node.id" 
            >
                <div 
                    :class="'fln-tree-row ' + node.css"
                    :tree-item-selected="node.selected">
                    <div class="fln-label">{{node.label}}</div>
                </div>

                <fln-tree-item :root="node" :level="level+1"></fln-tree-item>
            </li>
        </template>
    </ul>
</template>

<script>
export default {
    props:{
        level: {
            default: 1
        },
        root: {
            type: Object,
            default(){
                return {}
            }
        }
    }
}
</script>
