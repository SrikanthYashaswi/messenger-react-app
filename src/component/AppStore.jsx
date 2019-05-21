import React from 'react';
import { AppContainer } from './AppContainer.jsx';
import moment from 'moment';

const STATE = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting'
}

export class AppStore extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            connection: STATE.CONNECTING,
            onlineUsers: '',
            userName: '',
            typingUsers: {},
            scrollHeight:0,
        }
        this.serverSocket = null;
        this.initializeWebSocket();
        this.startAsyncServices();
        this.recovering = false;
    }

    initializeWebSocket() {
        if(this.serverSocket !== null && this.serverSocket.readyState === WebSocket.CONNECTING)
        {
            return;
        }
        if(this.state.connection === STATE.DISCONNECTED)
        {
            this.recovering = true;
        }
        this.serverSocket = new WebSocket(this.formWsUrl());
        this.serverSocket.onopen = this.onWebsocketOpen.bind(this);
        this.serverSocket.onclose = this.onWebsocketClose.bind(this);
        this.serverSocket.onmessage = this.onWebsocketMessage.bind(this);
        this.serverSocket.onerror = this.handleError.bind(this);
    }

    onWebsocketOpen() {
        this.setState({ connection: STATE.CONNECTED });
    }

    onWebsocketMessage(evt) {
        if(this.recovering)
        {
            this.sendMessage(this.state.userName);
            this.recovering = false;
        }
        else
        {
            this.resolveMessage(evt.data);
        }
    }

    handleError() {
        this.onWebsocketClose();
    }

    onWebsocketClose() {
        this.setState({ connection: STATE.DISCONNECTED });
    }

    resolveMessage(message) {
        if (message.indexOf("@online") === 0) {
            this.updateOnlineUsers(message);
            return;
        }
        else if (message.indexOf('@typing') === 0) {
            this.updateTypingUsers(message);
            return;
        }
        else {
            this.updateNewMessage(message);
        }
    }

    updateOnlineUsers(message) {
        var onlineUsers = message.split("@online : ")[1];
        this.setState({ onlineUsers: onlineUsers });
    }

    updateTypingUsers(message) {
        let { typingUsers, userName } = this.state;
        var user = message.split('@typing:')[1];
        if (user !== userName) {
            typingUsers[user] = this.getTime();
        }
        this.setState({ typingUsers: typingUsers });
    }

    parseIncommingMessage(message)
    {
        return {
            sender: message.split(":")[0],
            raw: message,
            time: moment().format('LLL')
        }
    }
    parseOutgoingMessage(message)
    {
        return{
            sender: '@self',
            raw: message,
            time: moment().format('LLL')
        }
    }

    updateNewMessage(message) {
        let { messages, typingUsers } = this.state;
        messages.push(this.parseIncommingMessage(message));

        const user = message.split(':')[0].trim();
        delete typingUsers[user];
        this.setState({ messages: messages, typingUsers: typingUsers , scrollHeight: messages.length * 130});        
    }

    sendMessage(message) {
        if( message.trim() === '')
        {
            return;
        }
        if (this.state.userName === '') {
            this.serverSocket.send(message);
            this.setState({ userName: message });
        }
        else {
            let { messages } = this.state;
            messages.push(this.parseOutgoingMessage(message));
            this.serverSocket.send(message);
            this.setState({ messages: messages , scrollHeight: messages.length * 130});
        }
    }

    updateTyping() {
        let { userName } = this.state;
        if (userName !== "") {
            this.serverSocket.send('@typing:' + userName);
        }
    }

    formWsUrl() {
        var group = this.getGroupName();
        return (window.location.hostname === 'localhost') ? "ws://localhost:8080" + group : "wss://events.newgen.co/im" + group;
    }

    getGroupName() {
        var q = {};
        var url = window.location.href;
        var pattern = /\?(.*)/
        var patternResult = pattern.exec(url);
        if (patternResult != null) {
            var queriesList = patternResult[1].split('&');
            for (var i = 0; i < queriesList.length; i++) {
                var param = queriesList[i].split('=');
                q[param[0]] = param[1];
            }
        }
        return q['g'] === undefined ? '' : '?g=' + q['g'];
    }

    getTime() {
        return Math.round((new Date()).getTime());
    }

    getApiHooks() {
        return {
            sendMessage: this.sendMessage.bind(this),
            updateTyping: this.updateTyping.bind(this)
        }
    }

    startAsyncServices() {
        this.typingUserService = setInterval(this.refreshTypingUsers.bind(this), 300);
        this.connectionMonitorService = setInterval(this.monitorConnection.bind(this), 5000);
    }

    refreshTypingUsers() {
        let { typingUsers } = this.state;
        let changed = false;
        for (let user in typingUsers) {
            if (this.getTime() - typingUsers[user] > 500) {
                delete typingUsers[user];
                changed = true;
            }
        }
        if(changed)
        {
            this.setState({ typingUsers: typingUsers });
        }
    }

    monitorConnection() {
        let {connection} = this.state;
        
        if(connection === STATE.DISCONNECTED)
        {
            this.initializeWebSocket();
        }

        if(connection === STATE.CONNECTED)
        {
            this.serverSocket.send('@pong');
        }
    }

    render() {
        return (
            <div>
                <AppContainer appStore={this.state} api={this.getApiHooks()} />
            </div>
        )
    }
}