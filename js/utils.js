import * as THREE from "./local_libs/three";

export default class Utils {
  static getObjectSize(object) {
    object.geometry.computeBoundingBox();
    const box = new THREE.Box3().setFromObject(object);
    return box.getSize();
  }

  static getObjectRadius(object) {
    const size = Utils.getObjectSize(object);
    return Math.sqrt(size.x * size.x + size.y * size.y + size.z * size.z) / 2;
  }

  static getDirectional(vectorA, vectorB) {
    const dir = new THREE.Vector3();
    dir.subVectors(vectorB, vectorA);
    dir.normalize();
    return dir;
  }
}