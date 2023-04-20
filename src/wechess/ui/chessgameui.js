import React, { Fragment, useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva/'
import Game from '../models/chess'
import { useSelector } from 'react-redux'
import { selectBoardSize } from '../../feature/board/boardSlice'
import Piece from './pieceui'
import pieceuimap from './pieceuimap'
import { Image } from 'react-konva'

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
        state.gameState.movePiece()
    })

    const startDragging = (e) => {
        setState({ draggedPieceTargetId: e.target.attrs.id })
        console.log(e)
    }

    const endDragging = (e) => {
        const currentGame = state.gameState
        const currentBoard = currentGame.getBoard()
        const finalPosition = inferCoord(e.target.x() + (boardSize / 8), e.target.y() + (boardSize / 8), currentBoard)
        const selectedId = state.draggedPieceTargetId
        movePiece(selectedId, finalPosition, currentGame, true)
    }

    const movePiece = (selectedId, finalPosition, currentGame, isMyMove) => {

    }

    const inferCoord = (x, y, chessBoard) => {

    }

    

  return (
    <div>
        <div style={{width:`${boardSize.size}px`, height:`${boardSize.size}px`, backgroundImage: `url(assets/images/chessBoard.png)`, backgroundSize:"cover"}}>
            <Stage width={boardSize.size} height={boardSize.size}>
                <Layer>
                    {
                        state.gameState.getBoard().map((row, idx ) => {
                            return (
                                <Fragment key={idx}>
                                    {
                                        row.map((tile, idx)=>{
                                            if(tile.isOccupied()){
                                                return(
                                                    <Piece
                                                        key={idx}
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
    </div>
  )
}

export default Chessgameui
