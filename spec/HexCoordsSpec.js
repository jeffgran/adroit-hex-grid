import HexCoords from "../src/models/HexCoords.js";

describe("HexCoords", function() {

    describe("static method .get", () => {
        it("returns an instance passed an instance", () => {
            let coords = new HexCoords(1, 2);
            expect(HexCoords.get(coords)).toEqual(coords);
        });
        
        it("returns an instance passed a q/r array", () => {
            let coords = new HexCoords(1, 2);
            expect(HexCoords.get([1, 2])).toEqual(coords);
        });
        
        it("returns an instance passed q/r values", () => {
            let coords = new HexCoords(1, 2);
            expect(HexCoords.get(1, 2)).toEqual(coords);
        });
    });
                

    describe("given an instance", () => {

        beforeEach(() => {
            this.subject = new HexCoords(1, 2);
        });
        
        it("exists", () => {
            expect(this.subject).toBeDefined();
        });
        
        it("has a q value", () => {
            expect(this.subject.q).toBe(1);
        });
        
        it("has an r value", () => {
            expect(this.subject.r).toBe(2);
        });
        
        it("has an x value", () => {
            expect(this.subject.x).toBe(1);
        });
        
        it("has an y value", () => {
            expect(this.subject.y).toBe(2);
        });
        
        it("has an z value", () => {
            expect(this.subject.z).toBe(-3);
        });

        it("calculates distance from another coord", () => {
            var other = new HexCoords(0, 0);
            expect(this.subject.absoluteDistanceFrom(other)).toBe(3);
        });

        it("is equal to another with the same coords", () => {
            var other = new HexCoords(1, 2);
            expect(this.subject.equalTo(other)).toBe(true);
        });

        it("is not equal to another with the different coords", () => {
            var other = new HexCoords(0, 0);
            expect(this.subject.equalTo(other)).toBe(false);
        });

        it("has a unique key per q/r values", () => {
            var other = new HexCoords(1, 2); // same q and r
            expect(this.subject.key).toEqual(other.key);
            
            other = new HexCoords(0, 0); // different q/r
            expect(this.subject.key).not.toEqual(other.key);
        });

        it("has a toString representation", () => {
            expect(this.subject.toString()).toBe("<HexCoords Q: 1, R: 2>");
        });

        it("serializes for storage", () => {
            expect(this.subject.serialize()).toEqual({x: this.subject.x, y: this.subject.y, z: this.subject.z});
        });
    });
    
});
