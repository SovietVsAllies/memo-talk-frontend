import './MicroBlogs.css';
import React, {Component, Fragment} from 'react';
import Loading from "../Loading/Loading";
import {FormGroup, Button, FormControl, ControlLabel, OverlayTrigger, Popover} from 'react-bootstrap'
import Application from "../Application/Application";
import CenterBlock from "../CenterBlock/CenterBlock";
import Picker from "emoji-mart/dist-es/components/picker/picker";
import 'emoji-mart/css/emoji-mart.css';
import $ from 'jquery';

/***
 * blogs: A list of blog
 * blog: name, id, blogID, time, content
 */
class MicroBlogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            posts: [],
            value: '',
        };
        this.updatePosts = this.updatePosts.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setLoaded = this.setLoaded.bind(this);
    }
    
    setLoaded(v) {
        this.setState({loaded: v});
    }

    updatePosts() {
        let searchText = this.state.value;
        
        let accountContract = Application.getInstance().accountContract;
        let registry = Application.getInstance().registry;
        let accountAddress = localStorage.getItem('account');
        let account = accountContract.at(accountAddress);

        let following = [account];
        let followingNames = JSON.parse(localStorage.getItem('following'));
        for (let i in followingNames) {
            following.push(accountContract.at(registry.getAccountAddress(followingNames[i])));
        }
        let posts = [];
        for (let i in following) {
            let acc = following[i];
            let count = acc.getPostCount().toNumber();
            for (let j = 0; j < count; j++) {
                let post = acc.getPost(j);
                post = {
                    account: acc,
                    accountName: registry.getAccountName(acc.address),
                    id: j,
                    timestamp: new Date(post[0].toNumber() * 1000),
                    content: post[1]
                };

                if (post.content.includes(searchText)) {
                    posts.push(post);
                }
            }
        }
        posts.sort(function (lhs, rhs) {
            return rhs.timestamp - lhs.timestamp;
        });
        for (let i = 0; i < posts.length; i++) {
            posts[i].timestamp = posts[i].timestamp.toLocaleString();
        }
        this.setState({
            loaded: true,
            posts: posts,
        });
    }

    componentDidMount() {
        this.updatePosts();
    }

    render() {
        let blogsContent;
        if (!this.state.loaded) {
            blogsContent = <Loading/>
        } else {
            blogsContent =
                <Fragment>
                    <header className='text-center' id='blogs-header'>
                        Microblogs Square
                    </header>
                    {this.state.posts.map((blog) => {
                        return <SingleBlog
                            key={blog.id + blog.account.address}
                            name={blog.accountName}
                            id={blog.id}
                            time={blog.timestamp}
                            content={JSON.parse(blog.content)}
                        />;
                    })}
                </Fragment>
            ;
        }
        return (
            <CenterBlock>
                <div id='search-bar'>
                <form>
                    <FormControl type="text" placeholder="Search" value={this.state.value} onChange={this.handleChange}/>
                    <button type="submit" className="btn" style={{background: 'none',
                            border: 'none',
                            padding: 0, 
                            outline: 'none'}}
                            onClick={this.onSearchClick}>
                        <i className="fas fa-search"/>
                    </button>
                </form>
                </div>
                <SendBlogBlock updatePosts={this.updatePosts} setLoaded={this.setLoaded}/>
                <hr/>
                {blogsContent}
            </CenterBlock>
        );
    }
    
    onSearchClick(e) {
        e.preventDefault();
        this.updatePosts();
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
}

class SingleBlog extends Component {
    render() {
        return (
            <div className='blog-block'>
                <div>
                    <div className="sender-info"><span className="sender-name">{this.props.name}</span><span
                        className="sender-id sender-at">@</span><span className="sender-id">{this.props.id}</span></div>
                    <div className="sent-time">{this.props.time}</div>
                    <div className="blog-content">
                        {this.props.content.text}
                        <br/>
                        {this.image()}
                    </div>
                </div>
            </div>
        );
    }

    image() {
        if (typeof this.props.content.image !== 'undefined') {
            return <img src={this.props.content.image} style={{maxWidth: 400}}/>;
        } else {
            return null;
        }
    }
}

class SendBlogBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addEmoji = this.addEmoji.bind(this);
        this.onImageInputChange = this.onImageInputChange.bind(this);
        this.emojiPopover = (
            <Popover title="Select emoji" style={{maxWidth: 100000}}>
                <Picker showPreview={false} recent={false} native={true} onSelect={this.addEmoji} perLine={8}/>
            </Popover>
        );
        this.addHash = this.addHash.bind(this);
        this.uploadPhotoPopover = (
            <Popover title="Upload file" style={{maxWidth: 100000}}>
                <input type="file" accept="image/png, image/jpeg" onChange={this.onImageInputChange}/>
            </Popover>
        );
        this.onEmojiClick = this.onEmojiClick.bind(this);
        this.onUploadClick = this.onUploadClick.bind(this);
    }

    onImageInputChange(e) {
        let file = e.target.files[0];
        if (typeof file === 'undefined') {
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            this.setState({postImage: e.target.result});
        }.bind(this);
        reader.readAsDataURL(file);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.props.setLoaded(false);
        
        this.refs.emojiOverlay.hide();
        this.refs.uploadOverlay.hide();
        
        let account = Application.getInstance().account;

        let content;
        if (typeof this.state.postImage !== 'undefined') {
            let uploadResult = await $.ajax({
                url: 'https://api.cloudinary.com/v1_1/dsbbmtvkx/image/upload',
                method: 'post',
                data: {
                    file: this.state.postImage,
                    upload_preset: 'ysny53ko',
                },
                dataType: 'json',
            });
            uploadResult = uploadResult.secure_url;
            this.setState({postImage: undefined});
            content = JSON.stringify({
                text: this.state.value,
                image: uploadResult,
            });
        } else {
            content = JSON.stringify({text: this.state.value});
        }

        let count = account.getPostCount().toNumber();
        account.post(content, {gas: 4700000});
        this.timerId = setInterval(function () {
            if (account.getPostCount().toNumber() > count) {
                clearInterval(this.timerId);
                this.props.updatePosts();
                this.setState({value: ''});
            }
        }.bind(this), 100);
    }

    addEmoji(emoji) {
        this.setState({value: this.state.value + emoji.native});
    }

    addHash(emoji) {
        this.setState({value: this.state.value + '#'});
    }
    
    onEmojiClick() {
        this.refs.uploadOverlay.hide();
    }
    
    onUploadClick() {
        this.refs.emojiOverlay.hide();
    }

    render() {
        let button;
        if (this.state.value !== '') {
            button = <Button bsStyle='primary' type="submit">Submit</Button>;
        } else {
            button = <Button bsStyle='primary' type="submit" disabled>Submit</Button>;
        }
        return (
            <Fragment>
                <form id='send-blog-block' onSubmit={this.handleSubmit}>
                    <FormGroup controlId="formControlsTextarea" classNam='blog-block'>
                        <ControlLabel>Post a new micro-blog!</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Write something..." value={this.state.value}
                                     onChange={this.handleChange}/>
                    </FormGroup>
                    {button}
                    <div id='send-block-tools'>
                        <OverlayTrigger trigger="click" placement="bottom" overlay={this.emojiPopover} ref="emojiOverlay" onClick={this.onEmojiClick}>
                            <span id="emoji-tool">
                                <i className="far fa-smile"/>
                                <span id="emoji-button"> Emoji</span>
                            </span>
                        </OverlayTrigger>
                        <OverlayTrigger trigger="click" placement="bottom" overlay={this.uploadPhotoPopover} ref="uploadOverlay" onClick={this.onUploadClick}>
                            <span id="photo-tool">
                                <i className="fas fa-camera-retro"/>
                                <span id="photo-button"> Photo</span>
                            </span>
                        </OverlayTrigger>
                        <span onClick={this.addHash}>
                            <i className="fas fa-hashtag"/>
                            <span> Topic</span>
                        </span>
                    </div>
                    <div style={{clear: 'both'}}/>
                </form>
            </Fragment>
        );
    }
}

export default MicroBlogs;
