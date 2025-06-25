import LokiDatastore from "../src/datastores/LokiDataStore.js";
import HexCoords from "../src/models/HexCoords.js";

describe("LokiDatastore", function() {
    let db;
    
    beforeEach(() => {
        db = new LokiDatastore();
    });
    
    it("exists", ()=>{
        expect(db).toBeDefined();
    });

    describe("with hex properties", () => {
        var coords;

        beforeEach(() => {
            coords = new HexCoords(...[0, 0]);
            db.setHexProperties(coords, {type: "mountain", snow: true});
        });

        it("overrides if setting the properties of the same coords again", () => {
            // TODO
        });
        
        it("can get hex properties by coordinates", () => {
            expect(db.getHexProperties(coords)).toEqual({type: "mountain", snow: true});
        });
        
        it("can get hex coordinates by property", () => {
            expect(db.getHexCoords({type: "mountain"})).toEqual([coords]);
        });

        it("returns {} when trying to get nonexistent hex by coordinates", () => {
            let wrongCoords = new HexCoords(...[9, 12]);
            expect(db.getHexProperties(wrongCoords)).toEqual({});
        });

        it("returns empty array when trying to get nonexistent hex by property", () => {
            let wrongProperties = {type: "forest"};
            expect(db.getHexCoords(wrongProperties).length).toEqual(0);
        });

        it("removes an existing record", () => {
            expect(db.removeHexProperties(coords)).toEqual({type: "mountain", snow: true});
            expect(db.getHexProperties(coords)).toEqual({});
        });

        it("no-op when removing a record that doesn't exist", () => {
            // TODO
        });

        it("updates an existing record", () => {
            expect(db.updateHexProperties(coords, {type: "hill"})).toEqual({type: "hill", snow: true});
            expect(db.getHexProperties(coords)).toEqual({type: "hill", snow: true});
        });

    });


    describe("with occupants", () => {
        var occupant, coords, id;

        beforeEach(() => {
            occupant = {
                name: "player",
                serialize: function() {
                    return {name: "player"};
                }
            };
            
            coords = new HexCoords(...[0, 0]);
            id = db.addOccupant(coords, occupant);
            expect(id).toEqual(1);
        });

        it("gets an occupant by id", () => {
            expect(db.getOccupant(id)).toEqual(occupant);
        });

        it("gets the location of an occupant by id", () => {
            expect(db.getOccupantLocation(id)).toEqual(new HexCoords(0, 0));
        });

        it("removes an occupant by id", () => {
            expect(() => {db.removeOccupant(id);}).not.toThrow();
            expect(() => {db.getOccupant(id);}).toThrow();
        });

        it("moves an occupant to a new location sending HexCoords object", () => {
            db.moveOccupant(id, HexCoords.get([9, 12]));
            expect(db.getOccupantLocation(id)).toEqual(new HexCoords(9, 12));
        });

        it("moves an occupant to a new location sending array of [q, r]", () => {
            db.moveOccupant(id, [9, 12]);
            expect(db.getOccupantLocation(id)).toEqual(new HexCoords(9, 12));
        });

        it("moves an occupant to a new location sending raw q, r", () => {
            db.moveOccupant(id, 9, 12);
            expect(db.getOccupantLocation(id)).toEqual(new HexCoords(9, 12));
        });
        
    });

});
