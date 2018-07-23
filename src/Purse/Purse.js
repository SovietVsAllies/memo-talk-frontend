import React from 'react';
import './Manage.css'
import CenterBlock from '../CenterBlock/CenterBlock'
import {Table, Button} from 'react-bootstrap';

export default class Purse extends React.Component {
    render() {
        return (
            <CenterBlock>
                <header id='manage-header' className='text-center'>Start your mining work.</header>
                <p className="lead text-muted text-center">It can make you more currency to chat or send blogs.</p>
                <Table className='text-center' striped bordered condensed hover id='purse-table'>
                    <thead>
                    <tr>
                        <th className='text-center'>Working ID</th>
                        <th className='text-center'>Working Time Amount</th>
                        <th className='text-center'>Mined Currency</th>
                        <th className='text-center'>Currency Amount</th>
                        <th className='text-center'>Operation</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>189ue239</td>
                        <td>9 Hours</td>
                        <td>373.1</td>
                        <td>212</td>
                        <td className='text-center'>
                            <Button bsStyle="danger">Stop</Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </CenterBlock>
        );
    }
}

