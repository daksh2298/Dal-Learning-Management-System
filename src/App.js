import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from "./pages/login";
import Register from "./pages/register";
import NotFound from "./pages/notfound";
import ConfirmRegister from "./pages/confirm";
import Upload from "./pages/upload";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route path='/register' component={Register} />
                        <Route path='/confirm/' component={ConfirmRegister} />
                        <Route path='/upload/' component={Upload} />
                        <Route path='*' component={NotFound} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
