import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import './Loading.css'

class Loading extends Component {
    render() {
       return (
           <ReactLoading type='cylon' color='#7087ad' width={180} className='container loading-animation'/>
       );
    }
}

export default Loading;