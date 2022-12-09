import { useState, useEffect } from "react";
import axios from "axios";
import "./css/home.css";
import DndCharacter from "./components/DndCharacter";
import Character from "./components/Character";

const Home = () => {
  const [error, setError] = useState("");
  const [character, setCharacter] = useState(new DndCharacter());

  const newRandomCharacter = async (e) => {
    const characterQuery = await axios.get("/dnd/api/random");
    setCharacter(characterQuery[0]); //Check that this is necessary
    e.preventDefault();
  };

  useEffect(() => {}, []);

  return (
    <div className="home">
      <div className="Welcome">Welcome to The DnD Character Generator!!</div>
      <div className="description">
        Generate characters for any of your many campaigns
      </div>
      <br />
      <div className="flex">
        <h2>Random Characters: </h2>
        <button className="random_duck_button" onClick={newRandomCharacter}>
          New Character
        </button>
      </div>
      {character != null ? (
        <Character className="randomCharacter" character={character} />
      ) : (
        <div>What are you waiting for??? Make a new character!!</div>
      )}
    </div>
  );
};

export default Home;
