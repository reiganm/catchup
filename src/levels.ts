import { LevelConfig } from "./stages/ShooterStage";
import { SceneDefinition } from "./stages/CutsceneStage";

function repeat<T>(items: T[], times: number): T[] {
    let result = [];
    for (let i = 0; i < times; i++) {
        result = result.concat(items);
    }
    return result
}

export const sampleEnemyScript = [
    "a-b-a",
    ":question_..._fine_not fine",
    ":wait_1000",
    "a-b-a",
    ":wait_1000",
    ":question_Est dva stula_vozmu piki tochenu_prosnus",
    ":wait_1000",
    ":boss_valac",
    "-c-c-c",
    ":wait_1000",
    "c-c-c-",
    "-a----",
    "-a----",
    "-a----",
    ":wait_500",
    "-b-b-",
    "-b--b-",
    "-b---b-",
    ":wait_500",
    "----a-",
    "----a-",
    "----a-",
    ":wait_500",
    "a----a",
    "-a--a-",
    "--aa--",
    "-a--a-",
    "a----a",
    ":wait_1000",
];

const TEST_CUTSCENE: SceneDefinition[] = [{
    imageSrc: "img/test-scene-1.png",
    dialogues: [
        "meow meow meow",
    ]
}];

export const FINAL_CUTSCENE: SceneDefinition[] = [{
    imageSrc: "img/test-scene-2.png",
    dialogues: [
        `In a moment of inexplicable rage, detective Tom Catchup suddenly pounces at the suspect tomato and smashes it!`,
        `"Oh no!" Tom exclaims as he sees the deadly injured vegetable. "This is probably very illegal."`,
        `"As a police officer, I'm not supposed to smash suspects with my mighty paw. I truly have turned into a Tomato Hating Monster."`,
    ],
}, {
    imageSrc: "img/test-scene-1.png",
    dialogues: [
        `NEWSFLASH: Interrogator kills a tomato incident suspect! Investigation suggests personal motives.`,
        `Five baby tomatoes end up in orphanage!`,
        `Protesters demand stricter mental check-ups for police officers!`,
    ],
}, {
    imageSrc: "img/test-scene-2.png",
    dialogues: [
        `Today former cat detective Tom Catchup serves a life sentence for the first degree murder.`,
        `"I don't regret anything! I hate tomatoes! Screw tomatoes!"`,
        `What a horrible person! Thanks to you, he's got what he deserved.`,
        `                    THE END`,
    ],
}];

export type LevelDefinition = {
    shooterBackgroundSrc: string
    levelConfig: LevelConfig
    introCutscene: SceneDefinition[]
    enemyScript: string[]
    musicSrc: string
    bossMusicSrc: string
};

export const LEVELS: LevelDefinition[] = [{
    introCutscene: TEST_CUTSCENE,
    musicSrc: "music/level1.mp3",
    bossMusicSrc: "music/boss.mp3",
    shooterBackgroundSrc: "img/test-scene-1.png",
    levelConfig: {
        cameraHeight: 20,
        cameraCenter: 200,
        closeness: 10,
        ceilHeight: 90,
        totalHeight: 300,
        ambientBrightness: 0.2,
    },
    enemyScript: ([
        ":wait_1800",
        ...repeat([
            "a-",
            ":wait_1065",
            "-a",
            ":wait_1065",
        ], 4),
        ...repeat([
            "-b-",
            ":wait_1065",
            "b-b",
            ":wait_1065",
        ], 3),
        ...repeat([
            "a--",
            ":wait_300",
            "-a-",
            ":wait_300",
            "--a",
            ":wait_300",
            "-a-",
            ":wait_300",
        ], 9),
        ":question_Meow, Tom, is your girlfriend coming?_ummm_Y-yeah! Any minute now...",
        ":wait_2000",
        ...repeat([
            "a--",
            ":wait_100",
            "-a-",
            ":wait_100",
            "--a",
            ":wait_100",
            "-a-",
            ":wait_100",
        ], 3),
        ...repeat([
            "-b-",
            ":wait_500",
            "b-b",
            ":wait_500",
        ], 2),
        ...repeat([
            "a--",
            "-a-",
            "--b",
            "-a-",
        ], 8),
        ":wait_2000",
        ...repeat([
            "b--",
            "-a-",
            "--a",
            "-a-",
        ], 8),
        ":wait_2000",
        "a",
        "aa",
        "aaa",
        "aaaa",
        "aaaaa",
        ":wait_3000",
        ":question_So, what's your girlfriend like?_UMMM_Beautiful!",
        ...repeat([
            "---a",
            "---a",
            "a---",
            "a---",
        ], 8),
        ...repeat([
            "---a",
            "---a",
            "-b-",
            "a---",
            "a---",
        ], 8),
        ":wait_2000",
        ...repeat([
            "-c-",
            ":wait_1000",
            "cc",
            ":wait_1000",
        ], 3),
        ...repeat([
            "a-",
            "a-",
            "a-",
            "a-",
            "-b-",
            "-a",
            "-a",
            "-a",
            "-a",
            "-c-",
        ], 5),
        ":wait_2300",
        ":question_Party's almost over, you sure she'll show up?_SHUT UP_ SHUT UP",
        ...repeat([
            "-c-",
            ":wait_400",
            "c-c",
            ":wait_400",
            "-c-",
            ":wait_400",
            "c-c",
            ":wait_400",
            "-c-",
            ":wait_400",
            "ccc",
            ":wait_400",
        ], 3),
        ":wait_500",
        "bbbbb",
        ":wait_4000",
        ":boss_amy",
    ])
}, {
    introCutscene: TEST_CUTSCENE,
    musicSrc: "music/level2.mp3",
    bossMusicSrc: "music/boss.mp3",
    shooterBackgroundSrc: "img/bathroom.png",
    levelConfig: {
        cameraHeight: 20,
        cameraCenter: 200,
        closeness: 10,
        ceilHeight: 90,
        totalHeight: 300,
        ambientBrightness: 0.2,
    },
    enemyScript: sampleEnemyScript
}].slice(1);