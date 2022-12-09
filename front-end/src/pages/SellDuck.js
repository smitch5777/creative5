import { useState, useEffect } from 'react';
import axios from 'axios';

const SellDuck = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setdescription] = useState("");
    const [location, setlocation] = useState("");
    const [imgNum, setImgNum] = useState("");

    const handleSubmit = async (e) => {
        const to_save = {
            name: name ? name : "Unknown",
            price: price ? price : "Unknown",
            description: description ? description : "Unknown",
            location: location ? location : "Unknown",
            img: imgNum ? "https://random-d.uk/api/" + imgNum + ".jpg" : "",
            is_bought: false,
            is_favorite: false,
        }
        console.log('Submitted form with following data: ' + JSON.stringify(to_save));
        alert('Submitting');
        await axios.post("/api/ducks", to_save);
        e.preventDefault();
    }

    const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (visited.has(value)) {
                    return;
                }
                visited.add(value);
            }
            return value;
        };
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label>
                Price:
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <br />
            <label>
                Description:
                <textarea value={description} onChange={(e) => setdescription(e.target.value)} />
            </label>
            <br />
            <label>
                Location:
                <input type="text" value={location} onChange={(e) => setlocation(e.target.value)} />
            </label>
            <br />
            <label>
                Duck Image # (This is from the random duck database):
                <input type="text" value={imgNum} onChange={(e) => setImgNum(e.target.value)} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}

export default SellDuck;