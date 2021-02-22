import React, { Component } from 'react';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { Navbar, Nav } from 'react-bootstrap';
import styled from 'styled-components';
import logo from '../img/logo.png';
import { blueColor, hoverBlue } from '../../pages/constants';
import Media from 'react-media';

const Link = styled.a`
    margin-left: 70px;
    margin-top: 20px;
`;

const NavigationItem = styled.p`
    border-top: 20px solid rgba(0, 0, 0, 0);
    color: black;
    :hover{
        color: gray;
    }
`;

const Contact = styled.p`
    color: black;
    :hover{
        color: gray;
    }
    @media(min-width: 992px){
        padding:0 20px;
        color: white;
        background:${blueColor};
        background-clip: border-box;
        border: 20px solid ${blueColor};
        border-radius: 30px;
        :hover{
            color: white;
            background: ${hoverBlue};
            background-clip: border-box;
            border: 20px solid ${hoverBlue};
            border-radius: 30px;
        }
    }
`;

class NavBar extends Component {
    render() {
        return (
            <Navbar collapseOnSelect expand="lg">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className="nav-link"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link href="/" className="nav-link">
                            <NavigationItem>Strona główna</NavigationItem>
                                </Link>
                        <Link href="/about" className="nav-link">
                            <NavigationItem>Zarząd</NavigationItem>
                                </Link>
                        <Link href="/garden" className="nav-link">
                            <NavigationItem>Plan ogrodu</NavigationItem>
                                </Link>
                        <Link href="/contact" className="nav-link">
                            <Contact>Kontakt</Contact>
                            </Link>
                    </Nav>
                    <Nav style={{ paddingRight: '70px' }}>
                        <Media query="(min-width: 992px)" render={() =>
                            (
                            <NavigationItem>
                                <img src={logo} height="60" alt="e-działkowiec"/>
                            </NavigationItem>
                            )}
                        />
                    </Nav> 
                </Navbar.Collapse>
            </Navbar>
        );
    };
};

export default NavBar