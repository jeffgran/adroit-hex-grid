var game = new Phaser.Game(800, 600, Phaser.AUTO, 'hexes', {create: createGame});

import {HexGrid, HexGridRenderer} from 'adroit-hex-grid';

var renderer, grid;
function createGame() {

    grid = new HexGrid();
    grid.setHexProperties([0,0], {color: 0x00ff00});
    grid.setHexProperties([0,1], {color: 0x00ff00});
    grid.setHexProperties([0,2], {color: 0x00ff00});
    grid.setHexProperties([-1,2], {color: 0x00ff00});
    grid.setHexProperties([1,0], {color: 0x0000ff});
    grid.setHexProperties([1,1], {color: 0x0000ff});
    grid.setHexProperties([1,2], {color: 0x0000ff});
    grid.setHexProperties([2,0], {color: 0x0000ff});

    renderer = new HexGridRenderer(60, 60, 60, 0);

    renderer.renderHexFunction = function (vc, props) {
        let hex = new Phaser.Polygon(vc.getLocalPoints({inset: 1}));
        
        let gfx = game.add.graphics(0, 0);
        let loc = vc.getLocation();
        gfx.x = loc[0];
        gfx.y = loc[1];
        
        gfx.beginFill(props.color);
        gfx.drawPolygon(hex.points);
        gfx.endFill();
    };
    
    renderer.render(grid);


};

