import React, { Fragment, useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva/'
import Game from '../models/chess'
import { useSelector } from 'react-redux'
import { selectBoardSize } from '../../feature/board/boardSlice'
import Piece from './pieceui'
import pieceuimap from './pieceuimap'
import Tile from '../models/tile'
// import { socket } from '../../connection/socket'
import { useParams } from 'react-router-dom'
import { selectUserInfo } from '../../feature/userInfo/userInfoSlice'
const socket = require('../../connection/socket').socket

const Chessgameui = (props) => {
    const boardSize = useSelector(selectBoardSize)
    const [state, setState] = useState({
        gameState: new Game(props.color, boardSize.size),
        draggedPieceTargetId: "",
        playerTurnToMoveIsWhite: true,
        whiteKingInCheck: false, 
        blackKingInCheck: false
    })
    

    useEffect(() => {
        console.log(props.myUserName)
        console.log(props.opponentUserName)
        // register event listeners
        socket.on('opponent move', move => {
            
    console.log(props.color)
            // move == [pieceId, finalPosition]
            // console.log("opponenet's move: " + move.selectedId + ", " + move.finalPosition)
            if (move.playerColorThatJustMovedIsWhite !== props.color) {
                movePiece(move.selectedId, move.finalPosition, state.gameState, false)
                setState({ ...state,
                    playerTurnToMoveIsWhite: !move.playerColorThatJustMovedIsWhite
                })
            }
        })
    })

    const startDragging = (e) => {
        setState({...state, draggedPieceTargetId: e.target.attrs.id })
    }

    const endDragging = (e) => {
        const currentGame = state.gameState
        const currentBoard = currentGame.getBoard()
        const finalPosition = inferCoord(e.target.x() + (boardSize.size / 8), e.target.y() + (boardSize.size / 8), currentBoard)
        const selectedId = state.draggedPieceTargetId
        movePiece(selectedId, finalPosition, currentGame, true)
    }
    const revertToPreviousState = (selectedId) => {
        /**
         * Should update the UI to what the board looked like before. 
         */
        const oldGS = state.gameState
        const oldBoard = oldGS.getBoard()
        const tmpGS = new Game(true, boardSize.size)
        const tmpBoard = []

        for (var i = 0; i < 8; i++) {
            tmpBoard.push([])
            for (var j = 0; j < 8; j++) {
                if (oldBoard[i][j].getPieceIdOnThisTile() === selectedId) {
                    tmpBoard[i].push(new Tile(j, i, null, oldBoard[i][j].canvasCoord))
                } else {
                    tmpBoard[i].push(oldBoard[i][j])
                }
            }
        }

        // temporarily remove the piece that was just moved
        tmpGS.setBoard(tmpBoard)

        setState({...state,
            gameState: tmpGS,
            draggedPieceTargetId: "",
        })

        setState({...state,
            gameState: oldGS,
        })
    }

    const movePiece = (selectedId, finalPosition, currentGame, isMyMove) => {

        var whiteKingInCheck = false 
        var blackKingInCheck = false
        var blackCheckmated = false 
        var whiteCheckmated = false
        const update = currentGame.movePiece(selectedId, finalPosition, isMyMove)
        console.log(update)
        if (update === "moved in the same position.") {
            revertToPreviousState(selectedId) // pass in selected ID to identify the piece that messed up
            return
        } else if (update === "user tried to capture their own piece") {
            revertToPreviousState(selectedId) 
            return
        } else if (update === "b is in check" || update === "w is in check") { 
            // change the fill of the enemy king or your king based on which side is in check. 
            // play a sound or something
            if (update[0] === "b") {
                blackKingInCheck = true
            } else {
                whiteKingInCheck = true
            }
        } else if (update === "b has been checkmated" || update === "w has been checkmated") { 
            if (update[0] === "b") {
                blackCheckmated = true
            } else {
                whiteCheckmated = true
            }
        } else if (update === "invalid move") {
            revertToPreviousState(selectedId) 
            return
        } 

        if (isMyMove) {
            socket.emit('new move', {
                nextPlayerColorToMove: !state.gameState.thisPlayersColorIsWhite,
                playerColorThatJustMovedIsWhite: state.gameState.thisPlayersColorIsWhite,
                selectedId: selectedId, 
                finalPosition: finalPosition,
                gameId: props.gameId
            })
        }

        setState({
            draggedPieceTargetId: "",
            gameState: currentGame,
            playerTurnToMoveIsWhite: !props.color,
            whiteKingInCheck: whiteKingInCheck,
            blackKingInCheck: blackKingInCheck
        })

        if (blackCheckmated) {
            alert("WHITE WON BY CHECKMATE!")
        } else if (whiteCheckmated) {
            alert("BLACK WON BY CHECKMATE!")
        }
    }
    

    const inferCoord = (x, y, chessBoard) => {
        var hashmap = {}
        var shortestDistance = Infinity
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                const canvasCoord = chessBoard[i][j].getCanvasCoord()
                // calculate distance
                const delta_x = canvasCoord[0] - x 
                const delta_y = canvasCoord[1] - y
                const newDistance = Math.sqrt(delta_x**2 + delta_y**2)
                hashmap[newDistance] = canvasCoord
                if (newDistance < shortestDistance) {
                    shortestDistance = newDistance
                }
            }
        }
        return hashmap[shortestDistance]
    }

    

  return (
    <Fragment>
        <div style={{width:`${boardSize.size}px`, height:`${boardSize.size}px`, backgroundImage: `url(assets/images/chessBoard.png)`, backgroundSize:"cover"}}>
            <Stage width={boardSize.size} height={boardSize.size}>
                <Layer>
                    {
                        state.gameState.getBoard().map((row, idx) => {
                            return (
                                <Fragment key={idx}>
                                    {
                                        row.map((tile, key)=>{
                                            if(tile.isOccupied()){
                                                return(
                                                    <Piece
                                                        key={key}
                                                        x = {tile.getCanvasCoord()[0]}
                                                        y = {tile.getCanvasCoord()[1]}
                                                        imgurls = {pieceuimap[tile.getPiece().name]}
                                                        isWhite = {tile.getPiece().color === "white"}
                                                        draggedPieceTargetId = {state.draggedPieceTargetId}
                                                        onDragStart = {startDragging}
                                                        onDragEnd = {endDragging}
                                                        id = {tile.getPieceIdOnThisTile()}
                                                        thisPlayersColorIsWhite = {props.color}
                                                        playerTurnToMoveIsWhite = {state.playerTurnToMoveIsWhite}
                                                        whiteKingInCheck = {state.whiteKingInCheck}
                                                        blackKingInCheck = {state.blackKingInCheck}
                                                    />
                                                )
                                            }
                                            return
                                        })
                                    }
                                </Fragment>
                            )
                        })
                    }
                </Layer>
            </Stage>
        </div>
    </Fragment>
  )
}

