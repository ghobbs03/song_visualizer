import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { RecoilRoot } from "recoil";


// const root = ReactDOM.createRoot(document.getElementById('root'))

ReactDOM.render(
  <BrowserRouter>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </BrowserRouter>,
  document.getElementById('root')
);