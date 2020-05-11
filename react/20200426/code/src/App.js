import React,{ Component } from 'react';
import 'antd/dist/antd.css'
import { Input,Button,List } from 'antd'
import store from './store'
import { CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DELETE_TODO_ITEM,CHANGE_STATE_LIST } from './store/actionTypes'
import axios from 'axios'

class App extends Component{
	constructor(props){
		super(props)
		this.state=store.getState()
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleStoreChange=this.handleStoreChange.bind(this)
		this.handleBtnClick=this.handleBtnClick.bind(this)
		store.subscribe(this.handleStoreChange)
	}
	render(){
	  return (
	    <div className="App">
	      <Input
	      	value={ this.state.inputValue }
	      	placeholder="输入内容" 
	      	onChange={this.handleInputChange}
      	/>
	      <Button type="primary" onClick={this.handleBtnClick}>add</Button>
	      <div>
	      	<List
			      size="large"
			      bordered
			      dataSource={this.state.list}
			      renderItem={
			      	(item,index) => <List.Item 
			      	onClick={this.handleDeleteItem.bind(this,index)}>{item}</List.Item>}
			    />
	      </div>
	    </div>
	  )
	}
	componentDidMount(){
		axios.get("/list").then(res=>{
			console.log(res)
			var list=res.data
			const action={
				type:CHANGE_STATE_LIST,
				value:list
			}
			store.dispatch(action)
		}).catch(err=>{
			console.log(err)
		})
	}
	
	handleInputChange(e){
  	//如果要改变redux里面的值，需要你创建一个action
  	const action={
  		type:CHANGE_INPUT_VALUE,
  		value:e.target.value
  	}
  	store.dispatch(action)
  }
	handleStoreChange(){
		this.setState(store.getState)
	}
	handleBtnClick(){
		const action={
  		type:ADD_TODO_ITEM
  	}
		store.dispatch(action)
	}
	handleDeleteItem(index){
		const action={
  		type:DELETE_TODO_ITEM,
  		index
  	}
		store.dispatch(action)
	}
}

export default App;
