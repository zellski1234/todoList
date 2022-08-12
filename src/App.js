import './App.css';
import { useEffect, useRef, useState } from 'react';
// icons
import { BsTrash } from 'react-icons/bs';
import { TiEdit } from 'react-icons/ti';

function App() {
	return (
		<div className="App">
			<TodoList />
		</div>
	);
}

// --------------------------- Functional Component ------------------------
function TodoForm ({ onSubmit }) {
	const [input, setInput] = useState("");

	// imported allows you to auto type on input for whatever one is set as ref 
	const inputRef = useRef(null)
	useEffect(() => {
		inputRef.current.focus()
	})

	function handleChange (i) {
		setInput(i.target.value);
	}

	// stops button from refreshing
	function handleSumbit (event) {
		event.preventDefault();	
		
		// generats random ID for listitem
		onSubmit(
			// object for each item containing random id and input
			{
			id: Math.floor(Math.random() * 10000),	
			text: input
			}
		);
		// makes input blank after click
		setInput("");
	};


	return(
		<form className='form-input' onSubmit={handleSumbit} >
			<input 
				type="text"
				placeholder="Type your task here" 
				value={input}
				name="text"
				className="todo-input"
				onChange={handleChange}
				ref={inputRef}
				autoComplete="off"
			/>
			<button className='todo-button'>+</button>
		</form>
	)
}

// --------------------------- Functional Component ------------------------
function TodoList () {
	const [list, setList] = useState([]);	
	// stops user from adding empty todo list items 
	// /^\s*$/ looks for blank space 
	function addTodo (todo){
		if(!todo.text || /^\s*$/.test(todo.text)){
			return
		}
		const newTodos = [todo, ...list]
		setList(newTodos);
	};
	
	const updateTodo = (listid, newValue) => {
		if(!newValue.text || /^\s*$/.test(newValue.text)){
			return
		}

		setList(prev => prev.map(item => (item.id === listid ? newValue : item)))
	};

	// allows you to remove selected todo list item
	function removeTodo (id, e) {
		e.stopPropagation()
		const removeList = [...list].filter(todo => todo.id !== id)
		setList(removeList)
	}

	// function to change classname of todo item, so if todo item is selected 
	// classname is complete
	function completeTodo (id){
		let updatedTodos = list.map(todo =>{
			if(todo.id === id) {
				todo.isComplete = !todo.isComplete
			}
			return todo;
		})
		setList(updatedTodos);
	}

  return (
	<div>
		<h1>Your To do list</h1>
		<TodoForm onSubmit={addTodo} />
		<Todo 
			list={list} 
			completeTodo={completeTodo} 
			removeTodo={removeTodo}
			updateTodo={updateTodo}
		/>
	</div>
  )
}

// --------------------------- Functional Component ------------------------
// the actual todo component that lists the item
function Todo ({ list, completeTodo, removeTodo, updateTodo}) {
	const [edit, setEdit] = useState(
		// object
		{
		id: null,
		value: ''
		}
	);

	function submitUpdate (value){
		updateTodo(edit.id, value)
		setEdit({
			id: null,
			value: ''
		})
	}

	if (edit.id) {
		return <TodoForm edit={edit} onSubmit={submitUpdate}/>
	}

	return list.map((todo, index) => (
		<div onClick={()=> {completeTodo(todo.id)}} className={todo.isComplete ? 'todo-row2 complete' : 'todo-row'} 
			 key={index}>
				<div key={todo.id} id="todo-text-div">
					<p id='todo-num'>{index+1}</p>&nbsp;<p id='todo-text'>{todo.text}</p>
				</div>
				<div className='icons'>
					<BsTrash 
						onClick={(e)=> removeTodo(todo.id, e)}
						id="delete-icon"
					/>
					<TiEdit 
						onClick={(e)=> {setEdit({id: todo.id, value: todo.text}); e.stopPropagation()}}
						id="edit-icon"
					/>
				</div>
		</div>
	))
}


export default App;
