import React, {Component} from 'react';
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import './Register.css'

class Register extends Component {
    render() {
        return (
            <div className="register-block">
                <h1 className="text-center">Welcome!</h1>
                <p className="lead text-muted text-center">Please register to start your messaging:</p>
                <RegisterForm/>
            </div>
        );
    }
}

class RegisterForm extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: ''
        };
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 0 && length < 20) return 'success';
        else if (length >= 20 && length < 30) return 'warning';
        else if (length === 0 || length >= 30) return 'error';
        return null;
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    render() {
        return (
            <div className='container'>
                <form>
                    <FormGroup validationState={this.getValidationState()}>
                        <ControlLabel>Name:</ControlLabel>
                        <FormControl type='text' value={this.state.value}
                                     placeholder='Enter your name...' onChange={this.handleChange}/>
                        <FormControl.Feedback/>
                    </FormGroup>
                </form>
            </div>
        );
    }
}

export default Register;