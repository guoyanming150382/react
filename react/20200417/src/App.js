import React from 'react';
//import logo from './logo.svg';  // 从这里可以看到图片是如何引入的
import './header.css'


class App extends React.Component {
	render(){
	  return (
	    <div className="App">
	      <header className="App-header">
	        我是头部
	      </header>
	      <div>我是罗永浩</div>
	    </div>
	  );
 	}
}

export default App;