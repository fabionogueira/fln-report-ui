

const tree = function(options = {}){
    let root = options.root || {children:[]}
    let nodes = {}
    let indexId = 0
    let rootId = `tree-1-node-0`
    
    nodes[rootId] = root
    root.id = rootId
    root.children = root.children || []
    
    initChildren(root.children)
    
    function initChildren(children){
        let i, item

        if (children){
            for (i in children){
                item = children[i]
                item.id = item.id || id()
                item.visible = item.visible == undefined ? true : item.visible
                item.selected = item.selected == undefined ? false : item.selected
                item.css = item.css || ''

                nodes[item.id] = item
                initChildren(item.children)
            }
        }
    }

    function id(){
        return (`${rootId}-${indexId++}`)
    }

    return {
        add(parentOrId, data = {}){
            let parent, k
            let node = {}

            if (!parentOrId){
                parent = root
            } else if (typeof(parentOrId) == 'string'){
                parent = this.find(parentOrId)
            } else {
                parent = parentOrId
            }

            node.visible = true
            node.selected = false

            for (k in data){
                node[k] = data[k]
            }

            node.parent = parent.id
            node.id = node.id || id()
            
            parent.children = parent.children || []
            parent.children.push(node)
            nodes[node.id] = node

            if (options.changed){
                options.changed.apply(this, ['add', node, parent])
            }

            return node
        },

        remove(id){
            let parent, index
            let node = this.find(id)

            if (node){
                parent = this.find(node.parent)
                index = parent.children.findIndex(n => {return n.id == id} )
                parent.children.splice(index, 1)
                delete (nodes[node.id])
            }

            if (options.changed){
                options.changed.apply(this, ['remove', node, parent])
            }

            return node
        },

        find(id = null){
            return nodes[id || rootId]
        },

        nodes(){
            return nodes
        }
    }
}

export default tree
