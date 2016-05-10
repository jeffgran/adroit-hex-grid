const HexBearing = {

  // compass direction based on hexgrid alpha = 0
  Q: 1, // east
  R: 2, // south southeast
  S: 3, // south southwest
  _Q: 4, // west
  _R: 5, // north northwest
  _S: 6, // north northeast

  assert(bearing) {
    if (validBearings.includes(bearing)) return true;
    else throw new Error(`invalid bearing supplied: ${bearing}`);
  },


  /**
   * returns the bearing representing a 180° rotation from the given bearing.
   */
  opposite(bearing) {
    return HexBearing.next(bearing, 3);
  },



  /**
   * returns the "next" bearing in the infinite sequence of clockwise rotation.
   * @param {number} by - how many steps to rotate. default is 1
   */
  next(bearing, by = 1) {
    HexBearing.assert(bearing);
    const index = wrapIndex(validBearings.indexOf(bearing) + by);
    return validBearings[index];
  },


  /**
   * returns the "previous" bearing in the infinite sequence of clockwise rotation.
   * @param {number} by - how many steps to rotate. default is 1
   */
  previous(bearing, by = 1) {
    return HexBearing.next(bearing, -(by));
  },

  step(fromBearing, toBearing) {
    const diff = Math.abs(toBearing - fromBearing);
    let result;
    if (diff == 0) {
      result = toBearing;
    } else if ((diff <= 3 && fromBearing > toBearing) ||
               (diff > 3 && fromBearing < toBearing)) {
      result = HexBearing.previous(fromBearing);
    } else {
      result = HexBearing.next(fromBearing);
    }
    return result;
  }


};


const validBearings = [
  HexBearing.Q,
  HexBearing.R,
  HexBearing.S,
  HexBearing._Q,
  HexBearing._R,
  HexBearing._S,
];

function wrapIndex(i) {
  let res = (i % 6);
  if (res < 0) {
    res = res + 6;
  }
  return res;
}

HexBearing.all = validBearings;

export default HexBearing;
