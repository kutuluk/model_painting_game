import * as THREE from "../local_libs/three";
import Utils from "../utils";
import PlayerControls from "./player-controls";
import Keyboard from "./keyboard";

export default class Player extends THREE.Group {
  constructor(targetModel, painter) {
    super();

    this._painter = painter;
    this._size = new THREE.Vector3(0.1, 0.1, 0.1);
    this._view = null;
    this._targetModel = targetModel;
    this._directional = new THREE.Vector3();

    this.position.set(
      targetModel.position.x + 2,
      targetModel.position.y + 2,
      targetModel.position.z + 2
    );

    this._controls = new PlayerControls(this, targetModel, painter);
    this._keyBoard = new Keyboard();
    this._initView();
  }

  _initView() {
    const geometry = new THREE.BoxGeometry(this._size.x, this._size.y, this._size.z);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);

    this.add(mesh);
    this._view = mesh;
  }

  update(dt) {
    this._directional.set(0, 0, 0);

    if (this._keyBoard.keys.up) {
      this._directional.z = -1;
    }
    else if (this._keyBoard.keys.bottom) {
      this._directional.z = 1;
    }

    if (this._keyBoard.keys.left) {
      this._directional.x = -1;
    }
    else if (this._keyBoard.keys.right) {
      this._directional.x = 1;
    }

    this._controls.setDirection(this._directional);
    this._controls.update(dt);
  }

  get size() {
    return this._size;
  }
}