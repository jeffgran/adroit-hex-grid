import HexGrid from "../src/models/HexGrid.js";
import HexCoords from "../src/models/HexCoords.js";
import HexGridRenderer from "../src/models/HexGridRenderer.js";
import HexViewCoords from "../src/models/HexViewCoords.js";

describe("HexGridRenderer", function() {
        
    it("instantiates", () => {
        expect(new HexGridRenderer(60)).toBeDefined();
    });

    describe("given a renderer", () => {
        var grid, renderer;
        
        beforeEach(() => {
            grid = new HexGrid();
            renderer = new HexGridRenderer(60);
        });

        it("ensures the renderHex is defined", () => {

            expect(() => { renderer.render(grid); }).toThrow();
        });

        it("works if the renderHex is defined", () => {
            renderer.renderHex = function() {};
            expect(() => { renderer.render(grid); }).not.toThrow();
        });
    });

    describe("given a renderer with a populated grid", () => {
        var grid, renderer;
        
        beforeEach(() => {
            grid = new HexGrid();
            grid.setHexProperties([0, 0], {"color" : "green"});
            grid.setHexProperties([0, 1], {"color" : "red"});
            renderer = new HexGridRenderer(60);
            renderer.renderHex = function(hc, props) { throw "${hc} ${props}"; };
        });

        it("render calls the render function with each coords/properties pair", () => {
            spyOn(renderer, 'renderHex');
            renderer.render(grid);
            expect(renderer.renderHex).toHaveBeenCalledWith(jasmine.any(HexViewCoords), {"color" : "green"});
            expect(renderer.renderHex).toHaveBeenCalledWith(jasmine.any(HexViewCoords), {"color" : "red"});
        });
        
    });
    
});
