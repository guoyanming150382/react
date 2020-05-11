import React from 'react';     //引入react
import ReactDOM from 'react-dom';  
//import App from './App';     //根组件
import TodoList from './TodoList'
import './assets/style/reset.css';

// pwa
ReactDOM.render(
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>,
  document.getElementById('root')
);
