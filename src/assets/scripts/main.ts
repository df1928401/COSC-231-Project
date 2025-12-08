let canvas = document.querySelector('.scene-view') as HTMLCanvasElement;

let engine = new BABYLON.Engine(canvas, true);

let createScene = () => {
    let scene = new BABYLON.Scene(engine);

    let camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), scene);

    return scene;
}

let scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});