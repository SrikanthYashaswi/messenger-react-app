import { Layout } from 'antd';
import React from 'react';
import { ConnectionBulb } from './ConnectionBulb.jsx';
import { InputBox } from './InputBox.jsx';
import { MessageContainer } from './MessageContainer.jsx';

export class AppContainer extends React.Component
{
    render()
    {
        const { Content } = Layout;
        let {appStore, api} = this.props;
        return(
            <div className="padding10">
                <Content>
                    <ConnectionBulb appStore={appStore}/>
                    <MessageContainer appStore={appStore}/>
                    <InputBox api={api} appStore={appStore} />
                </Content>
            </div>
        )
    }
}