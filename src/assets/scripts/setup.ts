class PageManager {
    base: Scene
    current: Page
    constructor(baseScene: Scene, page: Page) {
        this.base = baseScene;
        this.current = page;
        this.current.show();
    }
    next() {
        this.current.hide();

        if(this.current.next) {
            this.current = this.current.next;
            this.current.show();
        } else {
            console.error('Page does not have follow up!');
        }
    }
}

let nameInput = document.querySelector('#nameInput') as HTMLInputElement;
nameInput.addEventListener('change', event => {
    let nameWidget = document.querySelector('.device-name') as HTMLElement;

    nameWidget.innerHTML = nameInput.value;
});

class Page {
    base: HTMLElement
    last: Page | undefined
    next: Page | undefined
    nextButton: HTMLButtonElement
    callbacks: Function[] | undefined
    constructor(baseSelector: string, nextSelector: string, callbacks?: Function[]) {
        this.base = document.querySelector(baseSelector) as HTMLElement;
        this.nextButton = document.querySelector(nextSelector) as HTMLButtonElement;
        this.callbacks = callbacks;

        this.nextButton.addEventListener('click', () => {
            if(this.next) {
                pageManager.next();
            }
            if(this.callbacks) {
                for(let callback of this.callbacks) {
                    callback();
                }
            }
        });

        this.hide();
    }
    hide() {
        this.base.style.display = 'none';
    }
    show() {
        this.base.style.display = 'flex';
    }
}

class Scene {
    base: HTMLElement
    constructor(baseSelector: string) {
        this.base = document.querySelector(baseSelector) as HTMLElement;
        this.hide();
    }
    show() {
        this.base.style.display = 'block';
    }
    hide() {
        this.base.style.display = 'none';
    }
}

let setupScene = new Scene('.scene-setup');
let mainScene = new Scene('.scene-main');

let introPage = new Page('.intro-page', '.intro-page .next-button');
let pairPage = new Page('.pair-page', '.pair-page .next-button');
let namePage = new Page('.name-page', '.name-page .next-button');
let finalPage = new Page('.final-page', '.final-page .next-button', [toMain]);

introPage.next = pairPage;
pairPage.next = namePage;
namePage.next = finalPage;

function toMain() {
    setupScene.hide();
    mainScene.show();
    engine.resize();
}

let pageManager = new PageManager(setupScene, introPage);

setupScene.show();

