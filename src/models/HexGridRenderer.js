import HexViewCoords from "./HexViewCoords";

class HexGridRenderer {

    constructor(hexLongRadius, xOffset, yOffset, alpha) {
        this.hexLongRadius = hexLongRadius;
        this.xOffset = xOffset || 0;
        this.yOffset = yOffset || 0;
        this.alpha = alpha || 0;
    }

    render(grid) {
        if (this.renderHex === undefined) {
            throw "please define a renderHex function before rendering!";
        }

        // render the hexes
        for (let [coords, props] of grid.getAllHexProperties()) {
            let vc = new HexViewCoords(coords, this);
            this.renderHex(vc, props);
        }

        // render the occupants
        for (let {occupant} of grid.getAllOccupants()) {
            console.log(occupant);
            if (typeof occupant.render == "function") {
                occupant.render(this);
            }
            else {
                console.warn(`Could not render occupant ${occupant.toString()} - .render was ${typeof occupant.render}`);
            }
        }

    }

}

export default HexGridRenderer;
