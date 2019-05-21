import React from 'react';

export class Message extends React.Component
{

    parse(msg)
    {
        const block = msg.split(':');
        const name = block[0];
        const message = block[1];
        return {
            name: name,
            message: message
        }
    }

    render()
    {
        let {data} = this.props;
        const parsed = this.parse(data);
        return(
            <p className="message"> <strong>{parsed.name}</strong>{parsed.message}</p>
        )
    }
}