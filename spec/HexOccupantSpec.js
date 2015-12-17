import HexOccupant from "../src/models/HexOccupant.js";

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
        
    });
});
