import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header/Header'
import './index.css';
import Footer from './Footer/Footer';
import MicroBlogs from "./MicroBlogs/MicroBlogs";
import Chat from "./Chat/Chat";
import ChatClient from "react-chat-client";
import ParticleBackground from "./ParticleBackground/ParticleBackground";

const blogListExample = [
    {
        name: 'David',
        id: 'adslkfjop132',
        blogID: 'adslfjqwe',
        time: '2018-02-02 18:32',
        content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculusmus.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.Nulla consequat ma quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim '
    },
    {
        name: 'David',
        id: 'adslkfjop132',
        blogID: 'adslf2qwe',
        time: '2018-02-02 18:32',
        content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculusmus.Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.Nulla consequat ma quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim '
    }
];

class MemoTalk extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Header/>
                <ParticleBackground/>
                <MicroBlogs/>
                <Footer/>
            </Fragment>
        );
    }
}

ReactDOM.render(<MemoTalk/>, document.getElementById('root'));
