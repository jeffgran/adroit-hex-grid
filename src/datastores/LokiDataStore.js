import HexCoords from "../models/HexCoords.js";

import loki from 'lokijs';
import _ from 'lodash';

const hexes = Symbol();
const occupants = Symbol();

class LokiDatastore {
    
    constructor(filename = "hexgrid.json") {
        //let db = new loki(filename);
        let db = new loki();

        this[hexes] = db.addCollection('hexes', {indices: ['key']});

        this[occupants] = db.addCollection('occupants', {indices: ['key']});
    }

    getHexProperties(coords) {
        let results = this[hexes].find({key: coords.key});
        if (results.length == 0) {
            return {};
        } else {
            return results[0].properties;
        }
    }

    getHexCoords(properties) {
        let searchObject = {};

        for (let prop in properties) {
            searchObject[`properties.${prop}`] = properties[prop];
        }
        
        return this[hexes].find(searchObject).map((result) => {
            return new HexCoords(result.coords.x, result.coords.y);
        });
    }
    
    setHexProperties(coords, properties) {
        let data = LokiDatastore.serializeHex(coords, properties);
        this[hexes].insert(data);
        return properties;
    }

    updateHexProperties(coords, properties) {
        let props = this.getHexProperties(coords);
        this.removeHexProperties(coords);
        _.extend(props || {}, properties);
        this.setHexProperties(coords, props);
        return props;
    }

    removeHexProperties(coords) {
        let prev = this.getHexProperties(coords);
        if (prev === undefined) {
            return undefined;
        }
        
        this[hexes].removeWhere({key: coords.key});
        return prev;;
    }

    getAllHexProperties() {
        return _.map(this[hexes].chain().data(), function(obj) {
            let coords = new HexCoords(obj.coords.x, obj.coords.y);
            return [coords, obj.properties];
        });
    }


    

    addOccupant(coords, occupant) {
        let data = LokiDatastore.serializeOccupant(coords, occupant);
        this[occupants].insert(data);
        return data.$loki; // return the id of the new record
    }
    
    getOccupant(occupantId) {
        let data = this.getOccupantRecord(occupantId, 'occupant');
        if (data === undefined) {
            throw new MissingRecord();
        } else {
            return  data;
        }
    }
    
    removeOccupant(occupantId) {
        return this[occupants].remove(occupantId);
    }
    
    moveOccupant(occupantId, newQr, newR) {
        let data = this[occupants].get(occupantId);
        if (data === null) {
            throw new MissingRecord();
        }

        var newCoords;
        if (arguments.length == 3) {
            newCoords = HexCoords.get(newQr, newR);
        } else {
            newCoords = HexCoords.get(newQr);
        }

        data.coords = newCoords.serialize();
        return newCoords;
    }
    
    getOccupantLocation(occupantId) {
        let data = this.getOccupantRecord(occupantId, 'coords');
        if (data !== undefined && data.x !== undefined && data.y !== undefined) {
            return new HexCoords(data.x, data.y);
        } else {
            throw new MissingRecord();
        }
    }

    getAllOccupants() {
        return this[occupants].chain().data();
    }

    

    /* private */ getOccupantRecord(occupantId, record) {
        let result = this[occupants].get(occupantId);
        if (result === null) {
            return undefined;
        } else {
            return result[record];
        }
    }

    static serializeHex(coords, properties) {
        return {
            key: coords.key,
            coords: coords.serialize(),
            properties: properties
        };
    }

    static serializeOccupant(coords, occupant) {
        return {
            key: coords.key,
            coords: coords.serialize(),
            occupant: occupant//.serialize()
        };
    }
    
}

class MissingRecord {};

export default LokiDatastore;
