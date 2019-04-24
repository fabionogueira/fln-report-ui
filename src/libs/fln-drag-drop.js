// @ts-check

let activeOptions

const DEFAULT_GRID = null

const dragManager = {
    start(options = {}){
        let dragsource = options.dragsource
        
        dragManager.end()

        if (!dragsource){
            return
        }

        activeOptions = {
            dragstart: options.dragstart, // (dragsource) primeiro movimento do mouse
            drag: options.drag,           // (dragsource) arrastando
            dragenter: options.dragenter, // (droptarget) quando entra em uma dropzone
            dragleave: options.dragleave, // (droptarget) quando sai de uma dropzone
            dragover: options.dragover,   // ? chamado no elemento dropzone
            drop: options.drop,           // (droptarget) quando libera o mouse
            dragend: options.dragend,     // (dragsource) após a liberação do mouse
            orientation: options.orientation, // atributo drag-orientation=vertical | horizontal
            dragsource,
            droptarget: null,
            dropdisabled: options.dropdisabled,
            grid: options.grid,
            offsetLeft: dragsource.offsetLeft,
            offsetTop: dragsource.offsetTop,
            offsetWidth: dragsource.offsetWidth,
            offsetHeight: dragsource.offsetHeight,
            cursor: options.cursor,
            started: false,
            data: options.data,
            mouse: {
                movimentX: 0,
                movimentY: 0,
                x: options.mouseX == undefined ? null : options.mouseX,
                y: options.mouseY == undefined ? null : options.mouseY,
            }
        }
            
        document.querySelector('html').setAttribute('cursor', options.cursor || 'move')

        document.addEventListener('mousemove', dragManager.onMouseMove)
        document.addEventListener('mouseup', dragManager.onMouseUp)
    },

    end(){
        if (activeOptions){
            document.removeEventListener('mouseup', dragManager.onMouseUp)
            
            if (activeOptions.droptarget){
                activeOptions.droptarget.removeAttribute('dropzone-active')
            }

            dragManager.dispatch(activeOptions.dragsource, 'dragend')
            activeOptions = null
        }
    },

    dispatch(element, name){
        let event
        let fn = activeOptions[name]
        let detail = {
            mouse: activeOptions.mouse,
            data: activeOptions.data,
            droptarget: activeOptions.droptarget,
            dragsource: activeOptions.dragsource
        }

        if (fn){
            if (fn(detail) === false){
                return false
            }
        }

        event = new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            detail
        })

        return element.dispatchEvent(event)
    },

    onContentLoaded(){
        let fX, fY 
        let div = document.createElement('div')
        let style = document.createElement('style')

        style.setAttribute('type', 'text/css')
        style.appendChild(document.createTextNode(`
            html[cursor], html[cursor] * {user-select: none!important;}
            html[cursor="none"], html[cursor="none"] *, [drag-cursor="none"] {cursor:none!important; }
            html[cursor="move"], html[cursor="move"] *, [drag-cursor="move"] {cursor:move!important; }
            html[cursor="nw-resize"], html[cursor="nw-resize"] *, [drag-cursor="nw-resize"] {cursor:nw-resize!important; }
            html[cursor="ne-resize"], html[cursor="ne-resize"] *, [drag-cursor="ne-resize"] {cursor:ne-resize!important; }
            html[cursor="ns-resize"], html[cursor="ns-resize"] *, [drag-cursor="ns-resize"] {cursor:ns-resize!important; }
            html[cursor="sw-resize"], html[cursor="sw-resize"] *, [drag-cursor="sw-resize"] {cursor:sw-resize!important; }
            html[cursor="se-resize"], html[cursor="se-resize"] *, [drag-cursor="se-resize"] {cursor:se-resize!important; }
            html[cursor="ew-resize"], html[cursor="ew-resize"] *, [drag-cursor="ew-resize"] {cursor:ew-resize!important; }
            html[cursor="n-resize"],  html[cursor="n-resize"]  *, [drag-cursor="n-resize"]  {cursor:n-resize!important;  }
            html[cursor="s-resize"],  html[cursor="s-resize"]  *, [drag-cursor="s-resize"]  {cursor:s-resize!important;  }
            html[cursor="w-resize"],  html[cursor="w-resize"]  *, [drag-cursor="w-resize"]  {cursor:w-resize!important;  }
            html[cursor="e-resize"],  html[cursor="e-resize"]  *, [drag-cursor="e-resize"]  {cursor:e-resize!important;  }
        `))
        document.getElementsByTagName('head')[0].appendChild(style)

        div.setAttribute('style', 'position:fixed; top:-100px; left:-100px; width:10mm; height:10mm')
        document.body.appendChild(div)
        fX = div.offsetWidth / 10   //  Quando maior o valor, menor será o rsultado, exemplos: 1=4, 10=3.8, 100=3.78 ... 
        fY = div.offsetHeight / 10  // isso tbm é afetado pelo zoom do navegador
        document.body.removeChild(div)

        console.log(fX)
        console.log(fY)

        /*
 converter mm para px
    obtém o fator de conversão:
        fator = [divStyleWidth=10mm].offsetWidth / 10

    valorEmPixel = valorEmMM * fator
    valorEmMM = valorEmPixel / fator
 
 */
    },

    onMouseDown(event){
        let dragsource = event.target.closest('[drag]')
        
        if (dragsource){
            event.stopPropagation()

            dragManager.start({
                dragsource,
                orientation: dragsource.getAttribute('drag-orientation'),
                cursor: dragsource.getAttribute('drag-cursor'),
                mouseX: event.mouseX,
                mouseY: event.mouseY
            })
        }
    },

    onMouseMove(event){
        let i, eventCanceled, left, top, hoverElements, droptarget
        let grid = activeOptions.grid || DEFAULT_GRID
        let mouse = activeOptions.mouse

        if (mouse.y === null){
            mouse.y = event.y
        }

        if (mouse.x === null){
            mouse.x = event.x
        }

        mouse.movimentX = activeOptions.orientation == 'vertical' ? mouse.x : event.x - mouse.x
        mouse.movimentY = activeOptions.orientation == 'horizontal' ? mouse.y : event.y - mouse.y

        if (!activeOptions.started && (Math.abs(mouse.movimentX) >= 1 || Math.abs(mouse.movimentY) >= 1)){
            activeOptions.started = true
            return dragManager.dispatch(activeOptions.dragsource, 'dragstart')
        }

        if (!activeOptions.started){
            return
        }
        
        if (grid){
            mouse.movimentX = Math.round(mouse.movimentX / grid) * grid
            mouse.movimentY = Math.round(mouse.movimentY / grid) * grid
        }

        eventCanceled = !dragManager.dispatch(activeOptions.dragsource, 'drag')
        
        if (!eventCanceled){
            left = activeOptions.offsetLeft + activeOptions.mouse.movimentX
            top = activeOptions.offsetTop + activeOptions.mouse.movimentY
            
            activeOptions.dragsource.style.left = left + 'px'
            activeOptions.dragsource.style.top = top + 'px'

            if (activeOptions.dropdisabled != true){
                hoverElements = document.elementsFromPoint(event.x, event.y)
                for (i = 0; i < hoverElements.length; i++){
                    if (hoverElements[i].getAttribute('dropzone') != null){
                        droptarget = hoverElements[i]
                        break
                    }
                }

                if (droptarget != activeOptions.droptarget){
                    if (activeOptions.droptarget){
                        activeOptions.droptarget.removeAttribute('dropzone-active')
                        dragManager.dispatch(activeOptions.droptarget, 'dragleave')
                    }
                    if (droptarget){
                        droptarget.setAttribute('dropzone-active', '')
                        dragManager.dispatch(droptarget, 'dragenter')
                    }

                    activeOptions.droptarget = droptarget
                }
            }

        }
    
    },

    onMouseUp(event){
        let mouse, r1, r2
        
        if (activeOptions){
            mouse = activeOptions.mouse

            document.removeEventListener('mouseup', dragManager.onMouseUp)
            document.removeEventListener('mousemove', dragManager.onMouseMove)
            
            document.querySelector('html').removeAttribute('cursor')
            
            if (activeOptions.droptarget){
                r1 = (activeOptions.droptarget.droptarget || activeOptions.droptarget).getBoundingClientRect()
                r2 = activeOptions.dragsource.getBoundingClientRect()

                // posição do mouse dentro da dropzone
                mouse.droptargetX = event.x - r1.left
                mouse.droptargetY = event.y - r1.top

                // posição do dragsource dentro de droptarget
                mouse.dragsourceX = r2.left - r1.left
                mouse.dragsourceY = r2.top - r1.top                

                dragManager.dispatch(activeOptions.droptarget, 'drop')
            }

            dragManager.end()
        }
    }
}

document.addEventListener('mousedown', dragManager.onMouseDown)
document.addEventListener("DOMContentLoaded", dragManager.onContentLoaded)

export default {
    start: dragManager.start
}
