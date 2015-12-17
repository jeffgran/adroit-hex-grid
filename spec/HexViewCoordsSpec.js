import HexGridRenderer from "../src/models/HexGridRenderer.js";
import HexCoords from "../src/models/HexCoords.js";
import HexViewCoords from "../src/models/HexViewCoords.js";

describe("HexViewCoords", function() {

    describe("given an instance", () => {
        var vc;
        
        beforeEach(() => {
            let renderer = new HexGridRenderer(60);
            vc = new HexViewCoords(new HexCoords(2, 1), renderer);
        });

        it("computes the pixel location", () => {
            expect(() => { vc.getLocation(); }).not.toThrow();
            let location = vc.getLocation();

            expect(location[0]).toBeCloseTo(259.80762113533154);
            expect(location[1]).toEqual(90);
        });

        it("computes the world vertex locations", () => {
            let points = vc.getWorldPoints();
            expect(points).toEqual([
                { x: 311.76914536239786, y: 120 },
                { x: 259.80762113533154, y: 150 },
                { x: 207.84609690826522, y: 120 },
                { x: 207.84609690826522, y: 59.99999999999999 },
                { x: 259.80762113533154, y: 30 },
                { x: 311.76914536239786, y: 59.99999999999997 }
            ]);
        });

        it("computes the vertex locations with an inset", () => {
            let points = vc.getWorldPoints({inset: 2});

            expect(points).toEqual([
                { x: 310.03709455482897, y: 119 },
                { x: 259.80762113533154, y: 148 },
                { x: 209.5781477158341, y: 119 },
                { x: 209.57814771583412, y: 60.99999999999999 },
                { x: 259.80762113533154, y: 32 },
                { x: 310.03709455482897, y: 60.99999999999997 }
            ]);
            
        });
        
    });
    
});
