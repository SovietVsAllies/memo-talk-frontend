import React, {Component} from 'react';
import './Footer.css'

class Footer extends Component {
    render() {
        return (
            <footer className="footer text-muted">
                <div className="container">
                    <p className="float-right">Constructed in <a href="https://reactjs.org/">React</a></p>
                    <p>© 2018 Company, Inc.</p>
                </div>
            </footer>
        )
    }
}

export default Footer;