class Settings {
    base: HTMLElement
    values: SettingsList = new SettingsList();
    shButton: HTMLElement;
    constructor(baseSelector: string) {
        this.base = document.querySelector(baseSelector) as HTMLElement;
        this.base.style.display = 'none';
        
        this.shButton = document.querySelector('.settings-button') as HTMLElement;

        let voltageInput = document.querySelector('.voltage-input') as HTMLInputElement;

        let threatFlyInput = document.querySelector('.threat-fly-input') as HTMLElement;
        let threatBeeInput = document.querySelector('.threat-bee-input') as HTMLElement;
        let threatWaspInput = document.querySelector('.threat-wasp-input') as HTMLElement;

        let detectionInput = document.querySelector('.detection-input') as HTMLInputElement;

        let savingOnInput = document.querySelector('.saving-on-input') as HTMLElement;
        let savingOffInput = document.querySelector('.saving-off-input') as HTMLElement;

        let perimeterSentinelInput = document.querySelector('.perimeter-sentinel-input') as HTMLElement;
        let perimeterManualInput = document.querySelector('.perimeter-manual-input') as HTMLElement;

        let crosshairNormalInput = document.querySelector('.crosshair-normal-input') as HTMLElement;
        let crosshairMinimalInput = document.querySelector('.crosshair-minimal-input') as HTMLElement;

        voltageInput.addEventListener('change', event => {
            this.values.voltage = Number(voltageInput.value);
        });

        threatFlyInput.addEventListener('click', event => {
            if(threatFlyInput.classList.contains('on')) {
                this.values.threatProfile.fly = false;
                threatFlyInput.classList.remove('on');
                threatFlyInput.classList.add('off');
            } else {
                this.values.threatProfile.fly = true;
                threatFlyInput.classList.remove('off');
                threatFlyInput.classList.add('on');
            }
        });
        threatBeeInput.addEventListener('click', event => {
            if(threatBeeInput.classList.contains('on')) {
                this.values.threatProfile.bee = false;
                threatBeeInput.classList.remove('on');
                threatBeeInput.classList.add('off');
            } else {
                this.values.threatProfile.bee = true;
                threatBeeInput.classList.remove('off');
                threatBeeInput.classList.add('on');
            }
        });
        threatWaspInput.addEventListener('click', event => {
            if(threatWaspInput.classList.contains('on')) {
                this.values.threatProfile.wasp = false;
                threatWaspInput.classList.remove('on');
                threatWaspInput.classList.add('off');
            } else {
                this.values.threatProfile.wasp = true;
                threatWaspInput.classList.remove('off');
                threatWaspInput.classList.add('on');
            }
        });

        detectionInput.addEventListener('change', event => {
            this.values.detectionSensitivity = Number(detectionInput.value);
        });

        savingOnInput.addEventListener('click', event => {
            if(savingOnInput.classList.contains('on')) {
                this.values.powerSaving = false;
                savingOnInput.classList.remove('on');
                savingOnInput.classList.add('off')

                savingOffInput.classList.remove('off');
                savingOffInput.classList.add('on');
            } else {
                this.values.powerSaving = true;
                savingOnInput.classList.add('on');
                savingOnInput.classList.remove('off');

                savingOffInput.classList.remove('on');
                savingOffInput.classList.add('off')
            }
        });
        savingOffInput.addEventListener('click', event => {
            if(savingOffInput.classList.contains('on')) {
                this.values.powerSaving = true;

                savingOffInput.classList.remove('on');
                savingOffInput.classList.add('off');

                savingOnInput.classList.add('on');
                savingOnInput.classList.remove('off');
            } else {
                this.values.powerSaving = false;

                savingOffInput.classList.add('on');
                savingOffInput.classList.remove('off');

                savingOnInput.classList.remove('on');
                savingOnInput.classList.add('off');
            }
        });

        perimeterManualInput.addEventListener('click', event => {
            if(perimeterManualInput.classList.contains('on')) {
                this.values.defensePath = 'sentinel';

                perimeterManualInput.classList.remove('on');
                perimeterManualInput.classList.add('off');

                perimeterSentinelInput.classList.add('on');
                perimeterSentinelInput.classList.remove('off');
            } else {
                this.values.defensePath = 'manual';

                perimeterManualInput.classList.add('on');
                perimeterManualInput.classList.remove('off');

                perimeterSentinelInput.classList.remove('on');
                perimeterSentinelInput.classList.add('off');
            }
        });

        perimeterSentinelInput.addEventListener('click', event => {
            if(perimeterSentinelInput.classList.contains('on')) {
                this.values.defensePath = 'manual';

                perimeterSentinelInput.classList.remove('on');
                perimeterSentinelInput.classList.add('off');

                perimeterManualInput.classList.add('on');
                perimeterManualInput.classList.remove('off');
            } else {
                this.values.defensePath = 'sentinel';

                perimeterSentinelInput.classList.add('on');
                perimeterSentinelInput.classList.remove('off');

                perimeterManualInput.classList.add('off');
                perimeterManualInput.classList.remove('on');
            }
        });

        crosshairNormalInput.addEventListener('click', event => {
            if(crosshairNormalInput.classList.contains('on')) {
                this.values.crosshair = 'minimal';

                crosshairNormalInput.classList.remove('on');
                crosshairNormalInput.classList.add('off');

                crosshairMinimalInput.classList.add('on');
                crosshairMinimalInput.classList.remove('off');

                if(drone.retical) drone.retical.visibility = 0;
            } else {
                this.values.crosshair = 'normal';

                crosshairMinimalInput.classList.remove('on');
                crosshairMinimalInput.classList.add('off');

                crosshairNormalInput.classList.add('on');
                crosshairNormalInput.classList.remove('off');

                if(drone.retical) drone.retical.visibility = 1;
            }
        });
        crosshairMinimalInput.addEventListener('click', event => {
            if(crosshairMinimalInput.classList.contains('on')) {
                this.values.crosshair = 'normal';

                crosshairMinimalInput.classList.remove('on');
                crosshairMinimalInput.classList.add('off');

                crosshairNormalInput.classList.add('on');
                crosshairNormalInput.classList.remove('off');

                if(drone.retical) drone.retical.visibility = 1;
            } else {
                this.values.crosshair = 'minimal';

                crosshairMinimalInput.classList.add('on');
                crosshairMinimalInput.classList.remove('off');

                crosshairNormalInput.classList.remove('on');
                crosshairNormalInput.classList.add('off');

                if(drone.retical) drone.retical.visibility = 0;
            }
        });

        this.shButton.addEventListener('click', event => {
            if(this.base.style.display === 'flex') {
                this.base.style.display = 'none';
            } else {
                this.base.style.display = 'flex';
            }
        });
    }
    show() {
        this.base.style.display = 'none';
    }
    hide() {
        this.base.style.display = 'flex'
    }
}

class SettingsList {
    voltage: number = 10
    threatProfile: ThreatProfile = {
        fly: true,
        wasp: false,
        bee: false
    }
    detectionSensitivity: number = 5
    powerSaving: boolean = true
    defensePath: DefensePath = 'sentinel'
    crosshair: Crosshair = 'normal'
    manuever: Manuever = 'balanced'
}

type ThreatProfile = {
    fly: boolean,
    wasp: boolean,
    bee: boolean
}
type DefensePath = 'manual' | 'sentinel'
type Crosshair = 'normal' | 'minimal'
type Manuever = 'balanced' | 'reserved' | 'aggressive'

let settings = new Settings('.settings-overlay');