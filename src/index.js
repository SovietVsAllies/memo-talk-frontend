import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header/Header'
import './index.css';
import Footer from './Footer/Footer';
import MicroBlogs from "./MicroBlogs/MicroBlogs";
import ParticleBackground from "./ParticleBackground/ParticleBackground";
import Register from "./Register/Register";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Manage from './Manage/Manage';
import ChatClient from "./Chat/components/ChatClient";

class MemoTalk extends Component {
    render() {
        return (
            <Fragment>
                <Header/>
                <ChatClient/>
                <ParticleBackground/>
                <Router>
                    <Fragment>
                        <Route exact path='/' component={MicroBlogs}/>
                        <Route exact path='/register/' component={Register}/>
                        <Route exact path='/manage/' component={Manage}/>
                    </Fragment>
                </Router>
                <Footer/>
            </Fragment>
        );
    }
}

ReactDOM.render(<MemoTalk/>, document.getElementById('root'));
