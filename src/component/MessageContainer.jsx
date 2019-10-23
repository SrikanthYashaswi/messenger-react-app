import {  List, Skeleton, Typography } from 'antd';
import React from 'react';

const { Paragraph } = Typography;

export class MessageContainer extends React.Component
{
    constructor()
    {
        super();
        this.mounted  = false;
        this.scrollToBottom();
    }
    componentDidMount()
    {
        this.mounted = true;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        if(this.el !== undefined){
            this.el.current.scrollIntoView({ behavior: 'smooth' });
            console.log("heooo");
        }
    }
    parseSkeleton()
    {
        let {appStore} = this.props;
        return appStore.messages.length === 0 ? <Skeleton size="small" active/> : this.renderMessageList();
    }

    componentDidUpdate(prevProp, prevState)
    {
        if(prevProp.appStore.scrollHeight !==  this.props.appStore.scrollHeight)
            window.scrollTo(0,this.props.appStore.scrollHeight);
    }

    renderMessageList()
    {
        let {appStore} = this.props;

        return  <List
            size="small"
            split={false}
            dataSource={appStore.messages}
            className="messageContainer"
            renderItem={item => (
                <List.Item style={ item.sender.trim() === '@self' ? { justifyContent:'flex-end'} : {}}>
                    {
                        item.sender.trim() === '@self' 
                        ?
                        <pre style={{wordBreak: 'break-word',whiteSpace: 'pre-wrap' }}>{item.raw}</pre>
                        :
                        <pre style={{wordBreak: 'break-word',whiteSpace: 'pre-wrap' }}>{item.raw}</pre>
                    }
                    
                </List.Item>
            ) }
    />
    }

    render()
    {
        return this.parseSkeleton();
    }
}