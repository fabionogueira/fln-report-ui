
// @ts-check

import dragManager from '../libs/fln-drag-drop'

let activeOptions
let corners = {}

const selector = {
    show(options){
        let k

        activeOptions = options

        if (!corners.tl){
            corners.tl = selector.createElement('tl', 'nw-resize')
            corners.tc = selector.createElement('tc', 'n-resize')
            corners.tr = selector.createElement('tr', 'ne-resize')
            corners.bl = selector.createElement('bl', 'sw-resize')
            corners.bc = selector.createElement('bc', 's-resize')
            corners.br = selector.createElement('br', 'se-resize')
            corners.lc = selector.createElement('lc', 'w-resize')
            corners.rc = selector.createElement('rc', 'e-resize')
        }
        
        for (k in corners){
            if (options.selectors){
                if (options.selectors[k]) options.target.appendChild(corners[k])
            }else {
                options.target.appendChild(corners[k])
            }
        }    

        selector.render()
    },

    hide(){
        let k, p

        activeOptions = null

        for (k in corners){
            p = corners[k].parentNode
            if (p) p.removeChild(corners[k])
        }
    },

    onContentLoaded(){
        let style = document.createElement('style')

        style.setAttribute('type', 'text/css')
        style.appendChild(document.createTextNode(`
            .tl, .tc, .tr, .bl, .bc, .br, .lc, .rc{
                position: absolute;
                background: #FF9800;
                width: 4px;
                height: 4px;
                z-index:10;
            }
            .tl{top:0; left:0; cursor:nw-resize;}
            .tc{top:0; left:50%; margin-left:-2px; cursor:n-resize;}
            .tr{top:0; right:0; cursor:ne-resize;}
            .bl{bottom:0; left:0; cursor:sw-resize;}
            .bc{bottom:0; left:50%; margin-left:-2px; cursor:s-resize;}
            .br{bottom:0; right:0; cursor:se-resize;}
            .lc{top:50%; margin-top:-2px; left:0; cursor:w-resize;}
            .rc{top:50%; margin-top:-2px; right:0; cursor:e-resize;}
        `))
        document.getElementsByTagName('head')[0].appendChild(style)
    },

    render() {
        // let rect

        // if (!activeOptions || !corners.tl) return

        // rect = activeOptions.target.getBoundingClientRect()
        
        // selector.setPosition(corners.tl, {left:rect.left, top:rect.top})
        // selector.setPosition(corners.tc, {left:rect.left + (rect.width / 2) - 2, top:rect.top})
        // selector.setPosition(corners.tr, {left:rect.left + rect.width - 4, top:rect.top})
        // selector.setPosition(corners.bl, {left:rect.left, top:rect.top + rect.height - 4})
        // selector.setPosition(corners.bc, {left:rect.left + (rect.width / 2) - 2, top:rect.top + rect.height - 4})
        // selector.setPosition(corners.br, {left:rect.left + rect.width - 4, top:rect.top + rect.height - 4})
        // selector.setPosition(corners.lc, {left:rect.left,   top:rect.top + (rect.height / 2) - 2})
        // selector.setPosition(corners.rc, {left:rect.left + rect.width - 4, top:rect.top + (rect.height / 2) - 2})
    },

    createElement(cls, cursor){
        let div = document.createElement('div')

        div.setAttribute('class', cls)
        div.setAttribute('cursor', cursor)
        div.addEventListener('mousedown', selector.onCornerMouseDown)

        return div
    },

    setPosition(el, style){
        let k

        for (k in style){
            el.style[k] = `${style[k]}px`
        }
    },

    onCornerMouseDown(event){
        let target = event.target
        let cls = target.getAttribute('class')
        let offsetLeft = activeOptions.target.offsetLeft
        let offsetTop = activeOptions.target.offsetTop
        let offsetWidth = activeOptions.target.offsetWidth
        let offsetHeight =  activeOptions.target.offsetHeight
        let container = activeOptions.target.parentNode
        
        event.stopPropagation()
        
        dragManager.start({
            grid: activeOptions.grid,
            dragsource: target,
            dropdisabled: true,
            cursor: target.getAttribute('cursor'),
            mouseX: event.mouseX,
            mouseY: event.mouseY,
            drag(evt){
                let mouse = evt.mouse                
                let left = offsetLeft
                let top = offsetTop
                let width = offsetWidth
                let height =  offsetHeight

                switch(cls){
                    case 'tl':
                        left = offsetLeft + mouse.movimentX
                        top = offsetTop + mouse.movimentY
                        width = offsetWidth - mouse.movimentX
                        height = offsetHeight - mouse.movimentY
                        break

                    case 'tc':
                        top = offsetTop + mouse.movimentY
                        height = offsetHeight - mouse.movimentY
                        break

                    case 'tr':
                        top = offsetTop + mouse.movimentY
                        width = offsetWidth + mouse.movimentX
                        height = offsetHeight - mouse.movimentY
                        break

                    case 'bl':
                        left = offsetLeft + mouse.movimentX
                        width = offsetWidth - mouse.movimentX
                        height = offsetHeight + mouse.movimentY
                        break

                    case 'bc':
                        height = offsetHeight + mouse.movimentY
                        break

                    case 'br':
                        width = offsetWidth + mouse.movimentX
                        height = offsetHeight + mouse.movimentY
                        break

                    case 'rc':
                        width = offsetWidth + mouse.movimentX
                        break

                    case 'lc':
                        left = offsetLeft + mouse.movimentX
                        width = offsetWidth - mouse.movimentX
                        break
                }

                if (left < 0) left = 0
                if (top < 0) top = 0
                if (width < 8) width = 8
                if (height < 8) height = 8
                if (left + width > container.offsetWidth) width = container.offsetWidth - left
                if (top + height > container.offsetHeight) height = container.offsetHeight - top

                activeOptions.target.style.left = left + 'px'
                activeOptions.target.style.top = top + 'px'
                activeOptions.target.style.width = width + 'px'
                activeOptions.target.style.height = height + 'px'
                
                // selector.render()

                if (activeOptions.changed){
                    activeOptions.changed()
                }

                return false
            }
        })
    }
}

document.addEventListener("DOMContentLoaded", selector.onContentLoaded)

export default {
    show: selector.show,
    hide: selector.hide,
    render: selector.render
}
