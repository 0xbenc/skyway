import { useEffect } from "react";
import { switchColor } from "./utility/switchColor";

const HandleIPC = () => {
  useEffect(() => {
    window.ipc.on("toggle color", () => {
      switchColor();
    });
  }, []);

  return null
};

export default HandleIPC;