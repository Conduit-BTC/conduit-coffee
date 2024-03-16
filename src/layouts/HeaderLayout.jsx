const HeaderLayout = () => {
  return (
    <header className="bg-[var(--cart-secondary-bg-color)] p-2">
      <h3 className="my-4 text-left lg:text-center text-[var(--main-text-color)]">
        {`⚡️ `}Welcome to Conduit{` ⚡️`}
      </h3>
      {/* <h3 className="p-4 pl-2 text-md lg:text-xl">
        $ conduit_coffee {`->`}{" "}
        <span className="font-normal">coffee/for/the_people</span>
      </h3> */}
    </header>
  );
};

export default HeaderLayout;
