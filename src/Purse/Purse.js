import React from 'react';
import './Manage.css'
import CenterBlock from '../CenterBlock/CenterBlock'
import {Table, Button} from 'react-bootstrap';
import Application from "../Application/Application";

export default class Purse extends React.Component {
    render() {
        let web3 = Application.getInstance().web3;
        console.log(web3.fromWei(web3.eth.getBalance(web3.eth.defaultAccount)).toString());
        let balance = web3.fromWei(web3.eth.getBalance(web3.eth.defaultAccount)).toString() + ' Ether';
        let id = web3.eth.defaultAccount;
        return (
            <CenterBlock>
                <header id='manage-header' className='text-center'>Start your mining work.</header>
                <p className="lead text-muted text-center">It can make you more currency to chat or send blogs.</p>
                <Table className='text-center' striped bordered condensed hover id='purse-table'>
                    <thead>
                    <tr>
                        <th className='text-center'>Account ID</th>
                        <th className='text-center'>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{id}</td>
                        <td>{balance}</td>
                    </tr>
                    </tbody>
                </Table>
            </CenterBlock>
        );
    }
}

