import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header/Header'
import './index.css';
import Footer from './Footer/Footer';
import MicroBlogs from "./MicroBlogs/MicroBlogs";
import ParticleBackground from "./ParticleBackground/ParticleBackground";
import Register from "./Register/Register";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Chat from './Chat/Chat';
import Purse from './Purse/Purse'

class MemoTalk extends Component {
    render() {
        return (
            <Fragment>
                <Header/>
                <ParticleBackground/>
                <Router>
                    <Fragment>
                        <Route exact path='/' component={MicroBlogs}/>
                        <Route exact path='/register/' component={Register}/>
                        <Route exact path='/chat/' component={Chat}/>
                        <Route exact path='/purse/' component={Purse}/>
                    </Fragment>
                </Router>
                <Footer/>
            </Fragment>
        );
    }
}

ReactDOM.render(<MemoTalk/>, document.getElementById('root'));
