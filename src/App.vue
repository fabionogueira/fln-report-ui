<template>
    <div id="app" class="vbox">
        <hbox box-test>Report Edit</hbox>
        <hbox class="client">
            
            <fln-splitter></fln-splitter>

            <client style="padding:4px">
                <el-tabs type="border-card" class="tabs-client" v-model="activeTab" xtab-click="handleClick">
                    <!-- tab designer -->
                    <el-tab-pane label="Designer" name="designer" style="height:100%">
                        <hbox class="toolbar">
                            <el-button size="small" :disabled="!selectedComponentIsChild" @click="bringToFront()">bringToFront</el-button>
                            <el-button size="small" :disabled="!selectedComponentIsChild" @click="sendToBack()">sendToBack</el-button>
                            <el-button icon="el-icon-edit" title="copy" :disabled="!selectedComponentIsChild" @click="copy"></el-button>
                            <el-button size="small" :disabled="!selectedComponentIsChild" @click="cut">cut</el-button>
                            <el-button size="small" @click="paste">paste</el-button>
                            <el-button size="small" :disabled="!selectedComponentIsChild" @click="remove">delete</el-button>
                            <el-button size="small" @click="undo">undo</el-button>
                            <el-button size="small">redo</el-button>
                            <el-button size="small" @click="getJSON">getJSON</el-button>
                        </hbox>

                        <client>
                            <vbox>
                                <vbox>
                                    components
                                    <button @click="dragComponent('fln-text', $event)">fln-text</button>
                                    <button>line</button>
                                    <button>rectangle</button>
                                    <button>elipse</button>
                                    <button>page break</button>
                                    <button>sub report</button>
                                </vbox>

                                <fln-splitter></fln-splitter>
                                
                                <hbox>
                                    <fln-tree-view ref="tree" 
                                        :root="componentsTree"
                                        @itemclick="onTreeItemClick"></fln-tree-view>
                                </hbox>
                            </vbox>

                            <fln-splitter></fln-splitter>

                            <client class="page-content">
                                <div class="page-design"> 
                                    <fln-section class="section-content section-grid" dropzone
                                        v-for="item in componentsTree.children"
                                        v-show="item.visible"
                                        :key="item.id"
                                        :ref="item.id"
                                        :label="item.label"
                                        :type="item.id"
                                        @add="onComponentAdded"
                                        @remove="onComponentRemoved"></fln-section>
                                </div>
                            </client>

                            <fln-splitter target="after"></fln-splitter>

                            <vbox>
                                <div>report</div>
                                <div style="overflow:hidden">
                                    <table border="1">
                                        <tr><td>paper</td><td>A4</td></tr>
                                        <tr><td>orientation</td><td>portrait</td></tr>
                                        <tr><td>margin left</td><td>3</td></tr>
                                        <tr><td>margin top</td><td>3</td></tr>
                                        <tr><td>margin right</td><td>3</td></tr>
                                        <tr><td>margin bottom</td><td>3</td></tr>
                                        <tr><td>columns</td><td>1</td></tr>
                                        <tr><td>column spacing</td><td>1</td></tr>
                                        
                                        <tr v-for="item in componentsTree.children" :key="item.id+'-tr'">
                                            <td>{{item.label}}</td>
                                            <td><input type="checkbox" v-model="item.visible"></td>
                                        </tr>                        
                                    </table>
                                </div>
                                <fln-splitter></fln-splitter>
                                <fln-inspector class="client" ref="inspector" @changed="onPropertyChanged"></fln-inspector>
                            </vbox>
                        </client>

                    </el-tab-pane>

                    <el-tab-pane label="JSON" name="second">JSON</el-tab-pane>
                    <el-tab-pane label="Test" name="third">Test</el-tab-pane>
                </el-tabs>
            </client>

            
        </hbox>

        <!-- <fln-modal>
            <h1>MODAL</h1>
        </fln-modal> -->
    </div>
</template>

<script>
import Vue from 'vue'
import flnText from './components/fln-text.vue'
import fnlElement from './components/fln-element.vue'
import dragManager from './libs/fln-drag-drop'
// import flnReport from './libs/fln-report'
import actions from './App.actions.js'

let clipboard
let elements = {
    'fln-text': Vue.extend(flnText)
}
    
