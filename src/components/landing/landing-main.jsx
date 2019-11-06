import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import Index from './index/index';
import About from './about/about';
import Contact from './contact/contact';
import NotFound from '../notFound'

class Main extends Component {
    state = {  }
    render() { 
        return ( 
            <div className="landing-wrap">
                <Switch>
                    <Route exact path='/' component={Index} />
                    <Route path='/about' component={About} />
                    <Route path='/contact' component={Contact} />
                    <Route component={NotFound} />
                </Switch>
            </div>
         );
    }
}
 
export default Main;