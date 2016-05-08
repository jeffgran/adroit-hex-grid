import { Matrix } from 'sylvester';
var _ = require('lodash');

const sqrt3 = Math.sqrt(3);
const sqrt32 = sqrt3/2;

const LOCAL = Symbol();
const WORLD = Symbol();

class HexViewCoords {
    constructor(hexCoords, renderer) {
        this.hexCoords = hexCoords;
        this.renderer = renderer;
    }

    q() {
        return this.hexCoords.q;
    }

    r() {
        return this.hexCoords.r;
    }

    hexLongRadius() {
        return this.renderer.hexLongRadius;
    }

    hexShortRadius() {
        return sqrt32 * 2 * this.hexLongRadius();
    }

    xOffset() {
        return this.renderer.xOffset;
    }

    yOffset() {
        return this.renderer.yOffset;
    }

    alpha() {
        return this.renderer.alpha;
    }

    alphaRad() {
        return HexViewCoords.toRad(this.alpha());
    }

    pixelConversionMatrix() {
        return $M([[sqrt3, sqrt32], [0, 3/2]]).x(this.hexLongRadius());
    }

    rotationMatrix() {
        return Matrix.Rotation(this.alphaRad());
    }

    worldOffsetVector() {
        return $V([this.xOffset(), this.yOffset()]);
    }

    convertToWorldLocation(localLocationVector) {
        let results;
        
        // rotate
        results = this.rotationMatrix().x(localLocationVector);

        // add global x/y offset
        results = results.add(this.worldOffsetVector());

        return [results.e(1), results.e(2)];
    }

    applyRotation(xy) {
        let rotatedVector = this.rotationMatrix().x($V(xy));
        return [rotatedVector.e(1), rotatedVector.e(2)];
    }

    // convert the hexcoords to pixels (or whatever unit), based on the size and
    // rotation info from the renderer
    getLocation() {
        let results;
        
        let qrLocation = $V([this.q(), this.r()]);

        // convert to pixel location
        results = this.pixelConversionMatrix().x(qrLocation);

        return this.convertToWorldLocation(results);
    }

    getWorldPoints(opts = {}) {
        return this.getPoints(WORLD, opts.inset);
    }

    getLocalPoints(opts = {}) {
        return this.getPoints(LOCAL, opts.inset);
    }

    getPoints(type, inset) {
        return _.map([0, 1, 2, 3, 4, 5], (i) => {
            return this.getPoint(i, type, inset);
        });
    }

    getPoint(i, type, inset = 0) {
        let rad = HexViewCoords.toRad(60 * i + 30);
        let localX = (this.hexLongRadius() - inset) * Math.cos(rad);
        let localY = (this.hexLongRadius() - inset) * Math.sin(rad);
        let rotated = this.applyRotation([localX, localY]);


        // TODO this has a bug. the points are centered aroud the right spot, but are not locally rotated by the alpha.
        if (type == LOCAL) {
            return {
                // x: rotated[0],
                // y: rotated[1]
                x: localX,
                y: localY
                
            };
        } else if (type == WORLD) {
            let center = this.getLocation();
            return {
                x: rotated[0] + center[0],
                y: rotated[1] + center[1]
            };
        } else {
            throw `don't understand type ${type}`;
        }
    }

    toString() {
        return `[{HexViewCoords (q=${this.q()} r=${this.r()})}]`;
    }

}

HexViewCoords.toRad = function(degrees) {
    return degrees * Math.PI / 180;
};

export default HexViewCoords;
