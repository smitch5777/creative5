import Stat from "./Stat";

const proficiencyToStatMap = new Map();
proficiencyToStatMap.set("acrobatics", "dexterity");
proficiencyToStatMap.set("animal_handling", "charisma");
proficiencyToStatMap.set("arcana", "intelligence");
proficiencyToStatMap.set("athletics", "strength");
proficiencyToStatMap.set("deception", "charisma");
proficiencyToStatMap.set("history", "intelligence");
proficiencyToStatMap.set("insight", "wisdom");
proficiencyToStatMap.set("intimidation", "charisma");
proficiencyToStatMap.set("investigation", "intelligence");
proficiencyToStatMap.set("medicine", "wisdom");
proficiencyToStatMap.set("nature", "intelligence");
proficiencyToStatMap.set("perception", "wisdom");
proficiencyToStatMap.set("performance", "charisma");
proficiencyToStatMap.set("persuasion", "wisdom");
proficiencyToStatMap.set("religion", "intelligence");
proficiencyToStatMap.set("sleight_of_hand", "dexterity");
proficiencyToStatMap.set("stealth", "dexterity");
proficiencyToStatMap.set("survival", "wisdom");

function calculatePlus(value) {
  console.log("value " + value);

  let plusValue = Math.trunc((value - 10) / 2);

  return plusValue;
}

function calculateBaseProficiency(character, proficiencyString) {
  const aplicable_ability = proficiencyToStatMap.get(proficiencyString);
  const aplicable_ability_plus = calculatePlus(
    character.stats[aplicable_ability]
  );
  return aplicable_ability_plus;
}

function calculateProficiency(character, proficiencyString) {
  if (character.proficiencies[proficiencyString]) {
    return parseInt(calculateBaseProficiency(character, proficiencyString)) + 2;
  } else {
    return calculateBaseProficiency(character, proficiencyString);
  }
}

const Character = ({ character, setError }) => {
  console.log("character sent:" + JSON.stringify(character));
  return (
    <div>
      <h2 className="characterName">{character.name}</h2>
      <div className="characterInfo">
        <p>race: {character.race}</p>
        <p>class: {character.class}</p>
        <p>level: {character.level}</p>
      </div>
      {/* <BoughtText is_bought={duck.is_bought} /> */}
      {/* <img src={duck.img_url}>{duck.name}</img> */}
      <div className="allStats">
        <Stat name="Strength" value={character?.stats?.strength} />
        <Stat name="Dexterity" value={character?.stats?.dexterity} />
        <Stat name="Constitution" value={character?.stats?.constitution} />
        <Stat name="Intelligence" value={character?.stats?.intelligence} />
        <Stat name="Wisdom" value={character?.stats?.wisdom} />
        <Stat name="Charisma" value={character?.stats?.charisma} />
      </div>

      <div className="proficiencies">
        <h3>Proficiencies:</h3>
        <p>acrobatics: {calculateProficiency(character, "acrobatics")}</p>
        <p>
          animal_handling: {calculateProficiency(character, "animal_handling")}
        </p>
        <p>arcana: {calculateProficiency(character, "arcana")}</p>
        <p>athletics: {calculateProficiency(character, "athletics")}</p>
        <p>deception: {calculateProficiency(character, "deception")}</p>
        <p>history: {calculateProficiency(character, "history")}</p>
        <p>insight: {calculateProficiency(character, "insight")}</p>
        <p>intimidation: {calculateProficiency(character, "intimidation")}</p>
        <p>investigation: {calculateProficiency(character, "investigation")}</p>
        <p>medicine: {calculateProficiency(character, "medicine")}</p>
        <p>nature: {calculateProficiency(character, "nature")}</p>
        <p>perception: {calculateProficiency(character, "perception")}</p>
        <p>performance: {calculateProficiency(character, "performance")}</p>
        <p>persuasion: {calculateProficiency(character, "persuasion")}</p>
        <p>religion: {calculateProficiency(character, "religion")}</p>
        <p>
          sleight_of_hand: {calculateProficiency(character, "sleight_of_hand")}
        </p>
        <p>stealth: {calculateProficiency(character, "stealth")}</p>
        <p>survival: {calculateProficiency(character, "survival")}</p>
      </div>
    </div>
  );
};

export default Character;
