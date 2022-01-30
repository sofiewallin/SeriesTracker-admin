/**
 * Entrypoint for webpack.
 * 
 * @author: Sofie Wallin
 */

 import React from 'react';
 import { render } from 'react-dom';
 import App from './components/App';
 import './App.scss';
 
 // Render app in root element in index.html
 const rootElement = document.querySelector('#root');
 render(<App />, rootElement);