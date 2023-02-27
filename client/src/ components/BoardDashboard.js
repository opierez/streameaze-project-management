import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Column from "./Column";
import { BsFillPlusCircleFill } from 'react-icons/bs'
import Modal from "./Modal";
import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

function BoardDashboard() {

    const { board_id } = useParams()

    const [columns, setColumns] = useState([])
    const [tasks, setTasks] = useState([])
    const [errors, setErrors] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedColumnId, setSelectedColumnId] = useState(null)
   

    // fetch all columns associated with current board 
    useEffect(() => {
        fetch(`/boards/${board_id}/columns`)
        .then (res => {
            if (res.ok) {
              res.json().then(columnData => {
                // console.log(columnData)
                setColumns(columnData)
                // setTasks(columnData.tasks)
              })
            } else {
              res.json().then(data => {
                // console.log(data)
                setErrors(data)
              })
            }
          })
    }, [])

    // fetch all tasks associated with current board
    useEffect(() => {
      fetch(`/boards/${board_id}/tasks`)
      .then (res => {
          if (res.ok) {
            res.json().then(taskData => {
              console.log(taskData)
              setTasks(taskData)
            })
          } else {
            res.json().then(data => {
              // console.log(data)
              setErrors(data)
            })
          }
        })
  }, [])


    // handles adding a new column to the board 
    const handleAddColumnClick = () => {
      
      fetch(`/boards/${board_id}/columns`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name: 'Insert Name Here' }) // sets the column name to a default for the user to ultimately update 
      })
      .then(res => {
        if (res.ok) {
          res.json().then(newColumn => {
            setColumns([...columns, newColumn]) // updates the columns list to add the new new column 
          })
        } else {
          res.json().then(data => {
            setErrors(data.errors)
          })
        }
      })
    }

    // updates columns list to include updated/edited column 
    const handleUpdatedColumn = (updatedColumn) => {
      const updatedColumns = columns.map(c => { // creates an updated columns array 
        if (c.id === updatedColumn.id) { // if the column matches the updated column being passed in, return the updated column 
          return updatedColumn
        }
        return c
      })
      setColumns(updatedColumns) // updates column list to include updated/edited column 
    }

    // show the Add New Task modal and set the selectedColumnId to the id of the column where the user clicked add task 
    const showNewTaskModal = (id) => {
      setSelectedColumnId(id)
      setShowModal(true)
    }

    // hides the Add New Task modal after a user has submitted their new task or chose to cancel adding a new task
    const handleCloseTaskModal = () => {
      setShowModal(false)
    }

    // when a new task has been added, update the tasks state with that new task 
    const handleAddNewTask = (task) => {
      // console.log(task)
      setTasks([...tasks, task])
    }


    return (
      <div className="mx-auto max-w-5xl w-full h-full overflow-x-scroll p-4">
        {showModal && <Modal childComponent={<AddTaskForm handleCloseTaskModal={handleCloseTaskModal} handleAddNewTask={handleAddNewTask} selectedColumnId={selectedColumnId}/>}/>}
      <div className="flex flex-row justify-between items-start">
          {columns.map(column => ( 
              <Column 
                key={column.id} 
                id={column.id} 
                columnName={column.name} 
                handleUpdatedColumn={handleUpdatedColumn}
                showNewTaskModal={showNewTaskModal}
                tasks={tasks}
                className="mb-4"/>
          ))}
          <button className="mt-4">
              <span title="Add column">
                  <BsFillPlusCircleFill size={30} onClick={handleAddColumnClick}/>
              </span>
          </button>
      </div>
  </div>
    )
}

export default BoardDashboard