// a HexGrid is two things:
//   1. a list of the properties of each hex.
//   2. a list of the occupants in the grid and their locations.



// TODO don't load this if we're trying to use an alternate.
import LokiDatastore from "../datastores/LokiDataStore.js";
const DefaultDatastore = LokiDatastore;

import HexCoords from "./HexCoords.js";

var _ = require('lodash');

const data = Symbol();

class HexGrid {

  constructor(overrides) {
    var defaults = {
      datastore: DefaultDatastore
    };

    let options = _.assign({}, defaults, overrides);

    this[data] = new options.datastore();
  }


  setHexProperties(hc, properties) {
    let coords = HexCoords.get(hc);
    return this[data].setHexProperties(coords, properties);
  }

  setHexProperty(hc, name, value) {
    let coords = HexCoords.get(hc);
    let props = {};
    props[name] = value;
    return this[data].setHexProperties(coords, props);
  }

  updateHexProperties(hc, properties) {
    let coords = HexCoords.get(hc);
    return this[data].updateHexProperties(coords, properties);
  }

  updateHexProperty(hc, name, value) {
    let coords = HexCoords.get(hc);
    let props = {};
    props[name] = value;
    return this[data].updateHexProperties(coords, props);
  }


  getHexProperties(hc) {
    let coords = HexCoords.get(hc);
    return this[data].getHexProperties(coords);
  }

  getHexProperty(hc, prop) {
    let coords = HexCoords.get(hc);
    return this[data].getHexProperties(coords)[prop];
  }


  removeHexProperties(hc) {
    let coords = HexCoords.get(hc);
    return this[data].removeHexProperties(coords);
  }

  removeHexProperty(hc, name) {
    let props = this.getHexProperties(hc);
    delete props[name];
    return this.setHexProperties(hc, props);
  }

  /**
   * @return a 2D array like:
   * [
   *  [HexCoords(), {...properties}],
   *  [HexCoords(), {...properties}],
   *  ...
   * ]
   */
  getAllHexProperties() {
    return this[data].getAllHexProperties();
  }



  /**
   * returns the unique ID of the occupant, so the caller can manipulate it,
   * remove it, etc.
   */
  addOccupant(object, hc) {
    let coords = HexCoords.get(hc);
    return this[data].addOccupant(coords, object);
  }

  getOccupant(occupantId, deserializeCallback = null) {
    let doc = this[data].getOccupant(occupantId);
    if (deserializeCallback) {
      doc = deserializeCallback(doc);
    }
    return doc;
  }

  removeOccupant(occupantId) {
    return this[data].removeOccupant(occupantId);
  }

  moveOccupant(occupantId, newCoords) {
    return this[data].moveOccupant(occupantId, newCoords);
  }

  getOccupantLocation(occupantId) {
    return this[data].getOccupantLocation(occupantId);
  }

  getAllOccupants(cb) {
    return this[data].getAllOccupants();
  }

}


HexGrid.buildRectangle = function(xSize, ySize, getHexPropertiesCallback) {
  var grid = new HexGrid();

  var currentRow = 0;
  var currentCol = 0;

  while (currentRow < ySize) {
    while (currentCol < xSize) {
      let offset = 0;

      if (currentRow % 2 == 0) {
        offset = currentRow / 2;
      } else {
        offset = (currentRow - 1) / 2;
      }

      let hc = HexCoords.get([currentCol - offset, currentRow]);
      grid.setHexProperties(hc, getHexPropertiesCallback(hc));
      currentCol += 1;
    }
    currentCol = 0;
    currentRow += 1;
  }
  return grid;
};


export default HexGrid;

// pathfinder...
//
// WHO is going from WHERE to WHERE?
//
// WHAT are the capabilities of WHO as it relates to the properties in each hex
// in the grid?
//
// in general:
//
// occupant from point A to point B
//                                                         
// three args:                                             
//                                                         
// findPath(fromCoords, toCoords, occupant) {}             
//                                                         
// as we work through A* algorithm for each hex, we ask the occupant for its
// "tax" for that hex.                                     
//                                                         
// maybe have a default "god occupant" or "null occupant" for direct route.
//
//                                                         
// getPath(fromCoords, toCoords, occupant = NullOccupant) {
// }    


