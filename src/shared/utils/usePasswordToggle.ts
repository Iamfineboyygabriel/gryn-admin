import { useState } from "react";

type PasswordType = "password" | "text";

const usePasswordToggle = (): [PasswordType, () => void] => {
  const [type, setType] = useState<PasswordType>("password");

  const toggle = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  return [type, toggle];
};

export default usePasswordToggle;
