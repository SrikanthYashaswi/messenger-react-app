import React from 'react';

export class OnlineUsers extends React.Component
{
    render()
    {
        let {onlineUsers} = this.props.appStore;

        return(
            <div>
                <h4>Online</h4>
                <ul>
                    {
                        onlineUsers.split(",").map( (item, key) => {
                            return <li key={key} > {item} </li>            
                        })
                    }
                </ul>
            </div>
        )
    }
}