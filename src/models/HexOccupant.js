// an occupant is anything that is in a hex on the grid, but can move
import HexBearing from "./HexBearing";

const grid = Symbol();
const gridId = Symbol();
const bearing = Symbol();

class HexOccupant {

  constructor(b = HexBearing.Q) {
    HexBearing.assert(b);
    this[bearing] = b;
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

  get bearing() {
    return this[bearing];
  }

  turnTo(b) {
    HexBearing.assert(b);
    this[bearing] = b;
  }

  turnCW() {
    this[bearing] = HexBearing.next(this[bearing]);
  }

  turnCCW() {
    this[bearing] = HexBearing.previous(this[bearing]);
  }

  turnTowards(b) {
    HexBearing.assert(b);
    this[bearing] = HexBearing.step(this[bearing], b);
  }

  // TODO: do I need to serialize this? how to make it easy for subclasses? they will definitely need custom serialize or deflate/inflate functions.
  // serialize() {

  // }

}

class UnPlacedOccupantError {
  constructor(message) {
    this.message = message;
  }
};

export default HexOccupant;
