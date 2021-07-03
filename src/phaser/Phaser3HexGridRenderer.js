import {HexGridRenderer} from "adroit-hex-grid";


class Phaser3HexGridRenderer extends HexGridRenderer {
  constructor(hexLongRadius, xOffset, yOffset, alpha, phaserScene, spriteKeyCallback) {
    super(hexLongRadius, xOffset, yOffset, alpha);
    this.phaserScene = phaserScene;
    this.spriteKeyCallback = spriteKeyCallback;
  }

  renderHex(vc, props) {
    const loc = vc.getLocation();
    const color = props.color;
    const localPoints = vc.getLocalPoints({inset: 1});
    const scene = this.phaserScene;

    // make a sprite and put it where it goes
    // TODO -- what if I don't want a sprite, I just want to fill with color?
    const spriteKey = this.spriteKeyCallback.apply(this, [vc, props]);
    const hexSprite = scene.add.sprite(loc[0], loc[1], spriteKey);
    const mask = scene.add.graphics(0,0);
    mask.fillPoints(localPoints);
    mask.setPosition(loc[0], loc[1]);
    hexSprite.setMask(new Phaser.Display.Masks.GeometryMask(scene, mask));

    // set the "hit area" -- the clickable area for this sprite -- to the same poly as the mask.
    // the hitarea has an origin at the top-left of the sprite rather than the middle, so we have to offset by the "display origin".
    const poly = new Phaser.Geom.Polygon(localPoints.map(p => ({x: p.x+hexSprite.displayOriginX, y: p.y+hexSprite.displayOriginY})));
    hexSprite.setInteractive({
      hitArea: poly,
      hitAreaCallback: Phaser.Geom.Polygon.Contains,
      useHandCursor: true
    });

    hexSprite.viewCoords = vc;

    hexSprite.on("pointerdown", () => {
      scene.downSprite = hexSprite;
    });

  }
}

export default Phaser3HexGridRenderer;
