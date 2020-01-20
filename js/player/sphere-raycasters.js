import Utils from "../utils";
import * as THREE from "../local_libs/three";

export default class SphereRayCaster {
  constructor(model) {
    this._model = model;
    this._radius = Utils.getObjectRadius(model);
    this._numDirections = 5;
    this._directions = this._getRayDirections(this._numDirections);
    this._rayCaster = new THREE.Raycaster();
  }

  getIntersect(origin) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let result;

    for (let i = 0; i < this._directions.length; i++) {
      const direction = this._directions[i];
      this._rayCaster.set(origin, direction);
      const intersect = this._rayCaster.intersectObjects([this._model])[0];

      if (intersect && intersect.distance < minDist) {
        result = intersect;
      }
    }

    return result;
  }

  normalToWorld(object, normal) {
    var normalMatrix = new THREE.Matrix3(); // create once and reuse
    var worldNormal = new THREE.Vector3(); // create once and reuse

    normalMatrix.getNormalMatrix(object.matrixWorld);
    const vec = worldNormal.copy(normal).applyMatrix3(normalMatrix).normalize();
    return vec;
  }

  _getRayDirections(numDirections) {
    const directions = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < numDirections; i++) {
      const t = i / numDirections;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const dir = new THREE.Vector3(
        Math.sin(inclination) * Math.cos(azimuth),
        Math.sin(inclination) * Math.sin(azimuth),
        Math.cos(inclination)
      );

      directions.push(dir);
    }
    return directions;
  }
}