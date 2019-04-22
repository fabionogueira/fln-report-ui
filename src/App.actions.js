import action from './libs/fln-action'

action.register('create',{
    do(options){
        let componentDef = this.getComponentByName(options.name)
        let component = options.section.create(componentDef.class, options.properties)

        options.component = component
        component.setSelected()

        return component
    },
    undo(options){
        action.exec('remove', {component: options.component})
    }
})

action.register('add',{
    do(options){
        let component = options.component
        let properties = options.properties
        let section = options.section

        section.add(component, properties)
        component.setSelected()

        return component
    },
    undo(options){
        action.exec('remove', {component: options.component})
    }
})

action.register('remove',{
    do(options){
        let component = options.component

        if (component){
            options.section = options.component.section()

            component.unselect()
            options.section.remove(component)
        }
    },
    undo(options){
        let properties = options.component.getProperties()
        let component = options.component
        let section = options.section

        action.exec('add', { component, properties, section })
    }
})

export default action