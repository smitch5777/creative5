function calculatePlus(value) {
  console.log("value " + value);

  let plusValue = Math.floor((value - 10) / 2);

  if (plusValue > 0) {
    plusValue = `+${plusValue}`;
  }

  return plusValue;
}

const Stat = ({ name, value }) => {
  console.log("name: " + name);
  console.log("value: " + value);
  return (
    <div className="stat">
      {name}: {calculatePlus(value)} Base: {value}
    </div>
  );
};

export default Stat;
