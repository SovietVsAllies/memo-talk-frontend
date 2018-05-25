import './MicroBlogs.css'
import React, {Component, Fragment} from 'react';
import ParticleBackground from "../ParticleBackground/ParticleBackground";

/***
 * blogs: A list of blog
 * blog: name, id, blogID, time, content
 */
class MicroBlogs extends Component {
    render() {
        return (
            <Fragment>
                <header className='text-center' id='blogs-header'>These are microblogs from every peer:</header>
                <ParticleBackground/>
                <div className="container" id="blogs-block">
                    {this.props.blogs.map((blog) =>
                        <SingleBlogs blog={blog} key={blog.id + blog.blogID}/>
                    )}
                </div>
            </Fragment>
        );
    }
}

class SingleBlogs extends Component {
    render() {
        return (
            <div className='blog-block'>
                <div>
                    <div className='sender-info'>
                        <span className='sender-name'>{this.props.blog.name}</span>
                        <span className='sender-id sender-at'>@</span>
                        <span className='sender-id'>{this.props.blog.id}</span>
                    </div>
                    <div className='sent-time'>{this.props.blog.time}</div>
                    <div className='blog-content'>{this.props.blog.content}</div>
                </div>
            </div>
        );
    }
}

export default MicroBlogs;
