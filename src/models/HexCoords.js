var _ = require('lodash');

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


  // neighbor: (bearing) ->
  //   @map.hexAt(@neighboring_coords(bearing)...)


  // neighboring_coords: (dir) ->
  //   switch dir
  //     when 0 then [@q, @r-1]
  //     when 1 then [@q+1, @r-1]
  //     when 2 then [@q+1, @r]
  //     when 3 then [@q, @r+1]
  //     when 4 then [@q-1, @r+1]
  //     when 5 then [@q-1, @r]

  // all_neighboring_coords: () ->
  //   [
  //     @neighboring_coords(0),
  //     @neighboring_coords(1),
  //     @neighboring_coords(2),
  //     @neighboring_coords(3),
  //     @neighboring_coords(4),
  //     @neighboring_coords(5)
  //   ]


  // isNeighbor: (otherHex) ->
  //   ret = null
  //   for dir in [0..5]
  //     n = @neighbor(dir)
  //     if n? && n.is(otherHex)
  //       ret = dir
  //   ret

  // oppositeNeighbor: (hex) ->
  //   if (dir = @isNeighbor(hex))?
  //     @neighbor(Hex.oppositeDir(dir))

  // is: (another) ->
  //   (another.q is @q) and (another.r is @r)
  // isNot: (another) ->
  //   !(@is(another))

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
