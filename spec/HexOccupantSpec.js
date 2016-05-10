import HexOccupant from "../src/models/HexOccupant.js";
import HexBearing from "../src/models/HexBearing";

describe("HexOccupant", function() {

  beforeEach(() => {
    this.subject = new HexOccupant();
  });

  it("exists", () => {
    expect(this.subject).toBeDefined();
  });

  it("throws error trying to access gridId before placed on grid", () => {
    var getGridId = function() {
      let id = this.gridId;
    };
    expect(getGridId).toThrow();
  });

  it("throws error trying to access grid before placed on grid", () => {
    var getGrid = function() {
      let id = this.grid;
    };
    expect(getGrid).toThrow();
  });

  describe("after placing on a grid", () => {
    var grid, id;

    beforeEach(() => {
      grid = {
        addOccupant: (obj, coords) => {
          return 42; // fake id
        },
        moveOccupant: (obj, coords) => {}
      };
      id = this.subject.placeOnGrid(grid, [0,0]);
    });

    it("assigns grid after placement on grid", () => {
      expect(this.subject.grid).toBe(grid);
    });

    it("assigns grid id after placement on grid", () => {
      expect(this.subject.gridId).toEqual(42);
    });

    it("returns the id too", () => {
      expect(id).toEqual(42);
    });

    it('delegates movement to the grid', () => {
      spyOn(grid, 'moveOccupant');
      this.subject.moveTo([1,2]);
      expect(grid.moveOccupant).toHaveBeenCalledWith(id, [1,2]);
    });

    it('has a bearing, by default HexBearing.Q', () => {
      expect(this.subject.bearing).toEqual(HexBearing.Q);
    });

    it('can update the bearing', () => {
      this.subject.turnTo(HexBearing.S);
      expect(this.subject.bearing).toEqual(HexBearing.S);
    });

    it('can rotate the bearing', () => {
      // CW
      this.subject.turnCW();
      expect(this.subject.bearing).toEqual(HexBearing.R);
      this.subject.turnCW();
      expect(this.subject.bearing).toEqual(HexBearing.S);
      this.subject.turnCW();
      expect(this.subject.bearing).toEqual(HexBearing._Q);
      this.subject.turnCW();
      expect(this.subject.bearing).toEqual(HexBearing._R);
      this.subject.turnCW();
      expect(this.subject.bearing).toEqual(HexBearing._S);

      // CCW
      this.subject.turnCCW();
      expect(this.subject.bearing).toEqual(HexBearing._R);
      this.subject.turnCCW();
      expect(this.subject.bearing).toEqual(HexBearing._Q);
      this.subject.turnCCW();
      expect(this.subject.bearing).toEqual(HexBearing.S);
      this.subject.turnCCW();
      expect(this.subject.bearing).toEqual(HexBearing.R);
      this.subject.turnCCW();
      expect(this.subject.bearing).toEqual(HexBearing.Q);
    });

    it('can rotate towards another bearing', () => {
      // keep rotating towards S, then stay there.
      expect(this.subject.bearing).toEqual(HexBearing.Q);
      this.subject.turnTowards(HexBearing.S);
      expect(this.subject.bearing).toEqual(HexBearing.R);
      this.subject.turnTowards(HexBearing.S);
      expect(this.subject.bearing).toEqual(HexBearing.S);
      this.subject.turnTowards(HexBearing.S);
      expect(this.subject.bearing).toEqual(HexBearing.S);
    });

  });
});
