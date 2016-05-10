import HexBearing from "../src/models/HexBearing.js";

describe("HexBearing", function() {

  describe('static assert', () => {
    it("returns true for valid bearings", () => {
      expect(HexBearing.assert(HexBearing.Q)).toBe(true);
      expect(HexBearing.assert(HexBearing._Q)).toBe(true);
      expect(HexBearing.assert(HexBearing.R)).toBe(true);
      expect(HexBearing.assert(HexBearing._R)).toBe(true);
      expect(HexBearing.assert(HexBearing.S)).toBe(true);
      expect(HexBearing.assert(HexBearing._S)).toBe(true);
    });
    it("throws error for invalid bearings", () => {
      expect(() => {HexBearing.assert(7)}).toThrow();
      expect(() => {HexBearing.assert("foo")}).toThrow();
      expect(() => {HexBearing.assert({foo: "bar"})}).toThrow();
    });
  });

  describe('transformation', () => {

    it("returns the opposite bearing", () => {
      expect(HexBearing.opposite(HexBearing.Q)).toBe(HexBearing._Q);
      expect(HexBearing.opposite(HexBearing.R)).toBe(HexBearing._R);
      expect(HexBearing.opposite(HexBearing.S)).toBe(HexBearing._S);
      expect(HexBearing.opposite(HexBearing._Q)).toBe(HexBearing.Q);
      expect(HexBearing.opposite(HexBearing._R)).toBe(HexBearing.R);
      expect(HexBearing.opposite(HexBearing._S)).toBe(HexBearing.S);
    });

    it("returns the next clockwise bearing", () => {
      expect(HexBearing.next(HexBearing.Q)).toBe(HexBearing.R);
      expect(HexBearing.next(HexBearing.R)).toBe(HexBearing.S);
      expect(HexBearing.next(HexBearing.S)).toBe(HexBearing._Q);
      expect(HexBearing.next(HexBearing._Q)).toBe(HexBearing._R);
      expect(HexBearing.next(HexBearing._R)).toBe(HexBearing._S);
      expect(HexBearing.next(HexBearing._S)).toBe(HexBearing.Q);
    });

    it("returns the previous clockwise bearing", () => {
      expect(HexBearing.previous(HexBearing.Q)).toBe(HexBearing._S);
      expect(HexBearing.previous(HexBearing.R)).toBe(HexBearing.Q);
      expect(HexBearing.previous(HexBearing.S)).toBe(HexBearing.R);
      expect(HexBearing.previous(HexBearing._Q)).toBe(HexBearing.S);
      expect(HexBearing.previous(HexBearing._R)).toBe(HexBearing._Q);
      expect(HexBearing.previous(HexBearing._S)).toBe(HexBearing._R);
    });

    it("returns next clockwise by more than one unit", () => {
      expect(HexBearing.next(HexBearing.Q, 1)).toBe(HexBearing.R);
      expect(HexBearing.next(HexBearing.Q, 2)).toBe(HexBearing.S);
      expect(HexBearing.next(HexBearing.Q, 3)).toBe(HexBearing._Q);
      expect(HexBearing.next(HexBearing.Q, 4)).toBe(HexBearing._R);
      expect(HexBearing.next(HexBearing.Q, 5)).toBe(HexBearing._S);
    });

    it("returns previous clockwise by more than one unit", () => {
      expect(HexBearing.previous(HexBearing.Q, 1)).toBe(HexBearing._S);
      expect(HexBearing.previous(HexBearing.Q, 2)).toBe(HexBearing._R);
      expect(HexBearing.previous(HexBearing.Q, 3)).toBe(HexBearing._Q);
      expect(HexBearing.previous(HexBearing.Q, 4)).toBe(HexBearing.S);
      expect(HexBearing.previous(HexBearing.Q, 5)).toBe(HexBearing.R);
    });

    it("returns the same direction if 'from' and 'to' are the same", () => {
      expect(HexBearing.step(HexBearing.Q, HexBearing.Q)).toBe(HexBearing.Q);
    });

    it("returns the to direction if the 'to' direction is only one unit away", () => {
      expect(HexBearing.step(HexBearing.Q, HexBearing.R)).toBe(HexBearing.R);
      expect(HexBearing.step(HexBearing.Q, HexBearing._S)).toBe(HexBearing._S);
    });

    it("returns the direction in-between if the ; direction is 2 units away", () => {
      expect(HexBearing.step(HexBearing.Q, HexBearing.S)).toBe(HexBearing.R);
      expect(HexBearing.step(HexBearing.Q, HexBearing._R)).toBe(HexBearing._S);
    });

    it("prefers clockwise if the 'to' direction is 3 units away", () => {
      expect(HexBearing.step(HexBearing.Q, HexBearing._Q)).toBe(HexBearing.R);
      expect(HexBearing.step(HexBearing.R, HexBearing._R)).toBe(HexBearing.S);
    });

  });



});
