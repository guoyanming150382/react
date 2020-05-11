import React from 'react'

class Todoitem extends React.Component{
	render(){
		return(
			<div>{this.props.content}</div>
		)
	}
}

export default Todoitem
