import React,{ Component } from 'react';  // 编译reactdom

//const Component=React.Component
//傻瓜组件
//function TodoList(){
//	return(
//		<div>
//			<span>111</span>
//			<span>222</span>
//		</div>
//	)
//}

class TodoList extends Component{
	constructor(props){
		super(props)
		this.state={
			inputValue:'hello',
			list:[]
		}
	}
	render(){
		return(
			<div>
				<input 
					value={this.state.inputValue} 
					onChange={this.inputChange.bind(this)}
				/>
				<button>按钮</button>
			</div>
		)
	}
	inputChange(e){
//		console.log(this)   
		console.log(e.target.value)
		this.setState({
			inputValue:e.target.value
		})
		
	}
}
export default TodoList
