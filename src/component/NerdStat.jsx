import React from 'react';

const index ={
    ONLINE_USERS: 0,
    LOOP_TIME:1,
    USED_MEM:2
}

export class NerdStat extends React.Component{

    constructor(){
        super();
        this.state={
            width:'90px',
            height:'30px',
            display:'NerdLogs'
        }
        this.toggle = false;
    }
    
    renderNerdLog(){
        let {nerdLog} = this.props.appStore;
        if(nerdLog !== null &&  nerdLog.length > 0){
            return (
                <div>
                    users: {nerdLog[index.ONLINE_USERS]}
                    <br/>
                    loop Time: {parseInt(nerdLog[index.LOOP_TIME])/1000000}
                    <br/>
                    Mem Usage: {parseInt(nerdLog[index.USED_MEM]) } KB
                </div>
            )
        }
    }

    Atoggle(){
        console.log('asd');
        if(!this.toggle){
            this.setState({width:'120px', height:'300px',display:'close'})    
        }
        else{
            this.setState({width:'90px', height:'30px',display:'NerdLogs'})    
        }
        this.toggle = !this.toggle;
    }
    render(){
        let {latency} = this.props.appStore;
        let {width,height,display} = this.state;
        return(
            <div style={{width: width, height: height,overflow:'hidden',position:'fixed',top:'5px',right:'10px',zIndex:9999,background:'white'}}>
                <button onClick={this.Atoggle.bind(this)}>{display}</button>
                <br/>
                latency: {latency == null ? 'pinging...' : latency+"ms" }
                <br/>
                {this.renderNerdLog()}
            </div>
        )
    }
}