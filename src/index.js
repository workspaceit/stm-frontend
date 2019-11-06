import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from './store/store';
import registerServiceWorker from './registerServiceWorker';
import { ToastContainer, toast } from 'react-toastify';
import {ThroughProvider} from 'react-through';

toast.configure()
ReactDOM.render(
    <Provider store={store}>
        <ThroughProvider>
            <App /> 
        </ThroughProvider>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
