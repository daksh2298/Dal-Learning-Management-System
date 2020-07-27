import React, { Component } from 'react';


export default class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
        <footer className="sticky-footer">
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span>Copyright © Learning Management System 2020</span>
                </div>
            </div>
        </footer>
        );
    }
}
