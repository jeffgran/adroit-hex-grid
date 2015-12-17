// an occupant is anything that is in a hex on the grid, but can move

const grid = Symbol();
const gridId = Symbol();

class HexOccupant {
    
    constructor() {
        
    }

    placeOnGrid(aGrid, coords) {
        this[grid] = aGrid;
        return this[gridId] = this[grid].addOccupant(this, coords);
    }

    get gridId() {
        if (this[gridId] === undefined) {
            throw new UnPlacedOccupantError("This occupant is not on a grid yet!");
        }
        
        return this[gridId];
    }

    get grid() {
        if (this[grid] === undefined) {
            throw new UnPlacedOccupantError("This occupant is not on a grid yet!");
        }

        return this[grid];
    }

    moveTo(coords) {
        this.grid.moveOccupant(this[gridId], coords);
    }

    get hexCoords() {
        return this[grid].getOccupantLocation(this[gridId]);
    }

}

class UnPlacedOccupantError {
    constructor(message) {
        this.message = message;
    }
};

export default HexOccupant;
