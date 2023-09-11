import React, { useEffect } from "react";
//
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useStore } from './zustand';

const Notify = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notification_alarm = useStore(state => state.notification_alarm);
  const notification_message = useStore(state => state.notification_message);
  const color_mode = useStore(state => state.color_mode);

  useEffect(() => {
    if (notification_alarm) {
      enqueueSnackbar(notification_message, {
        style: {
          backgroundColor: color_mode === "light" ? "#CCCCCC" : "#333333",
          color: color_mode === "light" ? "#111111" : "#EEEEEE"
        }
      });

      useStore.setState({ notification_alarm: false, notification_message: "" });
    }
  }, [notification_message, notification_alarm, color_mode])

  return null;
};

const HandleNotifications = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      disableWindowBlurListener={true}
    >
      <Notify />
    </SnackbarProvider>
  );
};

export default HandleNotifications;