const BodyLayout = () => {
  return (
    <section className="m-4">
      <h3 className="mb-4">{`->`}Choose your roast: </h3>
      <div className="flex">
        <h1>1: </h1>
        <button className="nav-item">{`>> Light_Roast`}</button>
      </div>
      <div className="flex">
        <h1>2: </h1>
        <button className="nav-item">{`>> Dark_Roast`}</button>
      </div>
      <div className="flex">
        <h1>3: </h1>
        <button className="nav-item">{`>> Decaf`}</button>
      </div>
    </section>
  );
};

export default BodyLayout;
