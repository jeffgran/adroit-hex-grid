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
  // TODO maybe implement allNeighbors as getRing(distance)?
  allNeighbors() {
    return [
      this.neighbor(HexBearing.Q),
      this.neighbor(HexBearing.R),
      this.neighbor(HexBearing.S),
      this.neighbor(HexBearing._Q),
      this.neighbor(HexBearing._R),
      this.neighbor(HexBearing._S)
    ];
  }


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

  // A* pathfinding
  pathTo(toHex) {
    const openNodes = new NodeSet([this]);
    const closedNodes = new NodeSet([]);

    let currentNode = this;
    let stop = false;
    let ctr = 0
    while(!stop) {
      ctr++;
      /* console.log(`currentNode: ${currentNode.toString()}`)
       * console.log(`neighbors: ${currentNode.allNeighbors()}`)
       * console.log(`openNodes: ${openNodes.nodes}`)
       * console.log(`closedNodes: ${closedNodes.nodes}`) */
      closedNodes.add(currentNode);
      openNodes.remove(currentNode);

      if (currentNode == Infinity) {
        return null;
      }

      if (currentNode.is(toHex) || ctr == 100) {
        stop = true;
        break;
      }

      const nextNodes = _.filter(currentNode.allNeighbors(), (n) => {
        //!closedNodes.contains(n) && n.isWalkable() && (n.is(toHex) || !n.isOccupied())
        return !closedNodes.contains(n)
      });

      //console.log(`nextNodes: ${nextNodes}`);

      for (let node of nextNodes) {
        let G = 0;
        let n = node;
        while (n.parentNode) {
          /* if (n.isOccupied()) {
           *   G += 5 // artificial movement "tax" for occupied spaces
           * } else { */
          G++;
          //}
          n = n.parentNode;
        }

        if (!node.G || (node.G > G)) {
          node.G = G;
          node.parentNode = currentNode;
        }
        openNodes.add(node);

        node.H = (Math.abs(node.q-toHex.q) + Math.abs(node.r-toHex.r))
        node.F = node.G + node.H;
      }
      currentNode = _.minBy(openNodes.nodes, node => node.F);
    }

    const ret = [];
    while (!currentNode.is(this)) {
      ret.push(currentNode)
      currentNode = currentNode.parentNode;
    }

    // hmm, do i need to clear this out? seems to be working without this.
    /* for (let h of this.hexes) {
     *   h.H = null
     *   h.F = null
     *   h.G = null
     *   h.parentNode = null
     * } */

    return ret.reverse()
  }


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

class NodeSet {
  constructor(nodes) {
    this.array = []
    this.nodes = nodes
    for (let node of this.nodes) {
      this.add(node)
    }
  }

  add(node) {
    if (!this.contains(node)) {
      if (!this.array[node.q]) {
       this.array[node.q] = [];
      }
      this.array[node.q][node.r] = true;
      this.nodes.push(node);
    }
  }

  remove(node) {
    if (this.array[node.q] && this.array[node.q][node.r]) {
      this.array[node.q][node.r] = null;
      this.nodes = _.reject(this.nodes, n => n.is(node));
    }
  }

  contains(node) {
    return this.array[node.q] && this.array[node.q][node.r];
  }
}
