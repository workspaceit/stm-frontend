import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Dashboard from './components/dashboard/dashboard'
import './App.css';
import NotFound from './components/notFound'
import Login from './components/auth/login/login';
import Logout from './components/auth/logout/logout';
import Landing from './components/landing'
import Registration from './components/auth/registration/registration';
import Loader from './resources/images/loader.gif';
import stmConfig from './stmConfiguration';

class App extends Component {
  
  state = {
    loaderClass : "page_loader"
    
  }


  render() {
    return (
      <div className={'clearfix'}>
        <div className={this.state.loaderClass}>
            <div className="page_lead_wrap">
              <div className="page_loader_container">
              <img src={Loader} alt=""/>
              </div>
            </div>
        </div>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route path='/dashboard' component={Dashboard} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/logout' component={Logout} />
            <Route exact path='/registration' component={Registration} />
            <Route path='/:slug' component={Landing} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
  componentDidMount() {
    stmConfig.methods.sleep(1500).then(() => {
      const loaderClass = this.state.loaderClass + " hide";
      this.setState({ loaderClass })
    });     
  }
}

export default App;
