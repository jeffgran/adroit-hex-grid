import HexGrid from "../src/models/HexGrid.js";
import HexCoords from "../src/models/HexCoords.js";

describe("HexGrid", function() {
    it("instantiates", () => {
        expect(new HexGrid()).toBeDefined();
    });

    describe("integration with default datastore", () => {
        beforeEach(() => {
            this.grid = new HexGrid();
        });

        describe("basic hex properties operations", () => {
            
            
            it("can set hex properties", () => {
                this.grid.setHexProperties([0, 0], {"color" : "green"});
            });
            
            it("can get hex properties", () => {
                this.grid.setHexProperties([0, 0], {"color" : "green"});
                expect(this.grid.getHexProperties([0, 0])).toEqual({"color" : "green"});
            });
            
            it("returns {} getting not defined hex properties", () => {
                expect(this.grid.getHexProperties([9, 12])).toEqual({});
            });
            
            it("can set a single hex property", () => {
                this.grid.setHexProperty([0, 0], "color", "green");
                expect(this.grid.getHexProperties([0, 0])).toEqual({"color" : "green"});
            });
            
            it("can get a single hex property by name", () => {
                this.grid.setHexProperties([0, 0], {"color" : "green"});
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("green");
            });
            
            it("can update some existing hex properties without overwriting others", () => {
                this.grid.setHexProperties([0, 0], {"color" : "green", special: true});
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("green");
                expect(this.grid.getHexProperty([0, 0], "special")).toBe(true);

                this.grid.updateHexProperties([0, 0], { "color" : "blue" });
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("blue");
                expect(this.grid.getHexProperty([0, 0], "special")).toBe(true);
            });

            it("passes through to setProperties if updateProperties called on hex with no properties", () => {
                this.grid.updateHexProperties([0, 0], {"color" : "red"});
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("red");
            });

            it("updateProperty works like updateProperties", () => {
                this.grid.updateHexProperty([0, 0], "color", "red");
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("red");
            });

            it("updateProperty works like updateProperties", () => {
                this.grid.updateHexProperty([0, 0], "color", "red");
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("red");
            });


            it("removes all hex properties", () => {
                this.grid.setHexProperty([0, 0], "color", "red");
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("red");
                this.grid.removeHexProperties([0, 0]);
                expect(this.grid.getHexProperties([0, 0])).toEqual({});
            });

            it("removes a single hex property", () => {
                this.grid.setHexProperties([0, 0], {"color": "red", "special": true});
                expect(this.grid.getHexProperty([0, 0], "color")).toEqual("red");
                expect(this.grid.getHexProperty([0, 0], "special")).toEqual(true);
                this.grid.removeHexProperty([0, 0], "color");
                expect(this.grid.getHexProperties([0, 0])).toEqual({"special": true});
            });

            it("gets all hex properties as an array of arrays", () => {
                this.grid.setHexProperties([0, 0], {"color": "red"});
                this.grid.setHexProperties([0, 1], {"color": "green"});

                expect(this.grid.getAllHexProperties()).toEqual([
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
                let id = this.grid.addOccupant(stubOccupant, [0, 0]);
                expect(id).toEqual(1);
            });


            describe("given an occupant", () => {
                var id;
                
                beforeEach(() => {
                    id = this.grid.addOccupant(stubOccupant, [0, 0]);
                });

                it("knows where the occupant is", () => {
                    expect(this.grid.getOccupantLocation(id)).toEqual(HexCoords.get([0, 0]));
                });

                it("returns the serialized occupant by id", () => {
                    expect(this.grid.getOccupant(id)).toEqual(stubOccupant);
                });

                it("returns the deserialized occupant by id, when passing a deserialize callback", () => {
                    let deserialize = function(obj) {
                        return obj.name;
                    };
                    expect(this.grid.getOccupant(id, deserialize)).toEqual("the player");
                });

                it("can move the occupant", () => {
                    this.grid.moveOccupant(id, [1,2]);
                    expect(this.grid.getOccupantLocation(id)).toEqual(HexCoords.get([1, 2]));
                });

                it("can remove the occupant", () => {
                    this.grid.removeOccupant(id);
                    expect(() => {this.grid.getOccupantLocation(id);}).toThrow();
                    expect(() => {this.grid.getOccupant(id);}).toThrow();
                    expect(() => {this.grid.moveOccupant(id);}).toThrow();
                });

            });
            
        });



        
    });
});
