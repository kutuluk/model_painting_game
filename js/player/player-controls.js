import * as THREE from "../local_libs/three";
import Utils from "../utils";
import RayHelper from "../ray-helper";
import SphereRayCaster from "./sphere-raycasters";

export default class PlayerControls {
  constructor(target, model, painter) {
    this._painter = painter;
    this._rayDistance = Utils.getObjectRadius(model) * 10;
    this._directional = new THREE.Vector3();
    this._target = target;
    this._model = model;
    this._speed = 0.001;

    this._target.position.set(1, 1, 0);
    this._target.lookAt(1, 0, 0);

    this._newPosition = new THREE.Vector3(target.position.x, target.position.y, target.position.z);
    this._rayCaster = new THREE.Raycaster();
    this._sphereRayCaster = new SphereRayCaster(this._model);

    // this._rayHelper = new RayHelper(model.parent, this._rayDistance);
  }

  setDirection(dir) {
    this._directional = dir;
  }

  _calculateTransform(dt) {
    this._newPosition = this._target.position.clone();

    let lookDir = this._target.getWorldDirection(new THREE.Vector3());
    this._directional.multiplyScalar(dt * this._speed);
    this._directional.cross(lookDir);
    this._newPosition.add(this._directional);

    lookDir = this._target.getWorldDirection(new THREE.Vector3());

    this._rayCaster.set(this._newPosition, lookDir);
    // this._rayHelper.update(this._newPosition, lookDir);

    let intersect = this._rayCaster.intersectObjects([this._model])[0] || this._sphereRayCaster.getIntersect(this._target.position);

    if (!intersect) {
      console.log('no intersects!');
      return;
    }

    this._painter.paint(intersect.object.material.map.transformUv(intersect.uv));

    const targetSize = this._target.size;
    const normal = this.localToWorld(this._model, intersect.face.normal);

    this._target.position.x = intersect.point.x + (targetSize.x * normal.x) / 2;
    this._target.position.y = intersect.point.y + (targetSize.y * normal.y) / 2;
    this._target.position.z = intersect.point.z + (targetSize.x * normal.z) / 2;

    this._target.lookAt(intersect.point.x, intersect.point.y, intersect.point.z);
  }

  localToWorld(object, normal) {
    var normalMatrix = new THREE.Matrix3(); // create once and reuse
    var worldNormal = new THREE.Vector3(); // create once and reuse

    normalMatrix.getNormalMatrix(object.matrixWorld);
    const vec = worldNormal.copy(normal).applyMatrix3(normalMatrix).normalize();
    return vec;
  }

  update(dt) {
    this._calculateTransform(dt);
  }
}