import React from 'react'

export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
        }
    }

    handleChange(e, file) {

    }

    render() {
        return (
            <input type="file" />
        );
    }
}