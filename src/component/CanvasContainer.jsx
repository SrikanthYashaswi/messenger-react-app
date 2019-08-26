import React from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js'

export class CanvasContainer extends React.Component
{

    constructor(){
        super();
        this.buffer = [];
        this.penDown = false;
    }

    componentDidMount() 
    {
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgb(200,255,255)';
        ctx.fillRect(0, 0, 640, 425);
        PubSub.subscribe('canvas', this.updateDrawing.bind(this));
    }

    updateDrawing(evt,message){
        const blocks = message.split(":");
        const curves = blocks[1];
        const points = curves.split(";");
        points.map( item => {
            const m = item.split(',');
            const action = m[0];
            const x = m[1];
            const y = m[2];

            switch(action){
                case "move":{
                    this.move(x,y);
                    break;
                }
                case "line":{
                    this.draw(x,y);
                    break;
                }
                default:{

                }
            }
        })
    }

    handleMouseDown(event){
        this.penDown = true;
        let x = event.offsetX;
        let y = event.offsetY;
        this.move(x,y);
        this.makeCanvasMessage("move",x,y);
        this.draw(x+1,y+1);
        this.makeCanvasMessage("line",x+1,y+1);
    }
    handleMouseMove(event){
        if(this.penDown){
            let x = event.offsetX;
            let y = event.offsetY;
            this.draw(x,y)
            this.makeCanvasMessage("line",x,y);
        }
    }

    handleMouseUp(event){
        this.penDown = false;
        this.pushBuffer();
    }

    move(x,y){
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        let ctx = canvas.getContext("2d");
        ctx.moveTo(x,y);
    }

    draw(x,y){
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        let ctx = canvas.getContext("2d");
        ctx.lineTo(x,y);
        ctx.stroke();
    }

    makeCanvasMessage(action, x,y){
        this.buffer.push(action+","+x+","+y);
    }

    pushBuffer(){
        const {api} = this.props;
        const msg = "@canvas:"+this.buffer.join(";");
        api.sendCanvasMessage(msg);
        this.buffer = [];
    }

    render(){
        return(
            <div>    
                <canvas id="canvas" ref="canvas"
                        width={640}
                        height={425}
                        onMouseDown={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseDown(nativeEvent);
                            }}
                        onMouseMove={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseMove(nativeEvent);
                            }}
                        onMouseUp={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseUp(nativeEvent);
                            }
                        }
                />
            </div>    
        );
    }
}