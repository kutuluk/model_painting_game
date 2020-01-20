import * as THREE from "./local_libs/three";

export default class RayHelper {
  constructor(parent, length = 100, color = 0xff0000) {
    this._length = length;
    this._color = color;
    this._parent = parent;
    this._arrow = null;
  }

  update(origin, dir) {
    this._arrow && this._parent.remove(this._arrow);
    this._arrow = new THREE.ArrowHelper(dir, origin, this._length, this._color);
    this._parent.add(this._arrow);
  }
}