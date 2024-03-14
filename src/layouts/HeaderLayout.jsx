const HeaderLayout = () => {
  return (
    <header>
      <h2>
        $ conduit_coffee {`->`}{" "}
        <span className="font-normal">for/the/people</span>
      </h2>
      <button className="nav-item">{`>> Light Roast`}</button>
      <button className="nav-item">{`>> Dark Roast`}</button>
      <button className="nav-item">{`>> Decaf`}</button>
    </header>
  );
};

export default HeaderLayout;
