
let actions = {}
let list = []
let context

const action = {
    context(ctx){
        context = ctx
    },
    register(name, options){
        actions[name] = options
    },

    exec(name, options){
        let a = actions[name]

        if (a){
            options.context = options.context || context
            return a.do.call(options.context, options)
        }

    },

    do(name, options){
        let a = actions[name]

        if (a){
            list.push({name, options})
            options.context = options.context || context
            return a.do.call(options.context, options)
        }
    },

    undo(){
        let a
        let d = list.pop()
        
        if (d){
            a = actions[d.name]
            return  a.undo.call(d.options.context, d.options)
        }
    }
}

export default action
