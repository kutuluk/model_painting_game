import * as THREE from "./local_libs/three";

export default class Painter {
  constructor(scene, renderer, camera, mesh) {
    this._scene = scene;
    this._renderer = renderer;
    this._camera = camera;
    this._mesh = mesh;
    this._onClickPosition = new THREE.Vector2();
    this._x = 0;
    this._y = 0;

    this._raycaster = new THREE.Raycaster();

    this._canvas = document.createElement('canvas');
    this._canvas.width = this._canvas.height = 2048;
    this._context2D = this._canvas.getContext('2d');

    this._texture = new THREE.Texture(undefined, THREE.UVMapping, THREE.MirroredRepeatWrapping, THREE.MirroredRepeatWrapping);
    this._texture.anisotropy = this._renderer.capabilities.getMaxAnisotropy();
    this._texture.image = this._canvas;

    this._material = new THREE.MeshPhongMaterial({ map: this._texture });
    mesh.material = this._material;

    this._initCanvas();
  }

  setPosition(x, y) {
    this._x = x * this._canvas.width;
    this._y = y * this._canvas.height;

    this._draw();
  }

  _initCanvas() {
    this._context2D.fillStyle = 'gray';
    this._context2D.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this._texture.needsUpdate = true;
  }

  _draw() {
    const size = 15;

    this._context2D.lineWidth = 10; // it is better to divide this value by texture resolution
    this._context2D.strokeStyle = 'red';
    this._context2D.fillStyle = 'red';

    this._context2D.beginPath();
    // this._context2D.fillRect(this._x - halfSize, this._y - halfSize, 50, 50);
    this._context2D.arc(this._x, this._y, size, 0, Math.PI * 2);
    this._context2D.closePath();

    this._context2D.stroke();
    this._context2D.fill();

    this._texture.needsUpdate = true;
  }

  paint(uv) {
    this.setPosition(uv.x, uv.y);
  }
}