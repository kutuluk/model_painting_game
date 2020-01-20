import * as THREE from "./local_libs/three";
import config from "./config";
import { GLTFLoader } from "./gltf-loader";
import Player from "./player/player";
import Painter from "./painter";
import { OrbitControls } from "./local_libs/orbit-controls";
import CameraController from "./player/camera-controller";

export default class GameState {
  constructor() {
    this._container = document.getElementById(config.elementName);
    this._renderer = null;
    this._scene = null;
    this._camera = null;
    this._player = null;
    this._painter = null;

    this._dpr = window.devicePixelRatio;
    this._viewWidth = window.innerWidth;
    this._viewHeight = window.innerHeight;
    this._model = null;
    this._prevTime = 0;

    this._load();
  }

  _load() {
    const modelURL = './assets/models/duck.glb';
    const manager = THREE.DefaultLoadingManager;
    const modelLoader = new GLTFLoader(manager);

    modelLoader.load(modelURL, asset => {
      this._model = asset.scene.children[0];
      const material = new THREE.MeshLambertMaterial();
      material.color = 0xff0000;

      this.setObjectMaterial(this._model, material);
      this._onAllLoaded();
    });
  }

  setObjectMaterial(object, newMaterial) {
    object.traverse(child => {
      if (child.isMesh) {
        child.material = newMaterial;
      }
    });

    return object;
  }

  _onAllLoaded() {
    this._init();
    window.requestAnimationFrame(time => this._update(time));
  }

  _init() {
    this._scene = new THREE.Scene();

    this._initRenderer();
    this._initCamera();
    this._initLight();
    this._initModel();
    this._initBrush();
    this._initPlayer();
    this._initCameraController();
    // this._initDebugControls();

    this._camera.position.set(0, 0, 15);

    window.addEventListener('resize', () => this._updateRenderer(), false);
    this._updateRenderer();
  }

  _initCameraController() {
    this._cameraController = new CameraController(this._camera, this._player);
  }

  _initPlayer() {
    this._player = new Player(this._model, this._painter);
    this._scene.add(this._player);
  }

  _initBrush() {
    this._painter = new Painter(this._scene, this._renderer, this._camera, this._model);
  }

  _initModel() {
    this._scene.add(this._model);
  }

  _initLight() {
    const ambientLightColor = 0xffffff;
    const ambientLightIntensity = 1;
    const directionalLightColor = 0xffffff;
    const directionalLightIntensity = 1;

    const ambientlight = new THREE.AmbientLight(ambientLightColor, ambientLightIntensity);
    const directionallight = new THREE.DirectionalLight(directionalLightColor, directionalLightIntensity);

    this._scene.add(ambientlight);
    this._scene.add(directionallight);
  }

  _initCamera() {
    const { cameraFov, cameraNear, cameraFar } = config;

    this._camera = new THREE.PerspectiveCamera(cameraFov, 0, cameraNear, cameraFar);
    this._scene.add(this._camera);

    this._camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  _update(time) {
    const dt = Math.min(32, time - this._prevTime);
    this._renderer.render(this._scene, this._camera);
    this._player.update(dt);
    this._cameraController.update(dt);

    this._prevTime = time;
    window.requestAnimationFrame(time => this._update(time));
  }

  _updateRenderer() {
    this._viewWidth = window.innerWidth;
    this._viewHeight = window.innerHeight;

    this._camera.aspect = this._viewWidth / this._viewHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._viewWidth, this._viewHeight);
  }

  _initDebugControls() {
    this._camera.position.set(0, 0, 1); //the controller will be blocked if the vector is zero
    const controls = new OrbitControls(this._camera);
    controls.update();
  }

  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(this._dpr);
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 0.95;

    this._container.append(renderer.domElement);
    this._renderer = renderer;
  }
}