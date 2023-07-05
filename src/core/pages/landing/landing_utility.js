import { useStore } from "../../zustand";

const switchColor = () => {
  const color_mode_ = useStore.getState().color_mode;
  if (color_mode_ === "dark") {
    console.log("THEME: light mode selected")
    useStore.setState({ color_mode: "light" })
    window.electron.store.set('color_mode', 'light')
  } else {
    console.log("THEME: dark mode selected")
    useStore.setState({ color_mode: "dark" })
    window.electron.store.set('color_mode', 'dark')
  };
};

export {switchColor};