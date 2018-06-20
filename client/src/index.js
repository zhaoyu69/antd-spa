import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MRoute from './routes/index';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <MRoute />,
    document.getElementById('root')
);
registerServiceWorker();
