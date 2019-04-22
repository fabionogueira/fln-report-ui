// @ts-check

import utils from './utils'
// import FReport from './report'
// import FElement from './element'
import FText from './text'
import FImage from './image'
import FRect from './rect'
import FLine from './line'
//import {FElipse} from "./FElipse";
//import {FBreak} from "./FBreak";

let FElements = {
    "Text"  : FText,
    "Image" : FImage,
    "Line"  : FLine,
    "Rect"  : FRect
    //"Elipse": FElipse,
    //"Break" : FBreak
};

class Section{
    
    constructor(report, definition, type){
        let i, j, t,
            felement,
            TFElement, 
            children=[], 
            pageInfo = report.getPageInfo();
        
        this._y = null
        this._children = null
            
        this._definition = definition;
        this._events     = {};
        this._report     = report;
        this._type       = type;
        this._width      = pageInfo.activeClientWidth;
        this._x          = pageInfo.marginLeft;
         
        if (!definition) return;

        if (definition.children){
            for (i=0; i<definition.children.length; i++){
                t        = definition.children[i].type;
                j        = definition.children[i];
                felement = null;
                TFElement= (FElements)[t];

                if (TFElement){
                    felement = new TFElement();
                    felement.init(report, this, j);

                    // if ((felement).onComplete){

                    // }

                    children.push(felement);
                }

            }

            this._children = children;
        }

        if (definition.on){
            this._events = definition.on;
        }    
    }

    dispatchEvent(eventName, data, vars){
        utils.dispatch(this, this._events, eventName, data, vars);
    }   

    onComplete(){
        if (this._children){
            this._children.forEach((element)=>{
                element.onComplete();
            });
        }
    }

    draw(data){
        let i,y,s,vars,py,
            definition   = this._definition,
            type      = this._type,
            style     = '',
            html1     = '',
            html2     = '',
            html3     = '',
            report = this._report,
            children = this._children;
        
        if (definition){
            let pageInfo = report.getPageInfo();

            //se não cabe na página
            if (!this.fitInPage(definition.height)){
                report.addPage();
            }

            py   = pageInfo.activePageY;
            vars = report.getUserVars();

            this.dispatchEvent('start', data, vars);
            
            if (type==='footer'){
                y = 0;
                this._y = pageInfo.activeFooterY;
                s = 'top:' + (pageInfo.activeFooterY);
            }else{
                y = (definition ? definition.y || 0 : 0);
                this._y = py + y;
                s = 'top:' + (this._y);
            }
            
            style = `style="${(definition.style ? definition.style+';' : '')}`;
            html1 = `<div class="section ${type}" ${style}`;
            html2 = `px;left:${this._x}px;height:${definition.height}px;width:${this._width}px">
                    ${(report.designerMode ? '<div class="section-desiger section-desiger-' + type + '"></div>' : '')}`;
            
            for (i=0; i<children.length; i++){
                html3 += children[i].draw(data);
            }
            
            //se não cabe na página
            if (!this.fitInPage(definition.height+y)){
                report.addPage();
                s = 'top:' + (py + y);
            }
            
            report.setHTML( report.getHTML() + (html1 + s + html2 + html3 + '</div>'));
            pageInfo.activePageY = py + (definition.height+y);
            
            this.dispatchEvent('end', data, vars);
        }
    }

    fitInPage(height){
        let pageInfo = this._report.getPageInfo();
        return (pageInfo.activePageY + height > pageInfo.activeFooterY ? false : true);
    }

    getHeight(){
        return this._definition ? this._definition.height : 0;
    }

}

export default Section
