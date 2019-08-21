import { Col, Layout, Row } from 'antd';
import React from 'react';
import { ConnectionBulb } from './ConnectionBulb.jsx';
import { InputBox } from './InputBox.jsx';
import { MessageContainer } from './MessageContainer.jsx';
import { NerdStat } from './NerdStat.jsx';


export class AppContainer extends React.Component
{
    render()
    {
        const { Content } = Layout;
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
                        asdasdasd
                    </Col>

                </Row>
            </div>
        )
    }
}