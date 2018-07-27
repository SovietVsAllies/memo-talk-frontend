import React, {Component} from 'react';
import {FormGroup, Button, HelpBlock, FormControl, ControlLabel} from 'react-bootstrap';
import './Register.css';
import Loading from '../Loading/Loading.js'
import $ from 'jquery';
import Application from "../Application/Application";
import CenterBlock from "../CenterBlock/CenterBlock";

class Register extends Component {
    render() {
        return (
            <CenterBlock>
                <header className="text-center" id='welcome-header'>Welcome!</header>
                <p className="lead text-muted text-center">Please register to start your messaging:</p>
                <RegisterForm/>
            </CenterBlock>
        );
    }
}

class RegisterForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            value: '',
            loading: false,
        };
    };

    getValidationState() {
        const length = this.state.value.length;
        if (length > 0 && length < 20) return 'success';
        else if (length >= 20 && length < 30) return 'warning';
        else if (length === 0 || length >= 30) return 'error';
        return null;
    };

    handleChange(e) {
        this.setState({value: e.target.value});
    };

    async handleSubmit(e) {
        e.preventDefault();
        this.setState({loading: true});
        let web3 = Application.getInstance().web3;
        let registry = Application.getInstance().registry;
        let accountContract = Application.getInstance().accountContract;
        let accountData = Application.getInstance().accountData;
        let name = this.state.value;
        let info = await $.ajax({
            url: 'http://localhost:' + Application.getInstance().SIGNAL_PORT + '/info/',
            dataType: 'json',
        });
        accountContract.new(
            info.registrationId,
            info.identityKey,
            info.signedPreKey,
            {
                from: web3.eth.accounts[0],
                data: accountData,
                gas: '4700000'
            }, function (e, contract) {
                if (typeof contract.address !== 'undefined') {
                    let transaction = registry.register(name, contract.address, {
                        from: web3.eth.defaultAccount,
                        gas: 4700000
                    });
                    setInterval(function () {
                        if (registry.getAccountName(contract.address)) {
                            localStorage.setItem('account', contract.address);
                            // location.reload();
                            this.setState({registered: true});
                        }
                    }.bind(this), 100);
                }
            }.bind(this));
    };

    getHelpText() {
        let element;
        if (this.state.value.length >= 30) {
            element = <HelpBlock>The length of name cannot be larger than 29.</HelpBlock>
        } else {
            element = null;
        }
        return element;
    };

    render() {
        if (this.state.registered) {
            // TODO
            window.location.href = '/';
            // return <Redirect to='/'/>;
        }
        if (this.state.loading) {
            return <Loading/>
        }
        return (
            <form id='register-form' onSubmit={this.handleSubmit}>
                <FormGroup validationState={this.getValidationState()}>
                    <ControlLabel>Name:</ControlLabel>
                    <FormControl type='text' value={this.state.value}
                                 placeholder='Enter your name...' onChange={this.handleChange}/>
                    {this.getHelpText()}
                    <FormControl.Feedback/>
                </FormGroup>
                <div className='text-center'>
                    <Button type='submit' bsStyle='primary'>Submit</Button>
                </div>
            </form>
        );
    }
}

export default Register;