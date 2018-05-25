import React, {Component} from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap'
import './Header.css'

class Header extends Component {
    render() {
        return (
            <Navbar collapseOnSelect id='nav-bar'>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">MemoTalk</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            Link Right
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            Link Right
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    )
        ;
    }
}

export default Header;
