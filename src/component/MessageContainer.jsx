import {  List, Skeleton, Tag } from 'antd';
import React from 'react';

export class MessageContainer extends React.Component
{
    constructor()
    {
        super();
        this.mounted  = false;
    }
    componentDidMount()
    {
        this.mounted = true;
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
                        <Tag  color="geekblue"><div style={{wordBreak: 'break-word' }}>{item.raw}</div></Tag>
                        :
                        <Tag color="blue">{item.raw}</Tag>
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