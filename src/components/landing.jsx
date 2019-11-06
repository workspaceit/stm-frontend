import React, { Component } from 'react';

import Header from './landing/layout/header';
import Footer from './landing/layout/footer';
import Main from './landing/landing-main';

class Landing extends Component {
    state = {  }
    render() { 
        return (
            <div>
                <div className="landing_body">
                    <Header />
                    <div className="landing_main">
                        <Main />
                    </div>

                    <Footer />
                </div>
            </div>
         );
    }
}
 
export default Landing;