const GameWrapper = (props) => {
    // const color = useSelector(selectUserInfo)
    const { roomId } = useParams()
    const [opponentSocketId, setOpponentSocketId] = useState('')
    const [opponentDidJoinTheGame, didJoinGame] = useState(false)
    const [opponentUserName, setUserName] = useState('')
    const [gameSessionDoesNotExist, doesntExist] = useState(false)
    


    useEffect(() => {
        socket.on("playerJoinedRoom", statusUpdate => {
            console.log("A new player has joined the room! Username: " + statusUpdate.userName + ", Game id: " + statusUpdate.gameId + " Socket id: " + statusUpdate.mySocketId)
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId)
            }
        })
        socket.on("status", statusUpdate => {
            console.log(statusUpdate)
            alert(statusUpdate)
            if (statusUpdate === 'This game session does not exist.' || statusUpdate === 'There are already 2 people playing in this room.') {
                doesntExist(true)
            }
        })
        socket.on('start game', (opponentUserName) => {
            console.log("START!")
            if (opponentUserName !== props.myUserName) {
                setUserName(opponentUserName)
                didJoinGame(true) 
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy. 
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit('request username', roomId)
            }
        })
        socket.on('give userName', (socketId) => {
            if (socket.id !== socketId) {
                console.log("give userName stage: " + props.myUserName)
                socket.emit('recieved userName', {userName: props.myUserName, gameId: roomId})
            }
        })
        socket.on('get Opponent UserName', (data) => {
            console.log("this is from get opp usrName side")
            console.log(data)
            if (socket.id !== data.socketId) {
                setUserName(data.userName)
                console.log('data.socketId: data.socketId')
                setOpponentSocketId(data.socketId)
                didJoinGame(true) 
            }
        })
    },[])
    return(
        <Fragment>
            {
                opponentDidJoinTheGame ? (
                    <div>
                        <h4>Opponent: {opponentUserName}</h4>
                        <div style={{borderColor:"black", border:"2px solid black"}}>
                            <Chessgameui gameId={roomId} color={props.color} />
                        </div>
                        
                        <h4> You: {props.myUserName} </h4>
                    </div>
                    
                ): gameSessionDoesNotExist ? (
                    <div>
                        <h1>Game session does not exist</h1>
                    </div>
                ): (
                    <div>
                        <p>New game created... Share Below Link to Friend</p>
                        <input value={"localhost:3000/"+roomId} readOnly/>
                    </div>
                )
            }
        </Fragment>
    )
}

export default GameWrapper
