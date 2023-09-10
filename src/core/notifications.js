import React, { useEffect } from "react";
//
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useStore } from './zustand';

const Notify = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notification_alarm = useStore(state => state.notification_alarm);
  const notification_message = useStore(state => state.notification_message);

  useEffect(() => {
    if (notification_alarm) {
      enqueueSnackbar(notification_message);
      useStore.setState({ notification_alarm: false, notification_message: "" })
    }
  }, [notification_message, notification_alarm])

  return null;
};

const HandleNotifications = () => {
  return (
    <SnackbarProvider maxSnack={5}>
      <Notify />
    </SnackbarProvider>
  );
};

export default HandleNotifications;