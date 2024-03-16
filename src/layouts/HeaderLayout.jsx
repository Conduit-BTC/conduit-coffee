const HeaderLayout = () => {
  return (
    <header className="bg-[var(--cart-secondary-bg-color)] p-2">
      {/* <h2>
        ⚡ Conduit Coffee {`->`}{" "}
        <span className="font-normal">for/the/people</span>
      </h2> */}
      <h3 className="p-4 pl-2">
        $ conduit_coffee {`->`}{" "}
        <span className="font-normal">coffee/for/the_people</span>
      </h3>
    </header>
  );
};

export default HeaderLayout;
