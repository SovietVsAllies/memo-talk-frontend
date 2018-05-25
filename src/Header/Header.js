import React, {Component, Fragment} from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap'
import './Header.css'

class Header extends Component {
    render() {
        const items = this.isLoginedIn() ? (
            <AfterLoginItems/>
        ) : (
            <BeforeLoginItems/>
        );
        return (
            <Navbar collapseOnSelect id='nav-bar'>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">MemoTalk</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>{items}</Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    isLoginedIn() {
        return this.props.id === '';
    }
}

class BeforeLoginItems extends Component {
    render() {
        return (
            <NavItem eventKey={1} href="#">
                Register
            </NavItem>
        );
    }
}

class AfterLoginItems extends Component {
    render() {
        return (
            <Fragment>
                <NavItem eventKey={1} href="#">
                    Register
                </NavItem>
                <NavItem eventKey={2} href="#">
                    dfdf
                </NavItem>
            </Fragment>
        );
    }
}

export default Header;
