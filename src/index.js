import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MRoute from './routes/index';
import registerServiceWorker from './registerServiceWorker';

// import TestRoute from './test/testroute';

ReactDOM.render(<MRoute />, document.getElementById('root'));
// ReactDOM.render(<TestRoute />, document.getElementById('root'));
registerServiceWorker();
