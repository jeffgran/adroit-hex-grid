import HexGrid from "../src/models/HexGrid.js";
import HexCoords from "../src/models/HexCoords.js";

describe("HexGrid", function() {
    it("instantiates", () => {
        expect(new HexGrid()).toBeDefined();
    });

    describe("integration with default datastore", () => {
        let grid;
        beforeEach(() => {
            grid = new HexGrid();
        });

        describe("basic hex properties operations", () => {
            
            
            it("can set hex properties", () => {
                grid.setHexProperties([0, 0], {"color" : "green"});
            });
            
            it("can get hex properties", () => {
                grid.setHexProperties([0, 0], {"color" : "green"});
                expect(grid.getHexProperties([0, 0])).toEqual({"color" : "green"});
            });
            
            it("returns {} getting not defined hex properties", () => {
                expect(grid.getHexProperties([9, 12])).toEqual({});
            });
            
            it("can set a single hex property", () => {
                grid.setHexProperty([0, 0], "color", "green");
                expect(grid.getHexProperties([0, 0])).toEqual({"color" : "green"});
            });
            
            it("can get a single hex property by name", () => {
                grid.setHexProperties([0, 0], {"color" : "green"});
                expect(grid.getHexProperty([0, 0], "color")).toEqual("green");
            });
            
            it("can update some existing hex properties without overwriting others", () => {
                grid.setHexProperties([0, 0], {"color" : "green", special: true});
                expect(grid.getHexProperty([0, 0], "color")).toEqual("green");
                expect(grid.getHexProperty([0, 0], "special")).toBe(true);

                grid.updateHexProperties([0, 0], { "color" : "blue" });
                expect(grid.getHexProperty([0, 0], "color")).toEqual("blue");
                expect(grid.getHexProperty([0, 0], "special")).toBe(true);
            });

            it("passes through to setProperties if updateProperties called on hex with no properties", () => {
                grid.updateHexProperties([0, 0], {"color" : "red"});
                expect(grid.getHexProperty([0, 0], "color")).toEqual("red");
            });

            it("updateProperty works like updateProperties", () => {
                grid.updateHexProperty([0, 0], "color", "red");
                expect(grid.getHexProperty([0, 0], "color")).toEqual("red");
            });

            it("updateProperty works like updateProperties", () => {
                grid.updateHexProperty([0, 0], "color", "red");
                expect(grid.getHexProperty([0, 0], "color")).toEqual("red");
            });


            it("removes all hex properties", () => {
                grid.setHexProperty([0, 0], "color", "red");
                expect(grid.getHexProperty([0, 0], "color")).toEqual("red");
                grid.removeHexProperties([0, 0]);
                expect(grid.getHexProperties([0, 0])).toEqual({});
            });

            it("removes a single hex property", () => {
                grid.setHexProperties([0, 0], {"color": "red", "special": true});
                expect(grid.getHexProperty([0, 0], "color")).toEqual("red");
                expect(grid.getHexProperty([0, 0], "special")).toEqual(true);
                grid.removeHexProperty([0, 0], "color");
                expect(grid.getHexProperties([0, 0])).toEqual({"special": true});
            });

            it("gets all hex properties as an array of arrays", () => {
                grid.setHexProperties([0, 0], {"color": "red"});
                grid.setHexProperties([0, 1], {"color": "green"});

                expect(grid.getAllHexProperties()).toEqual([
                    [new HexCoords(0, 0), {"color": "red"}],
                    [new HexCoords(0, 1), {"color": "green"}]
                ]);

            });
            
        });
        

        
        describe("basic occupant operations", () => {
            var stubOccupant;

            beforeEach(() => {
                // occupant is anything that responds to `serialize`
                stubOccupant = {
                    // serialize: function() {
                    //     return { name : "the player"};
                    // }
                    name : "the player"
                };
            });

            it("adds an occupant", () => {
                let id = grid.addOccupant(stubOccupant, [0, 0]);
                expect(id).toEqual(1);
            });


            describe("given an occupant", () => {
                var id;
                
                beforeEach(() => {
                    id = grid.addOccupant(stubOccupant, [0, 0]);
                });

                it("knows where the occupant is", () => {
                    expect(grid.getOccupantLocation(id)).toEqual(HexCoords.get([0, 0]));
                });

                it("returns the serialized occupant by id", () => {
                    expect(grid.getOccupant(id)).toEqual(stubOccupant);
                });

                it("returns the deserialized occupant by id, when passing a deserialize callback", () => {
                    let deserialize = function(obj) {
                        return obj.name;
                    };
                    expect(grid.getOccupant(id, deserialize)).toEqual("the player");
                });

                it("can move the occupant", () => {
                    grid.moveOccupant(id, [1,2]);
                    expect(grid.getOccupantLocation(id)).toEqual(HexCoords.get([1, 2]));
                });

                it("can remove the occupant", () => {
                    grid.removeOccupant(id);
                    expect(() => {grid.getOccupantLocation(id);}).toThrow();
                    expect(() => {grid.getOccupant(id);}).toThrow();
                    expect(() => {grid.moveOccupant(id);}).toThrow();
                });

            });
            
        });



        
    });
});
