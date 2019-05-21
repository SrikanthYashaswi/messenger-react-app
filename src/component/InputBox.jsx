import { Input } from 'antd';
import React from 'react';
import { TypingUsers } from './TypingUsers';

export class InputBox extends React.Component
{
    constructor()
    {
        super();
        this.state={
            inputValue:'',
        }
    }
    keyDetect(evt)
    {
        let {api} = this.props;
        this.setState({inputValue: evt.target.value});
        api.updateTyping();
    }
    submitMessage()
    {
        let {api} = this.props;
        api.sendMessage(this.state.inputValue);
        this.setState({inputValue: ''});
    }
    render()
    {
        return(
            <div className="inputBox">
                <TypingUsers appStore={this.props.appStore} />
                <Input placeholder="Type here..." 
                style={{color:'black'}}
                value={this.state.inputValue} 
                onChange={this.keyDetect.bind(this)} 
                onPressEnter={this.submitMessage.bind(this)}/>
            </div>
        )
    }
}