import React, { Fragment, useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva/'
import Game from '../models/chess'
import { useSelector } from 'react-redux'
import { selectBoardSize } from '../../feature/board/boardSlice'
import Piece from './pieceui'
import pieceuimap from './pieceuimap'
import { Image } from 'react-konva'
import Tile from '../models/tile'

const Chessgameui = (props) => {
    const boardSize = useSelector(selectBoardSize)
    console.log(boardSize)
    const [state, setState] = useState({
        gameState: new Game(props.color, boardSize.size),
        draggedPieceTargetId: "",
        playerTurnToMoveIsWhite: true,
        whiteKingInCheck: false, 
        blackKingInCheck: false
    })
    

    useEffect(() => {
        // state.gameState.movePiece()
    })

    const startDragging = (e) => {
        setState({...state, draggedPieceTargetId: e.target.attrs.id })
        // setState({draggedPieceTargetId: e.target.attrs.id })
        console.log(e.target.attrs.id)
    }

    const endDragging = (e) => {
        console.log("entered")
        const currentGame = state.gameState
        const currentBoard = currentGame.getBoard()
        const finalPosition = inferCoord(e.target.x() + (boardSize.size / 8), e.target.y() + (boardSize.size / 8), currentBoard)
        const selectedId = state.draggedPieceTargetId
        movePiece(selectedId, finalPosition, currentGame, true)
    }

    const movePiece = (selectedId, finalPosition, currentGame, isMyMove) => {

        var whiteKingInCheck = false 
        var blackKingInCheck = false
        var blackCheckmated = false 
        var whiteCheckmated = false
        const update = currentGame.movePiece(selectedId, finalPosition, isMyMove)

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

        setState({
            gameState: tmpGS,
            draggedPieceTargetId: "",
        })

        setState({
            gameState: oldGS,
        })
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
                        state.gameState.getBoard().map((row) => {
                            return (
                                <Fragment>
                                    {
                                        row.map((tile)=>{
                                            if(tile.isOccupied()){
                                                return(
                                                    <Piece
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

export default Chessgameui
