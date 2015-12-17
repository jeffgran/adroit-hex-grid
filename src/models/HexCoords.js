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
