import _ from 'lodash';
import HexBearing from './HexBearing';

class HexCoords {

  static get() {
    if (arguments.length == 1) {
      let arg = arguments[0];
      if (arg instanceof HexCoords) {
        return arg;
      } else if (arg.length == 2) {
        return new HexCoords(...arg);
      }
    } else if (arguments.length == 2) {
      return new HexCoords(...arguments);
    }
    throw `unknown arguments. pass a HexCoords instance, a two-number array, or two numbers. Got: ${JSON.stringify(arguments)}`;
  }

  static keyFor(q, r) {
    return `${q}.${r}`;
  }

  constructor(q, r) {
    this.q = q;
    this.r = r;
  }

  get key() {
    return HexCoords.keyFor(this.q, this.r);
  }

  get x() {
    return this.q;
  }

  get y() {
    return this.r;
  }

  get z() {
    return (0 - this.q - this.r);
  }

  equalTo(other) {
    return (this.q == other.q &&
            this.r == other.r);
  }

  absoluteDistanceFrom(other) {
    return _.max([
      Math.abs(other.x - this.x),
      Math.abs(other.y - this.y),
      Math.abs(other.z - this.z)
    ]);
  }



  neighbor(bearing) {
    HexBearing.assert(bearing);

    switch (bearing) {
    case HexBearing.Q:
      return HexCoords.get([this.q+1, this.r]);
    case HexBearing.R:
      return HexCoords.get([this.q, this.r+1]);
    case HexBearing.S:
      return HexCoords.get([this.q-1, this.r+1]);
    case HexBearing._Q:
      return HexCoords.get([this.q-1, this.r]);
    case HexBearing._R:
      return HexCoords.get([this.q, this.r-1]);
    case HexBearing._S:
      return HexCoords.get([this.q+1, this.r-1]);
    default:
      throw "not possible";
    }
  }

  // TODO Next: we need isNeighbor for moveTowards to work.
  // maybe implement allNeighbors as getRing(distance)?

  // all_neighboring_coords: () ->
  //   [
  //     @neighboring_coords(0),
  //     @neighboring_coords(1),
  //     @neighboring_coords(2),
  //     @neighboring_coords(3),
  //     @neighboring_coords(4),
  //     @neighboring_coords(5)
  //   ]


  /**
   * @param {HexCoords} otherCoords
   * @return {bool|number} if otherCoords a direct neighbor to this, return the bearing from this to otherCoords. Otherwise return false.
   */
  isNeighbor(otherCoords) {
    let ret = false;
    HexBearing.all.forEach(b => {
      if (this.neighbor(b).is(otherCoords)) {
        ret = b;
      }
    });
    return ret;
  }

  is(otherCoords) {
    return ((this.q == otherCoords.q) && (this.r == otherCoords.r));
  }

  // oppositeNeighbor: (hex) ->
  //   if (dir = @isNeighbor(hex))?
  //     @neighbor(Hex.oppositeDir(dir))

  toString() {
    return `<HexCoords Q: ${this.q}, R: ${this.r}>`;
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }

}

export default HexCoords;
