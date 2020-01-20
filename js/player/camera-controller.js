import * as THREE from "../local_libs/three";

export default class CameraController {
  constructor(camera, player) {
    this._player = player;
    this._camera = camera;
  }

  update() {
    this._camera.lookAt(this._player.position);

    this._camera.position.lerp(new THREE.Vector3(
      this._player.position.x + 2,
      this._player.position.y + 1,
      this._player.position.z + 0
    ), 0.2);
  }
}