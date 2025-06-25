import HexOccupant from "../src/models/HexOccupant.js";
import HexBearing from "../src/models/HexBearing";

describe("HexOccupant", function() {
  let subject;

  beforeEach(() => {
    subject = new HexOccupant();
  });

  it("exists", () => {
    expect(subject).toBeDefined();
  });

  it("throws error trying to access gridId before placed on grid", () => {
    expect(() => { let id = subject.gridId; }).toThrow();
  });

  it("throws error trying to access grid before placed on grid", () => {
    expect(() => { let g = subject.grid; }).toThrow();
  });

  describe("after placing on a grid", () => {
    let grid, id;

    beforeEach(() => {
      grid = {
        addOccupant: (obj, coords) => {
          return 42; // fake id
        },
        moveOccupant: (obj, coords) => {}
      };
      id = subject.placeOnGrid(grid, [0,0]);
    });

    it("assigns grid after placement on grid", () => {
      expect(subject.grid).toBe(grid);
    });

    it("assigns grid id after placement on grid", () => {
      expect(subject.gridId).toEqual(42);
    });

    it("returns the id too", () => {
      expect(id).toEqual(42);
    });

    it('delegates movement to the grid', () => {
      const moveSpy = jest.spyOn(grid, 'moveOccupant');
      subject.moveTo([1,2]);
      expect(moveSpy).toHaveBeenCalledWith(id, [1,2]);
    });

    it('has a bearing, by default HexBearing.Q', () => {
      expect(subject.bearing).toEqual(HexBearing.Q);
    });

    it('can update the bearing', () => {
      subject.turnTo(HexBearing.S);
      expect(subject.bearing).toEqual(HexBearing.S);
    });

    it('can rotate the bearing', () => {
      // CW
      subject.turnCW();
      expect(subject.bearing).toEqual(HexBearing.R);
      subject.turnCW();
      expect(subject.bearing).toEqual(HexBearing.S);
      subject.turnCW();
      expect(subject.bearing).toEqual(HexBearing._Q);
      subject.turnCW();
      expect(subject.bearing).toEqual(HexBearing._R);
      subject.turnCW();
      expect(subject.bearing).toEqual(HexBearing._S);

      // CCW
      subject.turnCCW();
      expect(subject.bearing).toEqual(HexBearing._R);
      subject.turnCCW();
      expect(subject.bearing).toEqual(HexBearing._Q);
      subject.turnCCW();
      expect(subject.bearing).toEqual(HexBearing.S);
      subject.turnCCW();
      expect(subject.bearing).toEqual(HexBearing.R);
      subject.turnCCW();
      expect(subject.bearing).toEqual(HexBearing.Q);
    });

    it('can rotate towards another bearing', () => {
      // keep rotating towards S, then stay there.
      expect(subject.bearing).toEqual(HexBearing.Q);
      subject.turnTowards(HexBearing.S);
      expect(subject.bearing).toEqual(HexBearing.R);
      subject.turnTowards(HexBearing.S);
      expect(subject.bearing).toEqual(HexBearing.S);
      subject.turnTowards(HexBearing.S);
      expect(subject.bearing).toEqual(HexBearing.S);
    });

  });
});
