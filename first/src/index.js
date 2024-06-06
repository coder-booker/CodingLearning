import React from 'react';      // 基本语法编译
import ReactDOM from 'react-dom/client';  // 用于渲染，即与浏览器对话
import reportWebVitals from './reportWebVitals';    // 监控性能，例如首次加载时间等
import './index.css';

import Board from './js/Square.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>  {/* 严格模式，用来发warning的 */}
    <Board amount={9} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();  // 监控性能，例如首次加载时间等
