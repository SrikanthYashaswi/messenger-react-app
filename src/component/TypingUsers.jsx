import React from 'react';

export class TypingUsers extends React.Component
{
    render()
    {
        let {appStore} = this.props;
        let users = Object.keys(appStore.typingUsers);
        return(
            <div className="typingUsers">
                <span>{users.length > 0 && users.join(',')+" typing..."}</span>
            </div>
        )
    }
}