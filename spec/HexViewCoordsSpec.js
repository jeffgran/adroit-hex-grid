import HexGridRenderer from "../src/models/HexGridRenderer.js";
import HexCoords from "../src/models/HexCoords.js";
import HexViewCoords from "../src/models/HexViewCoords.js";

describe("HexViewCoords", function() {

    describe("given an instance", () => {
        let vc;
        
        beforeEach(() => {
            let renderer = new HexGridRenderer(60);
            vc = new HexViewCoords(new HexCoords(2, 1), renderer);
        });

        it("computes the pixel location", () => {
            expect(() => { vc.getLocation(); }).not.toThrow();
            let location = vc.getLocation();

            expect(location[0]).toBeCloseTo(259.80762113533154);
            expect(location[1]).toBeCloseTo(90);
        });

        it("computes the world vertex locations", () => {
            let points = vc.getWorldPoints();
            const expectedPoints = [
                { x: 311.769145, y: 120 },
                { x: 259.807621, y: 150 },
                { x: 207.846096, y: 120 },
                { x: 207.846096, y: 60 },
                { x: 259.807621, y: 30 },
                { x: 311.769145, y: 60 }
            ];
            expect(points.length).toBe(expectedPoints.length);
            points.forEach((p, i) => {
                expect(p.x).toBeCloseTo(expectedPoints[i].x);
                expect(p.y).toBeCloseTo(expectedPoints[i].y);
            });
        });

        it("computes the vertex locations with an inset", () => {
            let points = vc.getWorldPoints({inset: 2});
            const expectedPoints = [
                { x: 310.037094, y: 119 },
                { x: 259.807621, y: 148 },
                { x: 209.578147, y: 119 },
                { x: 209.578147, y: 61 },
                { x: 259.807621, y: 32 },
                { x: 310.037094, y: 61 }
            ];
            expect(points.length).toBe(expectedPoints.length);
            points.forEach((p, i) => {
                expect(p.x).toBeCloseTo(expectedPoints[i].x);
                expect(p.y).toBeCloseTo(expectedPoints[i].y);
            });
        });
        
    });
    
});
