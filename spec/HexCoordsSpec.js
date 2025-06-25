import HexCoords from "../src/models/HexCoords.js";
import HexBearing from "../src/models/HexBearing";

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
        let subject;

        beforeEach(() => {
            subject = new HexCoords(1, 2);
        });
        
        it("exists", () => {
            expect(subject).toBeDefined();
        });
        
        it("has a q value", () => {
            expect(subject.q).toBe(1);
        });
        
        it("has an r value", () => {
            expect(subject.r).toBe(2);
        });
        
        it("has an x value", () => {
            expect(subject.x).toBe(1);
        });
        
        it("has an y value", () => {
            expect(subject.y).toBe(2);
        });
        
        it("has an z value", () => {
            expect(subject.z).toBe(-3);
        });

        it("calculates distance from another coord", () => {
            var other = new HexCoords(0, 0);
            expect(subject.absoluteDistanceFrom(other)).toBe(3);
        });

        it("is equal to another with the same coords", () => {
            var other = new HexCoords(1, 2);
            expect(subject.is(other)).toBe(true);
        });

        it("is not equal to another with the different coords", () => {
            var other = new HexCoords(0, 0);
            expect(subject.is(other)).toBe(false);
        });

        it("has a unique key per q/r values", () => {
            var other = new HexCoords(1, 2); // same q and r
            expect(subject.key).toEqual(other.key);
            
            other = new HexCoords(0, 0); // different q/r
            expect(subject.key).not.toEqual(other.key);
        });

        it("has a toString representation", () => {
            expect(subject.toString()).toBe("<HexCoords Q: 1, R: 2>");
        });

        it("serializes for storage", () => {
            expect(subject.serialize()).toEqual({x: subject.x, y: subject.y, z: subject.z});
        });

      describe("neighbors", () => {

        it("can tell you the neighbor, given a bearing", () => {
          const qNeighbor = subject.neighbor(HexBearing.Q);
          expect([qNeighbor.q, qNeighbor.r]).toEqual([2, 2]);
          const rNeighbor = subject.neighbor(HexBearing.R);
          expect([rNeighbor.q, rNeighbor.r]).toEqual([1, 3]);
          const sNeighbor = subject.neighbor(HexBearing.S);
          expect([sNeighbor.q, sNeighbor.r]).toEqual([0, 3]);
          const _qNeighbor = subject.neighbor(HexBearing._Q);
          expect([_qNeighbor.q, _qNeighbor.r]).toEqual([0, 2]);
          const _rNeighbor = subject.neighbor(HexBearing._R);
          expect([_rNeighbor.q, _rNeighbor.r]).toEqual([1, 1]);
          const _sNeighbor = subject.neighbor(HexBearing._S);
          expect([_sNeighbor.q, _sNeighbor.r]).toEqual([2, 1]);
        });

        it("can tell you whether another HexCoords is a neighbor or not", () => {
          let other = HexCoords.get([2,2]);
          expect(subject.isNeighbor(other)).toBe(HexBearing.Q);
          other = HexCoords.get([1,3]);
          expect(subject.isNeighbor(other)).toBe(HexBearing.R);
          other = HexCoords.get([0,3]);
          expect(subject.isNeighbor(other)).toBe(HexBearing.S);
          other = HexCoords.get([0,2]);
          expect(subject.isNeighbor(other)).toBe(HexBearing._Q);
          other = HexCoords.get([1,1]);
          expect(subject.isNeighbor(other)).toBe(HexBearing._R);
          other = HexCoords.get([2,1]);
          expect(subject.isNeighbor(other)).toBe(HexBearing._S);

          other = HexCoords.get([2,3]);
          expect(subject.isNeighbor(other)).toBe(false);
          other = HexCoords.get([3,2]);
          expect(subject.isNeighbor(other)).toBe(false);
          other = HexCoords.get([1,0]);
          expect(subject.isNeighbor(other)).toBe(false);
          other = HexCoords.get([99,99]);
          expect(subject.isNeighbor(other)).toBe(false);

        });

      });

    });
    
});
