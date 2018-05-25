import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header/Header'
import './index.css';
import Footer from './Footer/Footer';
import Register from "./Register/Register";

class MemoTalk extends Component {
    render() {
        return (
            <Fragment>
                <Header/>
                <Footer/>
            </Fragment>
        );
    }
}
ReactDOM.render(<MemoTalk/>, document.getElementById('root'));
