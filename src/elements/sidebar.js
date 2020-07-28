import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Sidebar extends Component {
    render() {
        return (
            <div id="wrapper">
                <ul className="sidebar navbar-nav">
                    <li className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle" to={''}  id="pagesDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-fw fa-folder"></i>
                            <span>&nbsp;Pages</span>
                        </Link>
                        <div className="dropdown-menu" aria-labelledby="pagesDropdown">
                            <a className="dropdown-item" href="https://wordcloudv2-ch6r7tzjta-nn.a.run.app">Word Cloud</a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <Link to={'/upload'} className="nav-link"><i className="fas fa-fw fa-file-archive"></i>
                            <span>&nbsp;File Upload</span></Link>
                    </li>
                </ul>
            </div>
        );
    }
}
