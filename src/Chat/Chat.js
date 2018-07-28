import React, {Component} from 'react';
import './Chat.css';
import CenterBlock from "../CenterBlock/CenterBlock";
import {FormGroup, Button, HelpBlock, FormControl, ControlLabel} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {Launcher} from "react-chat-window";
import Application from "../Application/Application";
import $ from 'jquery';

class Chat extends Component {
    constructor(props) {
        super(props);
        let followings = JSON.parse(localStorage.getItem('following'));
        if (localStorage.getItem('following') === null) {
            followings = [];
        }
        this.state = {
            followings: followings,
            other: '',
        };
        this.updateFollowing = this.updateFollowing.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    updateFollowing() {
        this.setState({
            followings: JSON.parse(localStorage.getItem('following')),
        });
        if (localStorage.getItem('following') === null) {
            this.setState({
                followings: [],
            });
        }
    }

    handleClick(e, name) {
        e.preventDefault();
        this.setState({
            other: name,
        });
    }

    render() {
        function unfollow(name) {
            return function(e) {
                e.preventDefault();
                let followingNames = JSON.parse(localStorage.getItem('following'));
                followingNames.splice(followingNames.indexOf(name), 1);
                localStorage.setItem('following', JSON.stringify(followingNames));
                this.updateFollowing();
            }.bind(this);
        }
        unfollow = unfollow.bind(this);
        return (
            <CenterBlock>
                <header id='manage-header' className='text-center'>Chat with anybody you like</header>
                <p className="lead text-muted text-center">Follow peers by entering his name:</p>
                <FollowNewPeerForm updateFollowing={this.updateFollowing}/>
                <ListGroup>
                    {this.state.followings.map((name) =>
                        <ListGroupItem onClick={(e) => this.handleClick(e, name)}>{name}
                            <Button bsStyle="primary" className='unfollow-button'>Chat</Button>
                            <Button bsStyle="success" className='unfollow-button'>Chat with blockchain</Button>
                            <Button bsStyle="danger" className='unfollow-button' onClick={unfollow(name)}>Unfollow</Button>
                        </ListGroupItem>
                    )}
                </ListGroup>
                <Messenger other={this.state.other}/>
            </CenterBlock>
        );
    }
}

class FollowNewPeerForm extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {value: ''};
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 0 && length < 20) return 'success';
        else if (length >= 20 && length < 30) return 'warning';
        else if (length === 0 || length >= 30) return 'error';
        return null;
    };

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let name = this.state.value;
        let followingNames = localStorage.getItem('following');
        if (followingNames === null) {
            followingNames = [];
        } else {
            followingNames = JSON.parse(followingNames);
        }
        followingNames.push(name);
        localStorage.setItem('following', JSON.stringify(followingNames));
        this.props.updateFollowing();
    }

    getHelpText() {
        let element;
        if (this.state.value.length >= 30) {
            element = <HelpBlock>The length of name cannot be larger than 29.</HelpBlock>
        } else {
            element = null;
        }
        return element;
    };

    render() {
        return (
            <form id='manage-form' onSubmit={this.handleSubmit}>
                <FormGroup validationState={this.getValidationState()}>
                    <ControlLabel>Name:</ControlLabel>
                    <FormControl type='text' value={this.state.value}
                                 placeholder='Enter name...' onChange={this.handleChange}/>
                    {this.getHelpText()}
                    <FormControl.Feedback/>
                </FormGroup>
                <div className='text-center'>
                    <Button type='submit' bsStyle='primary'>Submit</Button>
                </div>
            </form>
        );
    }
}

