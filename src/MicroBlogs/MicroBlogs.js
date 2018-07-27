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
        };
        this.updatePosts = this.updatePosts.bind(this);
    }

    updatePosts() {
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
                    timestamp: new Date(post[0].toNumber() * 1000).toLocaleString(),
                    content: post[1]
                };

                // Filter
                // if (filter(post.content)) {
                posts.push(post);
                // }
            }
        }
        posts.sort(function (lhs, rhs) {
            return rhs.timestamp - lhs.timestamp;
        });
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
        if (this.state.loaded === false) {
            blogsContent = <Loading/>
        } else {
            blogsContent =
                <Fragment>
                    <div className='blog-block'>
                        <div>
                            <div className="sender-info"><span className="sender-name">David</span><span
                                className="sender-id sender-at">@</span><span className="sender-id">4</span></div>
                            <div className="sent-time">2018/5/28 下午1:33:34</div>
                            <div className="blog-content">
                                Three decades ago, Ireland was a very different place. Divorce was illegal, as was
                                same-sex
                                marriage. Abortion, already illegal in practice, was constitutionally banned in a 1983
                                referendum -- known as the Eighth Amendment.

                                On Saturday Ireland emphatically voted to repeal that constitutional amendment in a
                                referendum, paving the way for legalized abortion.
                                "If you look at 1983, when the anti-abortion clause was put into the constitution, to
                                now,
                                the change is just extraordinary," said Irish Times columnist Fintan O'Toole.
                                <br/>
                                <img src="/img/shot.PNG" width={400} height={250}/>
                            </div>
                        </div>
                    </div>
                    {this.state.posts.map((blog) => {
                        let content;
                        try {
                            content = JSON.parse(blog.content);
                        } catch (e) {
                            content = {text: blog.content};
                        }
                        return <SingleBlog
                            key={blog.id + blog.account.address}
                            name={blog.accountName}
                            id={blog.id}
                            time={blog.timestamp}
                            content={content}
                        />;
                    })}
                </Fragment>
            ;
        }
        return (
            <CenterBlock>
                <div id='search-bar'>
                    <FormControl type="text" placeholder="Search"/>
                    <i className="fas fa-search"/>
                </div>
                <SendBlogBlock updatePosts={this.updatePosts}/>
                <hr/>
                <header className='text-center' id='blogs-header'>
                    Microblogs Square
                </header>
                {blogsContent}
            </CenterBlock>
        );
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
            return <img src={this.props.content.image} width={400} height={250}/>;
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
                        <OverlayTrigger trigger="click" placement="bottom" overlay={this.emojiPopover}>
                            <span id="emoji-tool">
                                <i className="far fa-smile"/>
                                <span id="emoji-button"> Emoji</span>
                            </span>
                        </OverlayTrigger>
                        <OverlayTrigger trigger="click" placement="bottom" overlay={this.uploadPhotoPopover}>
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
