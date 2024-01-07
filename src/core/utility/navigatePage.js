import { useStore } from "../zustand";
// ----------------------------------------------------------------------

const navigate = (page) => {
  console.log("NAVIGATION:", page);
  useStore.setState({ page: page });
};

export { navigate };
