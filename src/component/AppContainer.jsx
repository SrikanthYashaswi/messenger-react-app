import { Col, Row } from 'antd';
import React from 'react';
import { ConnectionBulb } from './ConnectionBulb.jsx';
import { InputBox } from './InputBox.jsx';
import { MessageContainer } from './MessageContainer.jsx';
import { NerdStat } from './NerdStat.jsx';
import {CanvasContainer} from './CanvasContainer.jsx'

export class AppContainer extends React.Component
{
    messageContiner()
    {
        let {appStore, api} = this.props;
        return(
            <div style={{height: '86vh',overflow: 'scroll'}}>
                <NerdStat  appStore={appStore}/>
                <ConnectionBulb appStore={appStore}/>
                <MessageContainer appStore={appStore} />
                <InputBox api={api} appStore={appStore} />
            </div>
        )
    }

    leftContainer()
    {
        return(
            <Col span={12}>
                {this.messageContiner()}
            </Col>
        )
    }

    rightContainer()
    {
        let {appStore, api} = this.props;
        return(
            <Col span={12}>
                <CanvasContainer api={api}/>
            </Col>
        )
    }

    render()
    {
        return(
            <div className="padding10">
                <Row>
                    {this.messageContiner()}
                </Row>
            </div>
        )
    }
}