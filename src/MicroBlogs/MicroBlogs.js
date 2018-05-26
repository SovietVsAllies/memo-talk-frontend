import './MicroBlogs.css';
import React, {Component, Fragment} from 'react';
import Loading from "../Loading/Loading";
import {FormGroup, Button, FormControl, ControlLabel} from 'react-bootstrap'
import Application from "../Application/Application";
import CenterBlock from "../CenterBlock/CenterBlock";
import {Redirect, Route} from 'react-router-dom';

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
                        {this.state.posts.map((blog) =>
                            <SingleBlog
                                key={blog.id + blog.account.address}
                                name={blog.accountName}
                                id={blog.id}
                                time={blog.timestamp}
                                content={blog.content}
                            />
                        )}
                    </Fragment>
            ;
        }
        return (
            <CenterBlock>
                <SendBlogBlock updatePosts={this.updatePosts}/>
                <hr/>
                <header className='text-center' id='blogs-header'>
                    These are microblogs from your following peers:
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
                    <div className='sender-info'>
                        <span className='sender-name'>{this.props.name}</span>
                        <span className='sender-id sender-at'>@</span>
                        <span className='sender-id'>{this.props.id}</span>
                    </div>
                    <div className='sent-time'>{this.props.time}</div>
                    <div className='blog-content'>{this.props.content}</div>
                </div>
            </div>
        );
    }
}

class SendBlogBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let account = Application.getInstance().account;
        let content = this.state.value;
        let count = account.getPostCount().toNumber();
        account.post(content, {gas: 4700000});
        this.timerId = setInterval(function() {
            if (account.getPostCount().toNumber() > count) {
                clearInterval(this.timerId);
                this.props.updatePosts();
                this.setState({value: ''});
            }
        }.bind(this), 100);
    }

    render() {
        // const Refresh = ({ path = '/' }) => (
        //     <Route
        //         path={path}
        //         component={({ history, location, match }) => {
        //             history.replace({
        //                 ...location,
        //                 pathname:location.pathname.substring(match.path.length)
        //             });
        //             return null;
        //         }}
        //     />
        // );
        // if (this.state.posted) {
        //     return <Refresh path='/'/>;
        // }
        let button;
        if (this.state.value !== '') {
            button = <Button bsStyle='primary' type="submit">Submit</Button>;
        } else {
            button = <Button bsStyle='primary' type="submit" disabled>Submit</Button>;
        }
        return (
            <form id='send-blog-block' onSubmit={this.handleSubmit}>
                <FormGroup controlId="formControlsTextarea" classNam='blog-block'>
                    <ControlLabel>Post a new micro-blog!</ControlLabel>
                    <FormControl componentClass="textarea" placeholder="Write something..." value={this.state.value}
                                 onChange={this.handleChange}/>
                </FormGroup>
                {button}
                <div style={{clear: 'both'}}/>
            </form>
        );
    }
}

export default MicroBlogs;
