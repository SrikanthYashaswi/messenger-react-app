import { Icon } from 'antd';
import React from 'react';
export class TypingUsers extends React.Component
{
    render()
    {
        let {appStore} = this.props;
        let users = Object.keys(appStore.typingUsers);
        return(
            <div className="typingUsers">
                {users.length > 0 && <Icon type="edit" style={{marginRight:'5px'}}/>}
                <span >{users.length > 0 && users.join(',')}</span>
            </div>
        )
    }
}