export default {
    name: 'app',
    data(){
        return {
            activeTab: 'designer',
            selectedComponent: null,
            componentsTree: {
                children:[
                    {label: 'report header', id:'report-header', visible:true, selected:false, css:'tree-section-header'},
                    {label: 'page header', id:'page-header', visible:true, selected:false, css:'tree-section-header'},
                    {label: 'column header', id:'column-header', visible:false, selected:false, css:'tree-section-header'},
                    {label: 'detail', id:'detail', visible:true, selected:false, css:'tree-section-header'},
                    {label: 'column footer', id:'column-footer', visible:false, selected:false, css:'tree-section-header'},
                    {label: 'page footer', id:'page-footer', visible:true, selected:false, css:'tree-section-header'},
                    {label: 'summary', id:'summary', visible:true, selected:false, css:'tree-section-header'}
                ]
            }
        }
    },
    computed:{
        selectedComponentIsChild(){
            return this.selectedComponent ? this.selectedComponent.name != 'fln-section' : false
        }
    },
    created(){
        actions.context(this)
        fnlElement.onSelected(this.onSelected)
        document.addEventListener('keydown', (event) => { this.onKeyDown(event) })
    },

    methods:{
        getComponentByName(name){
            let Class = elements[name]

            if (Class){
                return {
                    class: Class,
                    icon: Class.options.dragIcon,
                    cursor: Class.options.dragCursor || Class.options.extends.dragCursor
                }
            }

            return null
        },

        dragComponent(name, event){
            let icon, rect, cursor
            let self = this
            let componentDef = this.getComponentByName(name) 

            if (componentDef){
                icon = componentDef.icon
                cursor = componentDef.cursor
                rect = event.target.getBoundingClientRect()
                
                icon.setAttribute('style', `z-index:9999999; left:${rect.left}px; top:${rect.top}px; width:${rect.width}px; height:${rect.height}px; display:block`)
                
                document.body.appendChild(icon)

                dragManager.start({
                    cursor,
                    mode  : 'dragdrop',
                    dragsource: icon,
                    mouseX: event.mouseX,
                    mouseY: event.mouseY,
                    drop(evt){
                        let section = evt.droptarget.__vue__ // self.$refs[evt.droptarget.getAttribute('ref-id')][0]
                        
                        if (section){
                            self.add(section, name, {
                                left: parseInt(evt.mouse.dragsourceX),
                                top: evt.mouse.dragsourceY,
                                width: icon.offsetWidth,
                                height: icon.offsetHeight
                            })
                        }
                    },
                    dragend(){
                        icon.style.display = 'none'
                    }
                })
            }
        },

        add(section, name, properties){
            actions.do('create', { section, name, properties })
        },

        remove(){
            actions.do('remove', {component: this.selectedComponent})
        },

        copy(){
            if (this.selectedComponentIsChild){
                clipboard = this.selectedComponent.getProperties()
            }
        },

        cut(){
            if (this.selectedComponentIsChild){
                clipboard = this.selectedComponent.getProperties()
                this.remove()
            }
        },

        paste(){
            let properties

            if (this.selectedComponent && this.selectedComponent.name == 'fln-section'){
                properties = clipboard
                this.add(this.selectedComponent, properties.name, properties)
            }
        },

        bringToFront(){
            if (this.selectedComponentIsChild){
                this.selectedComponent.bringToFront()
            }
        },

        sendToBack(){
            if (this.selectedComponentIsChild){
                this.selectedComponent.sendToBack()
            }
        },

        undo(){
            actions.undo()
        },

        getJSON(){
            let json = {}

            this.componentsTree.children.forEach(item => {
                let section = this.$refs[item.id][0]
                
                if (item.visible){
                    json[section.type] = section.getJSON()
                }
            })

            console.log(json)
        },

        setActiveComponent(component){
            let tree = this.$refs.tree

            this.$refs.inspector.observe(component)
            this.selectedComponent = component

            if (component){
                component.setSelected()
                if (component.name=='fln-section'){
                    tree.setSelected(component.ref())
                } else {
                    tree.setSelected(`tree-${component._uid}`)
                }
                
            }
        },

        // event: ao adicionar um novo componente em qualquer seção
        onComponentAdded(event){
            let section = event.parent
            let component = event.component
            let tree = this.$refs.tree
            let parentId = section.ref()
            let id = `tree-${component._uid}`

            tree.add(parentId, {
                id,
                label: component.name,
                component
            })
        },

        onComponentRemoved(event){
            let component = event.component
            let tree = this.$refs.tree
            let id = `tree-${component._uid}`
            
            tree.remove(id)
        },

        // evento: quando um elemento for selecionado
        onSelected(component){
            this.setActiveComponent(component)
        },

        onTreeItemClick(data){
            let section

            if (data.component){
                this.setActiveComponent(data.component)
            } else {
                section = this.$refs[data.id][0]
                if (section){
                    this.setActiveComponent(section)
                }
            }
        },

        onPropertyChanged(event){
            console.log(event)
        },

        onResizeSectionMouseDown(event){
            let section = event.target.previousElementSibling
            let height = section.offsetHeight

            dragManager.start({
                dragsource: event.target,
                cursor: 'ns-resize',
                mouseX: event.mouseX,
                mouseY: event.mouseY,
                drag(evt){
                    section.style.height = (height + evt.mouse.movimentY) + 'px'
                    
                    event.preventDefault()
                }
            })
        },

        onKeyDown(event){
            let l, t
            let c = this.selectedComponent
            
            if (document.activeElement == document.body){
                if (event.ctrlKey && event.code == 'KeyZ'){
                    this.undo()
                    event.stopPropagation()
                }

                // movimentar um componente selecionado com as setas do teclado, copiar, colar, recortar, excluir
                if (c){
                    l = Number(c.getProperty('left'))
                    t = Number(c.getProperty('top'))
    
                    if (event.code == 'Delete'){
                        this.remove()
                    }
    
                    if (event.ctrlKey){
                        switch (event.code){
                            case 'KeyC': this.copy(); break
                            case 'KeyX': this.cut(); break
                            case 'KeyV': this.paste(); break
                        }
                    }
    
                    switch (event.keyCode){
                        case 37: c.setProperty('left', l - 1); break //esquerda
                        case 39: c.setProperty('left', l + 1); break //direita
                        case 38: c.setProperty('top', t - 1); break //cima
                        case 40: c.setProperty('top', t + 1); break //baixo
                    }
    
                    event.stopPropagation()
                }
            }
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
body{
    overflow: hidden;
}
.report{
    position: relative;
    width: 100%;
    overflow: auto;
    cursor: default;
}
.page-content{
    display: block;
    position: relative;
    height: 100%;
    overflow: auto;
}
.page-design{
    margin: 4px 10px;
    padding: 4px;
    border: solid 1px #dcdfe6;
    box-shadow: 0 3px 5px #00000014;
}
.xx-section-grid{
    background: url('assets/grid-20.png');
}
.tree-section-header{
    font-weight: bold;
}
</style>
