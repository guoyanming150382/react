import React,{ Component,Fragment } from 'react'
import Todoitem from './Todoitem'


class Todolist extends Component{
	constructor(props){
		super(props)
		this.state={
			inputValue:'hello',
			list:[
				'学习vue','学习react','学习angular'
			]
		}
		this.handleInput = this.handleInput.bind(this)
		this.handleBtnClick = this.handleBtnClick.bind(this)
	}
	render(){
		return(
			<Fragment>
				<label htmlFor="inputArea">点击获取焦点</label>	
				<input id="inputArea" value={this.state.inputValue} onChange={this.handleInput}/>
				<button onClick={this.handleBtnClick}>点击</button>
				<ul>
					{
						this.state.list.map((item,index)=>{
	    				return (
	    					<div key={index}>
		    					<Todoitem content={item} />
		    					{/*<li 
		    						key={index} 
		    						onClick={this.handleItemDelete.bind(this,index)}
		    					>
		    						{item}
	    						</li>
	    						*/}
	    					</div>
	    				)
	    			})
					}
				</ul>
			</Fragment>
		)
	}

	
	handleInput(e){
		this.setState({
			inputValue:e.target.value
		})
	}
	handleBtnClick(){
		if(this.state.inputValue){
			this.setState({
				list:[...this.state.list,this.state.inputValue],
				inputValue:''
			})
		}
	}
	//第一个参数永远都是事件对象
	handleItemDelete(index){
//		this.state.list.splice(index,1)  不要这样写
		const list=[...this.state.list]    //赋值拿到数据列表
		list.splice(index,1)               //删除对应的索引
		this.setState({
			list:list
		})	
	}
}


export default Todolist
