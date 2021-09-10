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
    imageSrc: "img/c4s1.png",
    dialogues: [
        `"Tom?..."`,
        `"Why did you do that?"`,
        `   "Did what?"`,
        `"Look... look at your paw."`,
        `   "What's with my paw?"`,
    ],
}, {
    imageSrc: "img/c4s2.png",
    dialogues: [
        `   "Oh."`,
        `   "I smashed it. Whoops."`,
        `   "Is this... Is this illegal, junes?"`,
        `"I don't know, chief. Probably."`,
        `   "It's just a tomato after all... Right?"`,
        `   "It can't be a big deal. Even if it's officially a suspect."`,
        `"But didn't you tell... Didn't you tell it's always tomatoes?"`,
        `   "Yeah I did but... in the hindsight maybe I exaggerated a bit?"`,
        `   "What do you think, junior?"`,
        `"I'll go speak with the team. You stay here here, Tom. We'll probably sort it out."`,
    ],
}];

export const FINAL_FINAL_CUTSCENE: SceneDefinition[] = [{
    imageSrc: "img/c4s3.png",
    dialogues: [
        `NEWSFLAH: Interrogator kills a tomato incident suspect! Investigation suggests personal motives.`,
        `Chief detective Tom Catchup tried for first degree murder of a vegetable.`,
        `Five orphan tomatoes end up in orphanage! Orphanage reports a delicious soup.`,
        `Scholars try to figure out if tomatoes are sentient! A $1,000,000,000 grant is issued to research groups.`,
    ],
}, {
    imageSrc: "img/c4s4.png",
    dialogues: [
        `This was the story of the downfall of the detective Tom Catchup.`,
        `He's now serving a life sentence for smashing a tomato.`,
        `I hope you learned something important from this story.`,
        `                     THE END`,
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
    musicSrc: "music/level1.mp3",
    bossMusicSrc: "music/boss.mp3",
    shooterBackgroundSrc: "img/level1.png",
    levelConfig: {
        cameraHeight: 20,
        cameraCenter: 200,
        closeness: 10,
        ceilHeight: 90,
        totalHeight: 300,
        ambientBrightness: 0.3,
    },
    introCutscene: [{
        imageSrc: "img/c1s1.png",
        dialogues: [
            "Catropolis, year 202X.",
            "A series of massive cat police raids is rampaging all across the city.",
            "The police forces are after the elusive leader of the eco terrorist group known as \"The Stalk\".",
            "This night they've finally caught someone. Someone who might be him.",
        ],
    }, {
        imageSrc: "img/c1s2.png",
        dialogues: [
            `"You seen the report, Tom?" asks junior inspector Whiskers.`,
            `"The SWAT guys brought us a tomato! Are they for real or what?"`,
        ],
    }, {
        imageSrc: "img/c1s3.png",
        dialogues: [
            `"Are you actually suprised?" says chief detective Tom Catchup. "It's always tomatoes, junior."`,
            `"Huh? What do you mean?" asks Whiskers.`,
        ],
    }, {
        imageSrc: "img/c1s4.png",
        dialogues: [
            `"Me and them tomatoes go way back, junior. Nasty little things. You would understand if you could."`,
            `"I can tell you all about it if you want."`,
            `Whiskers fidgets a bit. "Well, actually I..."`,
            `"It all started years ago...," says Tom. "Back when I was still in college."`,
        ],
    }, {
        imageSrc: "img/c1s5.png",
        dialogues: [
            `"We had a really cool party and I was obviously invited. I was a real party beast, after all."`,
            `"...at least I thought I was, it was my first party ever. But you got the picture."`,
            `"Unfortunately I previously half-seriously exaggerated to my friends that I was dating this very sweet kitty..."`,
            `"She was planning to come, too. I didn't really know about that until I arrived."`,
            `"I decided to roll with it."`,
            `"Of course I felt a bit nervous... just a bit..."`,
            `" J u s t   a   l i t t l e   b i t "`,
        ],
    }],
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
    introCutscene: [{
        imageSrc: "img/c2s1.png",
        dialogues: [
            `"Meow everyone! Sorry I'm so late."`,
            `"Hey, Tom, isn't that your girlfriend?"`,
            `"Tom? Who's Tom?"`,
            `When his supposed girfriend finally came to the party, Tom realized there was no point in lying anymore.`,
            `Instead, he decided to escape.`,
        ]
    }, {
        imageSrc: "img/c2s2.png",
        dialogues: [
            `But an inconveniently placed tomato quickly stopped him in his ways!`,
        ]
    }, {
        imageSrc: "img/c2s3.png",
        dialogues: [
            `SMAAASHH!`,
            `Everybody looked at Tom as tomato flesh splattered all around.`,
            `It was truly a moment of inconceivable shame and horror.`,
        ]
    }, {
        imageSrc: "img/c2s4.png",
        dialogues: [
            `"Now, now, Tom, don't you cry. It's been so long ago."`,
            `"I'm not crying! It's the wind!" shrieks chief detective Tom Catchup.`,
            `"We're inside the building, Tom..."`,
            `"You don't understand, junior! It wasn't the only time..."`,
            `Tom exhaled deeply. "There was another... encounter."`,
            `"I was trying to get a job. At a rather luxurious place. And they... they got me even there."`,
        ]
    }],
    musicSrc: "music/level2.mp3",
    bossMusicSrc: "music/boss.mp3",
    shooterBackgroundSrc: "img/level2.png",
    levelConfig: {
        cameraHeight: -20,
        cameraCenter: 100,
        closeness: 4,
        ceilHeight: 95,
        totalHeight: 300,
        ambientBrightness: 0.5,
    },
    enemyScript: [
        ":wait_5200",
        ...repeat([
            "---c-",
            ":wait_950",
            "-c---",
            ":wait_950",
        ], 5),
        ...repeat([
            ":wait_800",
            "-b-----",
            ":wait_800",
            "-----b-",
        ], 5),
        ":wait_2000",
        ":question_What's your most valuable skill?_I shoot!_I lick my nose!",
        ":wait_2000",
        "-d-",
        ":wait_4000",
        "-d---d-",
        ":wait_2000",
        ...repeat([
            "aaa---aaa",
            ":wait_800",
            "-a-",
            ":wait_800",
        ], 2),
        "-d-",
        ...repeat([
            "aaaaaaa",
            ":wait_800",
            "---a---",
            ":wait_800",
        ], 2),
        ":wait_1000",
        ...repeat([
            "a-b",
            ":wait_1500",
            "b-a",
            ":wait_1500",
        ], 4),
        ":wait_2000",
        ":question_How would you treat a rude customer?_Kiss them!_Kill them!",
        ":wait_1000",
        ...repeat([
            "-----aa",
        ], 24),
        ":wait_1000",
        ...repeat([
            "aa-----",
        ], 24),
        ":wait_1000",
        "d---",
        ...repeat([
            "-----aa",
        ], 24),
        ":wait_1000",
        "---d",
        ...repeat([
            "aa-----",
        ], 24),
        ...repeat([
            ":wait_1000",
            "b---",
            ...repeat([
                "-----aa",
            ], 6),
            ":wait_1000",
            "---b",
            ...repeat([
                "aa-----",
            ], 6),
        ], 2),
        ":wait_1000",
        ":question_What's your least favorite vegetable?_TOMATOES!_TOMATOES!",
        ":wait_1000",
        ":boss_valac",
    ],
}, {
    introCutscene: [{
        imageSrc: "img/c3s1.png",
        dialogues: [
            `"You look like a fine upstanding young cat. I think you'll do."`,
            `"Please sign the contract without demonstrating any kind of clumsiness to secure your position."`,
        ]
    }, {
        imageSrc: "img/c3s2.png",
        dialogues: [
            `Finally! A moment of sweet success for young unemployed Tom Catchup.`,
            `All he has to do now is sign the contract without accidentally touching the inconveniently placed tomato...`,
        ]
    }, {
        imageSrc: "img/c3s3.png",
        dialogues: [
            `Oh no!!`,
        ]
    }, {
        imageSrc: "img/c3s4.png",
        dialogues: [
            `"This is unacceptable!" the angry interviewer says.`,
            `"We can't afford hiring a clumsy loser like you."`,
            `"In fact, I'm so offended I will make sure you won't be able to find ANY job in this town except maybe in police department."`,
        ]
    }, {
        imageSrc: "img/c3s5.png",
        dialogues: [
            `20 years later...`,
            `"So, how do you even interrogate a tomato?" junior inspector Whiskers asks.`,
            `"They don't even have mouths... or do they? Is this a mouth?"`,
            `"They don't need a mouth to communicate, junior," tomato crime expert chief detective Tom Catchup explains.`,
            `"Just imagine you're a ghost cat, flying around and gunning down hordes of invisible spaceships..."`,
            `Whiskers looks at Tom Catchup in disbilef.`,
            `"What?.."`,
        ]
    }],
    musicSrc: "music/level3.mp3",
    bossMusicSrc: "music/finalboss.mp3",
    shooterBackgroundSrc: "img/bathroom.png",
    levelConfig: {
        cameraHeight: 0,
        cameraCenter: 400,
        closeness: 36,
        ceilHeight: 120,
        totalHeight: 330,
        ambientBrightness: 0.0,
    },
    enemyScript: ([
        ":wait_2500",
        "-b-",
        ":wait_2500",
        "bb",
        ":wait_2500",
        "bbb",
        ":wait_2500",
        "bbbb",
        ":wait_2500",
        "bbbbb",
        ":wait_2500",
        ":question_..._It's always you..._It's always me...",
        ...repeat([
            "cc-----cc",
            ":wait_1200",
        ], 8),
        ":wait_1200",
        ...repeat([
            "bb--",
            ":wait_1200",
            "--bb",
            ":wait_1200",
        ], 3),
        ":wait_1200",
        "dddddddd",
        ":wait_12000",
        "aaaaaaaa",
        ":wait_2000",
        "aaaaaaaa",
        ":wait_2000",
        "aaaaaaaa",
        ":wait_1000",
        "aaaaaaaa",
        ":wait_500",
        "aaaaaaaa",
        ":wait_250",
        "aaaaaaaa",
        ":wait_1000",
        ":question_..._I hate myself..._I HATE YOU!",
        ...repeat([
            "a--------",
            "-a-------",
            "--a------",
            "---a-----",
            "----a----",
            "-----a---",
            "------a--",
            "-------a-",
            "--------a",
            "--------b",
        ], 4),
        "-d-",
        ...repeat([
            "b--",
            ":wait_1000",
            "--b",
            ":wait_1000",
        ], 3),
        "--dd--",
        ...repeat([
            "b--",
            ":wait_1000",
            "--b",
            ":wait_1000",
        ], 3),
        ":wait_1000",
        "aaaa---a",
        "aaa---aa",
        "aa---aaa",
        "a---aaaa",
        "---aaaaa",
        "---aaaaa",
        "---aaaaa",
        "---aaaaa",
        ":wait_2000",
        "---aaaaa",
        "---aaaaa",
        "---aaaaa",
        "---aaaaa",
        "----aaaa",
        "-----aaa",
        "a-----aa",
        "aa-----a",
        "aaa-----",
        "aaaa----",
        "aaaa----",
        "aaaa----",
        "aaaa----",
        "aaaa----",
        "aaaaaaaa",
        ":wait_2000",
        ":question_..._I want to die..._DIE!!!",
        "-b-",
        ":wait_4000",
        "-b-",
        "-bb-",
        ":wait_4000",
        "-b-",
        "-bb-",
        "-b-b-",
        ":wait_4000",
        "-b-",
        "-bb-",
        "-b-b-",
        "-b--b-",
        ":wait_4000",
        "-b-",
        "-bb-",
        "-b-b-",
        "-b--b-",
        "-b---b-",
        ":wait_4000",
        "bbbbbbbbbbbbbbbbbbbb",
        ...repeat([
            ":wait_2000",
            "bbbbbbbbbbbbbbbbbbbb",
        ], 8),
        ":wait_2000",
        "aaaaaaaaaaaaaaaaaaaa",
        ":wait_3000",
        "cccccccccccccccccccc",
        ":wait_8000",
        "aa---aaaaaa-----aaaa",
        "aa---aaaaaa-----aaaa",
        "aa---aaaaaa------aaa",
        "aa---aaaaaa-------aa",
        "aa---aaaaa---------a",
        "aa---aaaa-----------",
        ":wait_8000",
        "-a-",
        ":wait_8000",
        ":boss_haborym"
    ]),
}];