export class Messenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
        };
        this.onMessageWasSent = this.onMessageWasSent.bind(this);
    }

    async onMessageWasSent(message) {
        let web3 = Application.getInstance().web3;
        let account = Application.getInstance().account;
        let accountContract = Application.getInstance().accountContract;
        let registry = Application.getInstance().registry;
        let recipient = this.props.other;
        let content;
        switch (message.type) {
            case 'text':
                content = message.data.text;
                break;
            case 'emoji':
                content = message.data.emoji;
                break;
            case 'image':
                content = (await $.ajax({
                    url: 'https://api.cloudinary.com/v1_1/dsbbmtvkx/image/upload',
                    method: 'post',
                    data: {
                        file: message.data.image,
                        upload_preset: 'ysny53ko',
                    },
                    dataType: 'json',
                })).secure_url;
                break;
        }
        let acc = accountContract.at(registry.getAccountAddress(recipient));
        let signalMessage = await $.ajax({
            url: 'http://localhost:' + Application.getInstance().SIGNAL_PORT + '/encrypt/',
            method: 'post',
            data: JSON.stringify({
                recipient: recipient,
                registrationId: acc.getRegistrationId(),
                identityKey: acc.getIdentityKey(),
                signedPreKey: acc.getSignedPreKey(),
                plaintext: JSON.stringify({
                    content: content,
                    type: message.type,
                }),
            }),
            contentType: 'text/plain; charset=UTF-8',
            dataType: 'json',
        });
        acc.sendMessage(account.address, JSON.stringify(signalMessage), {from: web3.eth.defaultAccount, gas: 4700000});
        this.setState({
            messageList: [...this.state.messageList, message],
        });

        Messenger.saveMessage({
            sender: account.address,
            recipient: registry.getAccountAddress(recipient),
            content: content,
            type: message.type,
        });
    }

    sendMessage(plaintextMessage) {
        let data;
        switch (plaintextMessage.type) {
            case 'text':
                data = {text: plaintextMessage.content};
                break;
            case 'emoji':
                data = {emoji: plaintextMessage.content};
                break;
            case 'image':
                data = {image: plaintextMessage.content};
                break;
        }
        this.setState({
            messageList: [...this.state.messageList, {
                author: 'them',
                type: plaintextMessage.type,
                data: data,
            }]
        })
    }

    static getReceivedMessageCount() {
        let messages = Messenger.loadMessages();
        let count = 0;
        let account = Application.getInstance().account;
        for (let i in messages) {
            let message = messages[i];
            if (message.recipient === account.address) {
                count++;
            }
        }
        return count;
    }

    static saveMessage(message) {
        let messages = Messenger.loadMessages();
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    static loadMessages() {
        let messages = JSON.parse(localStorage.getItem('messages'));
        if (!messages) {
            messages = [];
        }
        return messages;
    }

    componentWillMount() {
        let account = Application.getInstance().account;
        let messages = Messenger.loadMessages();
        let messageList = [];
        for (let i in messages) {
            let message = messages[i];
            let data;
            switch (message.type) {
                case 'text':
                    data = {text: message.content};
                    break;
                case 'emoji':
                    data = {emoji: message.content};
                    break;
                case 'image':
                    data = {image: message.content};
                    break;
            }
            messageList.push({
                author: message.sender === account.address ? 'me' : 'them',
                type: message.type,
                data: data,
            });
        }
        this.setState({
            messageList: this.state.messageList.concat(messageList),
        });
    }

    componentDidMount() {
        this.messageRetrievalTimer = setInterval(async () => {
            let savedMessageCount = Messenger.getReceivedMessageCount();

            const SIGNAL_PORT = Application.getInstance().SIGNAL_PORT;
            let account = Application.getInstance().account;
            let messageCount = account.getMessageCount().toNumber();

            if (messageCount <= savedMessageCount) {
                return;
            }

            for (let i = savedMessageCount; i < messageCount; i++) {
                let message = account.getMessage(i);
                let messageObj = JSON.parse(message[2]);
                try {
                    let plaintext = await $.ajax({
                        url: 'http://localhost:' + SIGNAL_PORT + '/decrypt/',
                        method: 'post',
                        data: JSON.stringify({
                            sender: message[0],
                            type: messageObj.type,
                            ciphertext: messageObj.ciphertext,
                        }),
                        contentType: 'text/plain; charset=UTF-8',
                        dataType: 'json',
                    });
                    let plaintextMessage = JSON.parse(plaintext.plaintext);
                    if (plaintextMessage.type === 'text') {
                        try {
                            const FILTER_PORT = Application.getInstance().FILTER_PORT;
                            let result = await $.ajax({
                                url: 'http://localhost:' + FILTER_PORT + '/',
                                method: 'post',
                                data: plaintextMessage.content,
                            });
                            if (result === '-1') {
                                plaintextMessage.content = String.fromCodePoint(0x26a0) + plaintextMessage.content;
                            }
                        } catch (e) {}
                    }
                    this.sendMessage(plaintextMessage);
                    Messenger.saveMessage({
                        sender: message[0],
                        recipient: account.address,
                        content: plaintextMessage.content,
                        type: plaintextMessage.type,
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.messageRetrievalTimer);
    }

    render() {
        return (
        <div style={{opacity: this.props.other ? 1 : 0}} id="laucher-button">
            <Launcher
                agentProfile={{
                    teamName: this.props.other,
                    imageUrl: '',
                }}
                onMessageWasSent={this.onMessageWasSent}
                messageList={this.state.messageList}
                showEmoji
            />
        </div>
        );
    }
}

export default Chat;
