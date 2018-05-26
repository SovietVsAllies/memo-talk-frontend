import React, {Component} from 'react';
import './Manage.css';
import CenterBlock from "../CenterBlock/CenterBlock";
import {FormGroup, Button, HelpBlock, FormControl, ControlLabel} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

class Manage extends Component {
    constructor(props) {
        super(props);
        let followings = JSON.parse(localStorage.getItem('following'));
        if (localStorage.getItem('following') === null) {
            followings = [];
        }
        this.state = {
            followings: followings,
        };
        this.updateFollowing = this.updateFollowing.bind(this);
    }

    updateFollowing() {
        this.setState({
            followings: JSON.parse(localStorage.getItem('following')),
        });
        if (localStorage.getItem('following') === null) {
            this.setState({
                followings: [],
            });
        }
    }

    render() {
        return (
            <CenterBlock>
                <header id='manage-header' className='text-center'>Manage your following peers</header>
                <p className="lead text-muted text-center">Follow peers you like:</p>
                <ManageForm updateFollowing={this.updateFollowing}/>
                <ListGroup>
                    {this.state.followings.map((name) =>
                        <ListGroupItem>{name}</ListGroupItem>
                    )}
                </ListGroup>
            </CenterBlock>
        );
    }
}

class ManageForm extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {value: ''};
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 0 && length < 20) return 'success';
        else if (length >= 20 && length < 30) return 'warning';
        else if (length === 0 || length >= 30) return 'error';
        return null;
    };

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let name = this.state.value;
        let followingNames = localStorage.getItem('following');
        if (followingNames === null) {
            followingNames = [];
        } else {
            followingNames = JSON.parse(followingNames);
        }
        followingNames.push(name);
        localStorage.setItem('following', JSON.stringify(followingNames));
        this.props.updateFollowing();
    }

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
        return (
            <form id='manage-form' onSubmit={this.handleSubmit}>
                <FormGroup validationState={this.getValidationState()}>
                    <ControlLabel>Name:</ControlLabel>
                    <FormControl type='text' value={this.state.value}
                                 placeholder='Enter name...' onChange={this.handleChange}/>
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

export default Manage;