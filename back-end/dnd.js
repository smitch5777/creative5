const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const mongoose = require("mongoose");
const e = require("express");

// connect to the database
mongoose.connect("mongodb://localhost:27017/test", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const characterSchema = new mongoose.Schema({
  stats: {
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
  },
  race: String,
  class: String,
  name: String,
  level: Number,
  proficiencies: {
    acrobatics: Boolean,
    animal_handling: Boolean,
    arcana: Boolean,
    athletics: Boolean,
    deception: Boolean,
    history: Boolean,
    insight: Boolean,
    intimidation: Boolean,
    investigation: Boolean,
    medicine: Boolean,
    nature: Boolean,
    perception: Boolean,
    performance: Boolean,
    persuasion: Boolean,
    religion: Boolean,
  },
  saving_throws: {
    strength: Boolean,
    dexterity: Boolean,
    constitution: Boolean,
    intelligence: Boolean,
    wisdom: Boolean,
    charisma: Boolean,
  },
  // weapons: [
  //   {
  //     name: String,
  //     type: String,
  //     range: String,
  //     damage: String,
  //     notes: String,
  //   },
  // ],
  // armor: {
  //   type: String,
  //   base_ac: Number,
  // },
});

characterSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
characterSchema.set("toJSON", {
  virtuals: true,
});

const Character = mongoose.model("character", characterSchema);

app.get("/api/random", async (req, res) => {
  try {
    const car = makeRandomCharacterStats();
    const finalCharacter = makeFullCharacter(car);
    res.send(finalCharacter);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/dnd/api/characters", async (req, res) => {
  const character = makeNewCharacter(req.body);
  try {
    await Character.save();
    console.log("character" + character);
    res.send(character);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/dnd/api/characters", async (req, res) => {
  try {
    let characters = await Character.find();
    console.log("duck" + characters);
    res.send(characters);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const possibleClasses = [
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
];
function getRandomClass() {
  const numClasses = possibleClasses.length;
  const i = parseInt(Math.random * numClasses, 10);
  return possibleClasses[i];
}

const classAbilityPriorities = new Map();
classAbilityPriorities.set("barbarian", ["strength", "constitution"]);
classAbilityPriorities.set("bard", ["charisma", "dexterity"]);
classAbilityPriorities.set("cleric", ["wisdom", "strength", "constitution"]);
classAbilityPriorities.set("druid", ["wisdom", "constitution"]);
classAbilityPriorities.set("fighter", ["strength", "constitution"]);
classAbilityPriorities.set("monk", ["dexterity", "wisdom"]);
classAbilityPriorities.set("paladin", ["strength", "charisma"]);
classAbilityPriorities.set("ranger", ["dexterity", "wisdom"]);
classAbilityPriorities.set("rogue", ["dexterity", "charisma"]);
classAbilityPriorities.set("sorcerer", ["charisma", "constitution"]);
classAbilityPriorities.set("warlock", ["charisma", "constitution"]);
classAbilityPriorities.set("wizard", [
  "intelligence",
  "constitution",
  "dexterity",
]);

function getAbilityPriorities(charClass) {
  if (classAbilityPriorities.has(charClass)) {
    return classAbilityPriorities.get(charClass);
  } else {
    return ["dexterity", "constitution"];
  }
}

const classHitDie = new Map();
classHitDie.set("barbarian", 12);
classHitDie.set("bard", 8);
classHitDie.set("cleric", 8);
classHitDie.set("druid", 8);
classHitDie.set("fighter", 10);
classHitDie.set("monk", 8);
classHitDie.set("paladin", 10);
classHitDie.set("ranger", 10);
classHitDie.set("rogue", 8);
classHitDie.set("sorcerer", 6);
classHitDie.set("warlock", 8);
classHitDie.set("wizard", 6);

const possibleRaces = [
  "dragonborn",
  "dwarf",
  "elf",
  "gnome",
  "half_elf",
  "halfling",
  "half_orc",
  "human",
  "tiefling",
];

function getRandomRace() {
  const numRaces = possibleRaces.length;
  const i = parseInt(Math.random * numRaces, 10);
  return possibleRaces[i];
}

const abilityScoreMap = new Map();
abilityScoreMap.set("strength", 0);
abilityScoreMap.set("dexterity", 0);
abilityScoreMap.set("constitution", 0);
abilityScoreMap.set("intelligence", 0);
abilityScoreMap.set("wisdom", 0);
abilityScoreMap.set("charisma", 0);

const abilityScores = [];
abilityScores.push("strength");
abilityScores.push("dexterity");
abilityScores.push("constitution");
abilityScores.push("intelligence");
abilityScores.push("wisdom");
abilityScores.push("charisma");

function randomStat() {
  const rolls = [];
  const lowestRoll = 7;
  for (let i = 0; i < 4; i++) {
    const roll = parseInt(Math.random * 6, 10);
    if (roll < lowestRoll) {
      lowestRoll = roll;
    }
    rolls.push(roll);
  }
  rolls.splice(rolls.indexOf(lowestRoll), 1);

  return rolls.reduce((partialSum, a) => partialSum + a, 0);
}

const randomNames = [
  "Emtharm Forgehide",
  "Rydar",
  "Ionyofyth",
  "Krura",
  "Bheliggs Jadefury",
  "Ralrus Benvolio",
  "Cadfold",
  "Vraduzan the Grim",
  "Edeline Forestmight",
  "Loldi",
  "Steeple",
  "Charilaena Naerth",
  "Allini",
  "Sharakir Romazi",
  "Vinos Trill",
  "Emmaj",
  "Methos Mikal",
  "Samy Stug",
  "Marcelina Sohreh Rahom",
  "Eilralei",
  "Starginn",
  "Dhorvos Guhlolath",
  "Prard",
  "Ganthirogani Swiftfist",
];

function getRandomName() {
  const numNames = possibleRaces.length;
  const i = parseInt(Math.random * numNames, 10);
  return randomNames[i];
}

const proficiencies = [
  "acrobatics",
  "animal_handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
];

function getRandomProficiencies() {
  const numProf = possibleRaces.length;
  const i = parseInt(Math.random * numProf, 10);
  return randomNames[i];
}

function makeRandomCharacterStats() {
  const character = {};

  const charClass = getRandomClass();
  character.class = charClass;

  const charRace = getRandomRace();
  character.race = charRace;

  character.stats = {};
  const stats = [];
  for (let i = 0; i < 6; i++) {
    stats.push(randomStat());
  }
  stats.sort();

  const abilityPriorities = getAbilityPriorities(charClass);
  const abilitiesMade = [];
  for (let i = 0; i < stats.length; i++) {
    let ability = "";
    if (abilityPriorities.length < i) {
      ability = abilityPriorities[i];
    } else {
      do {
        ability = abilityScores[parseInt(Math.random * 6, 10)];
      } while (abilitiesMade.indexOf(ability) != -1);
    }
    abilitiesMade.push(ability);
    character.stats[ability] = stats[i];
  }

  character.name = getRandomName();

  character.level = 1;

  const proficiencies = [];
  for (let i = 0; i < 4; i++) {
    const prof = getRandomProficiencies();
    if (proficiencies.indexOf(prof) == -1) {
      proficiencies.push(prof);
    } else {
      i--;
    }
  }

  for (let i = 0; i < proficiencies.length; i++) {
    character.proficiencies[proficiencies[i]] = true;
  }

  return character;
}

function makeFullCharacter(characterStats) {
  return characterStats;
}

function makeNewCharacter(characterData) {
  const char = {
    stats: {
      strength: characterData.stats.strength ? characterData.stats.strength : 10,
      dexterity: characterData.stats.dexterity ? characterData.stats.dexterity : 10,
      constitution: characterData.stats.constitution ? characterData.stats.constitution : 10,
      intelligence: characterData.stats.intelligence ? characterData.stats.intelligence : 10,
      wisdom: characterData.stats.wisdom ? characterData.stats.wisdom : 10,
      charisma: characterData.stats.charisma ? characterData.stats.charisma : 10,
    },
    race: characterData.race ? characterData.race : "human",
    class: characterData.class ? characterData.class : "fighter",
    name: characterData.name ? characterData.name : "Joe",
    level: characterData.level ? characterData.level : 1,
    proficiencies: {
      acrobatics: characterData?.proficiencies?.acrobatics ? characterData?.proficiencies?.acrobatics : false,
      animal_handling: characterData?.proficiencies?.animal_handling ? characterData?.proficiencies?.animal_handling : false,
      arcana: characterData?.proficiencies?.arcana ? characterData?.proficiencies?.arcana : false,
      athletics: characterData?.proficiencies?.athletics ? characterData?.proficiencies?.athletics : false,
      deception: characterData?.proficiencies?.deception ? characterData?.proficiencies?.deception : false,
      history: characterData?.proficiencies?.history ? characterData?.proficiencies?.history : false,
      insight: characterData?.proficiencies?.insight ? characterData?.proficiencies?.insight : false,
      intimidation: characterData?.proficiencies?.intimidation ? characterData?.proficiencies?.intimidation : false,
      investigation: characterData?.proficiencies?.investigation ? characterData?.proficiencies?.investigation : false,
      medicine: characterData?.proficiencies?.medicine ? characterData?.proficiencies?.medicine : false,
      nature: characterData?.proficiencies?.nature ? characterData?.proficiencies?.nature : false,
      perception: characterData?.proficiencies?.perception ? characterData?.proficiencies?.perception : false,
      performance: characterData?.proficiencies?.performance ? characterData?.proficiencies?.performance : false,
      persuasion: characterData?.proficiencies?.persuasion ? characterData?.proficiencies?.persuasion : false,
      religion: characterData?.proficiencies?.religion ? characterData?.proficiencies?.religion : false,
    },
    saving_throws: {
      strength: characterData?.saving_throws?.strength ? characterData?.saving_throws?.strength : false,
      dexterity: characterData?.saving_throws?.dexterity ? characterData?.saving_throws?.dexterity : false,
      constitution: characterData?.saving_throws?.constitution ? characterData?.saving_throws?.constitution : false,
      intelligence: characterData?.saving_throws?.intelligence ? characterData?.saving_throws?.intelligence : false,
      wisdom: characterData?.saving_throws?.wisdom ? characterData?.saving_throws?.wisdom : false,
      charisma: characterData?.saving_throws?.charisma ? characterData?.saving_throws?.charisma : false,
    },
  }
  return char;
}

// duckSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// duckSchema.set("toJSON", {
//   virtuals: true,
// });

// const Duck = mongoose.model("duck", duckSchema);

// app.get("/api/favorites", async (req, res) => {
//   try {
//     let favorites = await Duck.find({
//       is_favorite: true,
//     });
//     console.log("duck" + favorites);
//     res.send(favorites);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// app.get("/api/ducks", async (req, res) => {
//   try {
//     let ducks = await Duck.find();
//     console.log("duck" + ducks);
//     res.send(ducks);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// app.get("/api/ducks/:id", async (req, res) => {
//   try {
//     let duck = await Duck.find({
//       _id: req.params.id,
//     });
//     console.log("duck" + duck);
//     res.send(duck[0]);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// app.post("/api/ducks", async (req, res) => {
//   const duck = new Duck({
//     name: req.body.name,
//     price: req.body.price,
//     img: req.body.img,
//     description: req.body.description,
//     location: req.body.location,
//     is_bought: req.body.is_bought ? true : false,
//     is_favorite: req.body.is_favorite ? true : false,
//   });
//   try {
//     await Duck.save();
//     console.log("duck" + duck);
//     res.send(duck);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// app.delete("/api/ducks/:id", async (req, res) => {
//   try {
//     await Duck.deleteOne({
//       _id: req.params.id,
//     });
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

app.listen(3000, () => console.log("Server listening on port 3000!"));
