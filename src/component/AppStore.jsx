import moment from 'moment';
import React from 'react';
import { AppContainer } from './AppContainer.jsx';
import PubSub from 'pubsub-js'

const STATE = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting'
}

export class AppStore extends React.Component {
    
    constructor() {
        super();
        this.username = '';
        this.audio = new Audio("https://notificationsounds.com/soundfiles/8eefcfdf5990e441f0fb6f3fad709e21/file-sounds-1100-open-ended.ogg");
        this.queryParams = {};
        window.onfocus = this.onFocus.bind(this)
        this.state = {
            messages: [],
            connection: STATE.CONNECTING,
            onlineUsers: '',
            typingUsers: {},
            scrollHeight:0,
            messageCountWhenAway : 0,
            latency:null,
            nerdLog:null,
        }
        this.average = 1;
        this.serverSocket = null;
        this.initializeWebSocket();
        this.startAsyncServices();
        this.recovering = false;
    }

    onFocus()
    {
        document.title = 'FrizBee';
        this.setState({messageCountWhenAway: 0});
    }

    updateMessageCountOnBlur()
    {
        if(!document.hasFocus())
        {
            let {messageCountWhenAway} = this.state;
            this.setState({messageCountWhenAway: messageCountWhenAway+1});
        }
    }

    initializeWebSocket() 
    {
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
        this.resolveMessage(evt.data);
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
        else if (message.indexOf('@pong') === 0){
            this.updateLatency(message);
            return;
        }
        else if(message.indexOf('@logs') === 0){
            this.updateNerdLog(message);
        }
        else if(message.indexOf('@canvas') === 0){
            this.publishToCanvas(message);
        }
        else {
            this.updateNewMessage(message);
        }
    }

    updateNerdLog(message){
        var log = message.split(":")[1];
        var js = JSON.parse(log);
        this.setState({nerdLog: js});
    }

    updateLatency(message){
        var time = parseInt(message.split(":")[1]);
        var latency = moment().valueOf() - time;
        this.setState({latency: latency });
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

        this.updateMessageCountOnBlur();
        this.setState({ messages: messages, typingUsers: typingUsers , scrollHeight: messages.length * 130});        
    }

    sendMessage(message) {
        if( message.trim() === '')
        {
            return;
        }
        
        let { messages } = this.state;

        messages.push(this.parseOutgoingMessage(message));
        this.serverSocket.send(message+"\r\n");
        this.setState({ messages: messages , scrollHeight: messages.length * 130});
    }

    publishToCanvas(message){
        PubSub.publish('canvas', message);
    }

    sendCanvasMessage(message){
        this.serverSocket.send(message);
    }

    updateTyping() {
        if(this.state.connection === STATE.CONNECTED)
        this.serverSocket.send('@typing\r\n');
    }

    formWsUrl() {
        return (window.location.hostname === 'localhost') ? "ws://localhost:8080" : "wss://events.newgen.co/im/" ;
    }

    getTime() {
        return Math.round((new Date()).getTime());
    }

    getApiHooks() {
        return {
            sendMessage: this.sendMessage.bind(this),
            updateTyping: this.updateTyping.bind(this),
            sendCanvasMessage: this.sendCanvasMessage.bind(this)
        }
    }

    startAsyncServices() {
        this.typingUserService = setInterval(this.refreshTypingUsers.bind(this), 300);
        //this.connectionMonitorService = setInterval(this.monitorConnection.bind(this), 2000);
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
        let time = moment().valueOf();
        if(connection === STATE.DISCONNECTED)
        {
            this.initializeWebSocket();
        }

        if(connection === STATE.CONNECTED)
        {
            this.serverSocket.send('@ping:' + time+'\r\n');
        }
    }

    renderTitle()
    {
        let {messageCountWhenAway,messages} = this.state;
        var msg = messageCountWhenAway > 0 ? messages[messages.length - 1 ].sender+' says..' : 'Frizbee'; 
        document.title =  msg;
    }

    render() {
        this.renderTitle()
        return (
            <div>
                <AppContainer appStore={this.state} api={this.getApiHooks()} />
            </div>
        )
    }
}