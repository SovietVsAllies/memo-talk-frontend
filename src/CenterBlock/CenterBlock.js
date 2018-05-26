import React, {Component} from 'react';

class CenterBlock extends Component {
    render() {
        const style = {
            maxWidth: '700px',
            padding: '3em 0 0 0',
            margin: '0 auto',
            backgroundColor: 'transparent',
        };
        return (
            <div className='container' style={style}>
                {this.props.children}
            </div>
        );
    }
}

export default CenterBlock;