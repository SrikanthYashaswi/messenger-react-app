import { Col, Row } from 'antd';
import React from 'react';
import { ConnectionBulb } from './ConnectionBulb.jsx';
import { InputBox } from './InputBox.jsx';
import { MessageContainer } from './MessageContainer.jsx';
import { NerdStat } from './NerdStat.jsx';
import {CanvasContainer} from './CanvasContainer.jsx'

export class AppContainer extends React.Component
{
    render()
    {
        let {appStore, api} = this.props;
        return(
            <div className="padding10">
                <Row>
                    <Col span={12}>
                        <div style={{height: '86vh',overflow: 'scroll'}}>
                            <NerdStat  appStore={appStore}/>
                            <ConnectionBulb appStore={appStore}/>
                            <MessageContainer appStore={appStore}/>
                            <InputBox api={api} appStore={appStore} />
                        </div>
                    </Col>

                    <Col span={12}>
                        <CanvasContainer api={api}/>
                    </Col>

                </Row>
            </div>
        )
    }
}