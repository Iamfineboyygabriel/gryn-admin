import gryn_index_logo from "../../assets/svg/Gryn_Index _logo.svg";

const LandingNav = () => {

  return (
    <nav className="flex w-full justify-between">
      <img
        src={gryn_index_logo}
        alt="gryn_index_logo"
        className="w-[11em] cursor-pointer"
      />
    </nav>
  );
};

export default LandingNav;
