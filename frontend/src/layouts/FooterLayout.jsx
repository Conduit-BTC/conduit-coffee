const FooterLayout = () => {
  return (
    <div className="flex max-md:flex-col max-md:text-center mt-auto self-end p-2 pr-4 w-full max-md:gap-4">
      Conduit Hodlings - All Rights Restored
      <div className='md:ml-auto'>
      <a
        href="https://conduitbtc.com"
        className="text-blue-500 md:ml-auto mr-12"
        target="_blank"
      >
        Contact
      </a>
      <a
        href="https://conduitbtc.com/terms-of-service"
        className="text-blue-500 "
        target="_blank"
      >
        Terms of Service
      </a>
      </div>
    </div>
  );
};

export default FooterLayout;
