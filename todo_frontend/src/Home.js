import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import api from './api';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');

    useEffect(() => {
        api.get('/get')
            .then(result => setTodos(result.data))
            .catch(err => console.error('Failed to fetch tasks:', err));
    }, []);

    const edit = (id) => {
        api.put(`/edit/${id}`)
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return result.data;
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.error('Failed to mark task complete:', err));
    };

    const Update = (id, updatedTask) => {
        api.put(`/update/${id}`, { task: updatedTask.trim() })
            .then(result => {
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return result.data;
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
            })
            .catch(err => console.error('Failed to update task:', err));
    };

    const Hdelete = (id) => {
        api.delete(`/delete/${id}`)
            .then(result => {
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
            })
            .catch(err => console.error('Failed to delete task:', err));
    };

    return (
        <main>
            <Create />
            {
                todos.length === 0 ? <div className='task'>No tasks found</div> :
                    todos.map((todo) => (
                        <div className='task' key={todo._id}>
                            <div className='checkbox'>
                                {todo.done ? <BsFillCheckCircleFill className='icon' /> :
                                    <BsCircleFill className='icon' onClick={() => edit(todo._id)} />}
                                {taskid === todo._id ?
                                    <input type='text' value={updatetask} onChange={e => setUpdatetask(e.target.value)} />
                                    :
                                    <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                }
                            </div>
                            <div>
                                <span>
                                    <BsPencil className='icon' onClick={() => {
                                        if (taskid === todo._id) {
                                            Update(todo._id, updatetask);
                                        } else {
                                            setTaskid(todo._id);
                                            setUpdatetask(todo.task);
                                        }
                                    }} />
                                    <BsFillTrashFill className='icon' onClick={() => Hdelete(todo._id)} />
                                </span>
                            </div>
                        </div>
                    ))
            }
        </main>
    );
};

export default Home;
