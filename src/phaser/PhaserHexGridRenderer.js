import {HexGridRenderer} from "adroit-hex-grid";


class PhaserHexGridRenderer extends HexGridRenderer {
    constructor(hexLongRadius, xOffset, yOffset, alpha, phaserGame, spriteKeyCallback) {
        super(hexLongRadius, xOffset, yOffset, alpha);
        this.phaserGame = phaserGame;
        this.spriteKeyCallback = spriteKeyCallback;
    }

    renderHex(vc, props) {
        let loc = vc.getLocation();
        let color = props.color;
        let localPoints = vc.getLocalPoints({inset: 1});

        // make a sprite and put it where it goes

        var spriteKey = this.spriteKeyCallback.apply(this, [vc, props]);

        // TODO -- what if I don't want a sprite, I just want to fill with color?
        var hexSprite = this.phaserGame.add.sprite(0, 0, spriteKey);
        hexSprite.anchor = new Phaser.Point(0.5, 0.5); // center the image on the coords I provide
        hexSprite.x = loc[0];
        hexSprite.y = loc[1];

        // build a hexagon mask from the points
        var mask = this.phaserGame.add.graphics(0,0);
        mask.beginFill("0xffffff");
        mask.drawPolygon(localPoints);
        hexSprite.mask = mask;
        hexSprite.addChild(mask);

        // set the "hit area" -- the clickable area for this sprite -- to the same poly as the mask.
        let poly = new PIXI.Polygon(localPoints);
        hexSprite.hitArea = poly;

        hexSprite.viewCoords = vc;
        hexSprite.inputEnabled = true;


        let hgr = this;
        // hook up the onDown event
        hexSprite.events.onInputDown.add(function(sprite, pointer) {
            hgr.phaserGame.downSprite = sprite;
            hgr.onDownSprite(sprite, pointer, vc, props);
        });

    }


    // override this if necessary
    onDownSprite(sprite, pointer, vc, props) {
        console.log(`onDownSprite : pixels = ${pointer.position.toString()} : coords = ${vc}`);
    }
}

export default PhaserHexGridRenderer;
