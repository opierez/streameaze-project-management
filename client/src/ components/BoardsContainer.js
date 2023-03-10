import React, {useEffect, useState, useContext} from "react";
import { useParams } from 'react-router-dom';
import '../styles/BoardsContainer.css'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import Board from "./Board";
import { UserContext } from "../Contexts/UserContext";


function BoardsContainer({ updateFavoritesBar }) {

    const [boards, setBoards] = useState([])
    // const [showForm, setShowForm] = useState(false)
    const [errors, setErrors] = useState([])
    const { id } = useParams()
    
    // used to set user state once a user logs in successfully
    const {user} = useContext(UserContext)

    // fetch all boards associated with logged in user
    useEffect(() => {
        fetch(`/users/${id}/boards`)
            .then(res => {
                if (res.ok) {
                    res.json().then(userBoards => {
                        setBoards(userBoards)
                    })
                } else {
                    res.json().then(data => {
                        setErrors(data.errors)
                    })
                }
            })
    }, [user])

    // handles adding a new board to the boards container
    const handleAddBoardClick = () => {
        fetch(`/users/${id}/boards`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ title: 'Insert Name Here'}) // sets the board name to a default for the user to ultimately update 
        }) 
        .then(res => {
            if (res.ok) {
                res.json().then((newBoard) => {
                    handleUpdateBoards([newBoard, ...boards]) // updates the boards list to include the new board at the beginning or the array
                })
            } else {
                res.json().then(data => {
                    setErrors(data.errors)
                })
            }
        })
    }

    // handles updating the boards state after an existing board has been edited or a new board has been added
    const handleUpdateBoards = (updatedBoards) => {
        setBoards(updatedBoards)
    }

    // updates the boards to remove the deleted board 
    const handleDeleteBoard = (boardId) => {
        // console.log(boardId)
        const updatedBoards = boards.filter(b => b.id !== boardId) // creates a new array of all the boards except the one that was deleted
        setBoards(updatedBoards)
    }


    

    return(
        <div className="boards-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <button onClick={handleAddBoardClick} style={{ marginRight: '10px' }}>
                        <span title="Add board">
                            <BsFillPlusCircleFill size={20}/>
                        </span>
                    </button>
                </div>
            </div>
            <div style={{ height: '800px', overflow: 'scroll'}}>
            {boards.map(board => (
                <Board 
                    key={board.id} 
                    board={board} 
                    handleUpdateBoards={handleUpdateBoards}
                    handleDeleteBoard={handleDeleteBoard}
                    updateFavoritesBar={updateFavoritesBar}
                />
            ))}
            </div>
        </div>
    )
}

export default BoardsContainer