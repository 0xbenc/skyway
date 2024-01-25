import { useState, useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import { eGet } from "../../utility/electronStore";
// ----------------------------------------------------------------------

const Precheck = () => {
  const [localDataCheck, setLocalDataCheck] = useState(false);

  useEffect(() => {
    if (!localDataCheck) {
      setLocalDataCheck(true);

      const begin = async (colorMode, nextPage) => {
        const version = await window.electron.engine.version();
        useStore.setState({
          version: version,
          color_mode: colorMode,
          page: nextPage,
        });
      };

      const colorMode = eGet("color_mode") === "light" ? "light" : "dark";
      const nextPage = eGet("password_set") ? "login" : "setup";

      begin(colorMode, nextPage);
    }
  }, [localDataCheck]);

  return null;
};

export { Precheck };
