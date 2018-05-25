import React, {Component} from 'react';
import Particles from 'react-particles-js';
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import './Register.css'

class Register extends Component {
    render() {
        return (
            <div className="register-block">
                <RegisterBackground/>
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

class RegisterBackground extends Component {
    render() {
        return (
            <Particles params={{
                "particles": {
                    "number": {
                        "value": 30,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#9d9d9d"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#ffffff"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 4,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#000000",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 6,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": false,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": false,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 400,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            }} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                zIndex: -100
            }}
            />
        );
    }
}

export default Register;