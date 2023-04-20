import { Chess } from "chess.js";
import Piece from "./piece";
import Tile from "./tile";

class Game{
    constructor(isWhitePlayer){
        this.thisPlayerIsWhite = isWhitePlayer
        this.chessBoard = this.makeStartingBoard()
        
    }
    makeStartingBoard(){
        const backRank = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
        const initalBoard = []

    }
}

export default Game