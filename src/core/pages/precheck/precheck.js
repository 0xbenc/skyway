import { useState, useEffect } from "react";
//
import { useStore } from "../../zustand";
//
import { eGet } from "../../utility/electronStore";
// ----------------------------------------------------------------------

const Precheck = () => {
  const [localDataCheck, setLocalDataCheck] = useState(false);

  const getVersion = async () => {
    const version = await window.electron.engine.version();
    useStore.setState({ version: version })
  }

  useEffect(() => {
    if (!localDataCheck) {
      const _password_set = eGet('password_set');
      getVersion();

      if (_password_set) {
        console.log("PRECHECK: local data found, beginning login ")

        const _color_mode = eGet("color_mode");

        useStore.setState({
          color_mode: _color_mode === "light" ? "light" : "dark",
          page: "login"
        });
      } else {
        console.log("PRECHECK: no local data found, beginning setup")

        useStore.setState({ page: "setup" })
      };

      setLocalDataCheck(true)
    }
  }, [localDataCheck, getVersion])

  return null
};

export { Precheck };
