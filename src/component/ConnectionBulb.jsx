import React from 'react';

export class ConnectionBulb extends React.Component
{
    render()
    {
        let {appStore} = this.props;
        
        return(
            <div className={"connectionBar "+appStore.connection}>{appStore.connection}</div>
        )
    }
}