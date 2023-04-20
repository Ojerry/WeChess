class Tile {
    constructor(x,y, currentPiece, canvasCoordinate){
        this.x = x;
        this.y = y;
        this.currentPiece = currentPiece
        this.coordinate = canvasCoordinate;
    }
    setPiece(newPiece) {
        if (newPiece === null && this.currentPiece === null) {
            return
        } else if (newPiece === null) {
            // case where the function caller wants to remove the piece that is on this square. 
            this.currentPiece.setSquare(undefined)
            this.currentPiece = null
        } else if (this.currentPiece === null) {
            // case where the function caller wants assign a new piece on this square
            this.currentPiece = newPiece
            newPiece.setSquare(this)
        } else if (this.getPieceIdOnThisSquare() != newPiece.id && this.currentPiece.color != newPiece.color) {
            // case where the function caller wants to change the piece on this square. (only different color allowed)
            console.log("capture!")
            this.currentPiece = newPiece
            newPiece.setSquare(this)
        } else {
            return "user tried to capture their own piece"
        }
    }

    removePiece() {
        this.currentPiece = null
    }

    getPiece() {
        return this.currentPiece 
    }

    getPieceIdOnThisSquare() {
        if (this.currentPiece === null) {
            return "empty"
        }
        return this.currentPiece.id
    }

    isOccupied() {
        return this.currentPiece != null
    }

    getCoord() {
        return [this.x, this.y]
    }

    getCanvasCoord() {
        return this.canvasCoordinate
    }
}

export default Tile