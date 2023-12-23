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

      const getVersion = async () => {
        const version = await window.electron.engine.version();
        useStore.setState({ version: version });
      };

      const _password_set = eGet('password_set');
      const color_mode = eGet("color_mode") === "light" ? "light" : "dark";
      const nextPage = _password_set ? "login" : "setup"; 

      getVersion();

      useStore.setState({
        color_mode: color_mode,
        page: nextPage
      });
    };
  }, [localDataCheck]);

  return null;
};

export { Precheck };
