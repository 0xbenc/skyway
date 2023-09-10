import React, { useEffect } from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useStore } from './zustand';

function MyApp() {
  const { enqueueSnackbar } = useSnackbar();

  const alarm = useStore(state => state.alarm);
  const message = useStore(state => state.message);

  useEffect(() => {
    if (alarm) {
      enqueueSnackbar(message);
      useStore.setState({ alarm: false, message: "" })
    }
  }, [message, alarm])

  return null;
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={5}>
      <MyApp />
    </SnackbarProvider>
  );
}