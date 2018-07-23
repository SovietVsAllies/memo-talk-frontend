import React, {Component, Fragment} from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap'
import './Header.css'
import Application from "../Application/Application";

class Header extends Component {
    render() {
        const items = Header.isLoginedIn() ? (
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

    static isLoginedIn() {
        return typeof(localStorage.getItem('account')) === 'string' && localStorage.getItem('account');
    }
}

class BeforeLoginItems extends Component {
    render() {
        return (
            <NavItem eventKey={1} href="/register/">
                Register
            </NavItem>
        );
    }
}

class AfterLoginItems extends Component {
    render() {
        return (
            <Fragment>
                <NavItem eventKey={3} href="/purse/">
                    Purse
                </NavItem>
                <NavItem eventKey={1} href="/manage/">
                    Manage
                </NavItem>
                <NavItem eventKey={2} href="#">
                    {Application.getInstance().registry.getAccountName(localStorage.getItem('account'))}
                </NavItem>
            </Fragment>
        );
    }
}

export default Header;
