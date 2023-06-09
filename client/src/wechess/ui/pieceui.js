import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { useSelector } from 'react-redux';
import { selectBoardSize } from '../../feature/board/boardSlice';

const Piece = (props) => {
    const boardSize = useSelector(selectBoardSize)
    const playerColor = props.isWhite ? 0 : 1;
    const [image] = useImage(props.imgurls[playerColor])
    const isDragged = props.id === props.draggedPieceTargetId
    console.log(isDragged)
    const pieceCanBeMovedPlayer =  props.isWhite === props.thisPlayersColorIsWhite
    const isItThatPlayersTurn = props.playerTurnToMoveIsWhite === props.thisPlayersColorIsWhite
    const thisWhiteKingInCheck = props.id === "wk1" && props.whiteKingInCheck
    const thisBlackKingInCheck = props.id === "bk1" && props.blackKingInCheck

    return(
        <Image
            image = {image}
            x = {props.x - (boardSize.size / 8)}
            y = {props.y - (boardSize.size / 8)}
            draggable = {pieceCanBeMovedPlayer && isItThatPlayersTurn}
            width = {isDragged ? (boardSize.size / 9.6) : (boardSize.size / 12)}
            height = {isDragged ? (boardSize.size / 9.6) : (boardSize.size / 12)}
            onDragStart = {props.onDragStart}
            onDragEnd = {props.onDragEnd}
            fill = {(thisWhiteKingInCheck && "red") || (thisBlackKingInCheck && "red")}
            id = {props.id}
        />
    )
}

export default Piece