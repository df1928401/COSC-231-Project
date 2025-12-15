let canvas = document.querySelector('.simulation-view') as HTMLCanvasElement;

let engine = new BABYLON.Engine(canvas, true);

let createScene = () => {

    let scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled;

    scene.clearColor = new BABYLON.Color4(1,1,1, 1);

    let camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 1, 1), scene);

    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,1,0), scene);
    light.intensity = 0.7;


    let dirLight = new BABYLON.DirectionalLight("dirlight", new BABYLON.Vector3(0, -1, 1), scene);
    dirLight.position = new BABYLON.Vector3(0, 1, -1);
    dirLight.intensity = 0.7;
    dirLight.shadowMinZ = 0.001;
    dirLight.shadowMaxZ = 100;
    camera.minZ = 0.01;
    camera.maxZ = 100;

    let shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);

    BABYLON.SceneLoader.ImportMesh("","assets/models/","drone.glb", scene,
        (meshes, particles, skeletons, animationGroups) => {
            drone.model = meshes[0];

            drone.retical = scene.getMeshByName('retical') as BABYLON.AbstractMesh;
            drone.retical.position.x += 0.000001;

            drone.model.rotationQuaternion = null;

            drone.model.position = new BABYLON.Vector3(0,0,0);
            drone.model.position.z -= .5;

            drone.model.checkCollisions = true;

            drone.model.computeWorldMatrix(true);

            dirLight.setDirectionToTarget(drone.model.position);
            shadowGenerator.addShadowCaster(drone.model);

            camera.lockedTarget = meshes[0];
        }
    );

    BABYLON.SceneLoader.ImportMesh("","assets/models/","bugs.glb", scene,
        (meshes, particles, skeletons, animationGroups) => {
            meshes[0].position = new BABYLON.Vector3(0,0,0);

            for(let mesh of meshes) {
                mesh.checkCollisions = true;
                mesh.receiveShadows = true;
                shadowGenerator.addShadowCaster(mesh);

                mesh.computeWorldMatrix(true);
                
                let name = mesh.name;
                let type: BugType = 'fly';

                if(name.includes('fly')) type = 'fly';
                if(name.includes('wasp')) type = 'wasp';
                if(name.includes('bee')) type = 'bee'

                let bug = new Bug(type, mesh);

                bugs.push(bug);
            }
            console.log(bugs);
        }
    );

    BABYLON.SceneLoader.ImportMesh("","assets/models/","table.glb", scene,
        (meshes, particles, skeletons, animationGroups) => {
            meshes[0].position = new BABYLON.Vector3(0,0,0);

            for(let mesh of meshes) {
                mesh.checkCollisions = true;
                mesh.receiveShadows = true;
                shadowGenerator.addShadowCaster(mesh);
            }
        }
    );

    scene.onBeforeRenderObservable.add(() => {
        if(drone.model) {
            if(drone.move.forward) drone.model.position.z -= drone.speed;
            if(drone.move.back) drone.model.position.z += drone.speed;
            if(drone.move.left) drone.model.position.x += drone.speed;
            if(drone.move.right) drone.model.position.x -= drone.speed;
            if(drone.move.rLeft) drone.model.rotation.y -= BABYLON.Tools.ToRadians(2.5);
            if(drone.move.rRight) drone.model.rotation.y += BABYLON.Tools.ToRadians(2.5);
            if(drone.move.up) drone.model.position.y += drone.speed;
            if(drone.move.down) drone.model.position.y -= drone.speed;
        }

        if(drone.retical) {
            for(let bug of bugs) {
                if(bug.model) {
                    if(drone.retical.intersectsMesh(bug.model, true)) {
                        // console.log('test');
                        if(settings.values.threatProfile.fly && bug.type === 'fly') {
                            bug.model.dispose();
                        }
                        if(settings.values.threatProfile.bee && bug.type === 'bee') {
                            bug.model.dispose();
                        }
                        if(settings.values.threatProfile.wasp && bug.type === 'wasp') {
                            bug.model.dispose();
                        }
                    }
                }
            }
        }
    });

    return scene;
}


class Bug {
    type: BugType
    model: BABYLON.AbstractMesh
    constructor(type: BugType, mesh: BABYLON.AbstractMesh) {
        this.type = type;
        this.model = mesh;
    }
}

let bugs: Bug[] = []

type BugType = 'fly' | 'wasp' | 'bee'

let scene = createScene();

window.addEventListener('DOMContentLoaded', event => {
    engine.resize();
});


engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});

window.addEventListener('keydown', event => {
    if(drone.model) {
        if(event.key === 'w') {
            drone.move.forward = true;
        }
        if(event.key === 's') {
            drone.move.back = true;
        }
        if(event.key === 'a' || event.key === 'ArrowLeft') {
            drone.move.left = true;
        }
        if(event.key === 'd' || event.key === 'ArrowRight') {
            drone.move.right = true;
        }
        if(event.key === 'q') {
            drone.move.rLeft = true;
        }
        if(event.key === 'e') {
            drone.move.rRight = true;
        }
        if(event.key === 'ArrowDown') {
            drone.move.down = true;
        }
        if(event.key === 'ArrowUp') {
            drone.move.up = true;
        }
    }
});

window.addEventListener('keyup', event => {
    if(drone.model) {
        if(event.key === 'w' || event.key === 'ArrowUp') {
            drone.move.forward = false;
        }
        if(event.key === 's' || event.key === 'ArrowDown') {
            drone.move.back = false;
        }
        if(event.key === 'a' || event.key === 'ArrowLeft') {
            drone.move.left = false;
        }
        if(event.key === 'd' || event.key === 'ArrowRight') {
            drone.move.right = false;
        }
        if(event.key === 'q') {
            drone.move.rLeft = false;
        }
        if(event.key === 'e') {
            drone.move.rRight = false;
        }
        if(event.key === 'ArrowDown') {
            drone.move.down = false;
        }
        if(event.key === 'ArrowUp') {
            drone.move.up = false;
        }
    }
});

window.addEventListener('keyup', event => {
});

class Drone {
    model: BABYLON.AbstractMesh | undefined
    retical: BABYLON.AbstractMesh | undefined
    speed: number = .01
    move = {
        left: false,
        forward: false,
        right: false,
        back: false,
        rLeft: false,
        rRight: false,
        down: false,
        up: false
    }
    constructor() {

    }
}

let drone = new Drone();