<template>
    <vbox class="fln-inspector">
        <div>properties</div>
        <client>
            
            <table border="1" style="width:100%">
                <tr v-for="property in properties" 
                    :key="property.name"
                    @click="onRowClick(property.name)">
                    <td>
                        <div class="fln-inspector-property-name">{{property.name}}</div>
                    </td>
                    <td>
                        <div class="fln-inspector-property-value">
                            <!-- text -->
                            <input type="text"
                                v-if="activeProperty==property.name && property.type == 'text'" 
                                v-model="property.value"
                                input
                                @blur="onEditorBlur"
                                @input="onValueChange(property.name, $event.target.value)"
                            />

                            <!-- number -->
                            <input type="number"
                                v-if="activeProperty==property.name && property.type == 'number'" 
                                v-model="property.value"
                                input
                                @blur="onEditorBlur"
                                @input="onValueChange(property.name, $event.target.value)"
                            />

                            <!-- list -->
                            <select
                                v-if="activeProperty==property.name && property.type == 'select'" 
                                v-model="property.value"
                                input
                                @blur="onEditorBlur"
                                @input="onValueChange(property.name, $event.target.value)"
                            >
                                <option v-for="item in property.values" :key="item" :value="item">{{item}}</option>
                            </select>

                            <!-- boolean-->
                            <select
                                v-if="activeProperty==property.name && property.type == 'boolean'" 
                                v-model="property.value"
                                input
                                @blur="onEditorBlur"
                                @input="onValueChange(property.name, $event.target.value)"
                            >
                                <option v-for="item in [true, false]" :key="item" :value="item">{{item}}</option>
                            </select>

                            <!-- color -->
                            <hbox
                                class="color-picker"
                                v-if="activeProperty==property.name && property.type == 'color'" >
                                <input class="client"
                                    input
                                    v-model="property.value"
                                    @input="onValueChange(property.name, $event.target.value)">
                                <el-color-picker
                                    @change="onValueChange(property.name, property.value)"
                                    v-model="property.value"></el-color-picker>
                            </hbox>

                            <div v-else-if="property.type=='color'" :style="'background:'+property.value" class="fln-inspector-property-name">
                                {{property.value || 'transparent'}}
                            </div>
                            <span v-else>{{property.value}}</span>
                        </div>
                    </td>
                </tr>
            </table>

        </client>
    </vbox>
</template>

<script>
import Vue from 'vue'

export default {
    data(){
        return {
            activeProperty: null,
            properties:{}
        }
    },

    props: {
    },

    methods: {
        observe(component){
            let name, prop
            
            this.properties = {}
            this.component = component

            if (component){
                for (name in component.properties){
                    prop = component.properties[name]
    
                    if (prop){
                        Vue.set(this.properties, name, {
                            name,
                            type: prop.type || 'text',
                            value: prop.value,
                            values: prop.values
                        })
                    }
                }

                component.$on('changed', this.onComponentPropertyChanged)
            }
        },
        onComponentPropertyChanged(event){
            this.properties[event.name].value = event.value
        },
        onRowClick(name){
            this.activeProperty = name

            this.$nextTick(()=>{
                let el = this.$el.querySelector('[input]')
                el.focus()
            })
            
        },
        onEditorBlur(){
            let el = this.$el.querySelector('[input]')
                
            if (el){
                this.activeProperty = null
            }
        },
        onValueChange(name, value){
            this.component.setProperty(name, value)
        }
    }
}

</script>

<style>
.fln-inspector-property-name{
    width: 100px;
    height: 20px;
    overflow: hidden;
}
.fln-inspector-property-value{
    width: 100px;
    height: 20px;
    overflow: hidden;
    padding-left: 6px;
    line-height: 20px;
}
.fln-inspector-property-value input, .fln-inspector-property-value select{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 1px;
    border: none;
}
.color-picker .el-color-picker{
    height: 20px;
    width: 20px;
}
.color-picker .el-color-picker__trigger{
    height: 100%;
    width: 100%;
    padding: 0;
}
.color-picker input{
    height: 20px;
    padding-left: 6px;
}
</style>
