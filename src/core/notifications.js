import React, { useEffect, useMemo } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useStore } from "./zustand";
import PropTypes from "prop-types";

const Notify = ({ notificationAlarm, notificationMessage, colorMode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const style = useMemo(
    () => ({
      backgroundColor: colorMode === "light" ? "#CCCCCC" : "#333333",
      color: colorMode === "light" ? "#111111" : "#EEEEEE",
    }),
    [colorMode],
  );

  useEffect(() => {
    if (notificationAlarm) {
      enqueueSnackbar(notificationMessage, { style });
      useStore.setState({
        notification_alarm: false,
        notification_message: "",
      });
    }
  }, [notificationMessage, notificationAlarm, style]);

  return null;
};

Notify.propTypes = {
  notificationAlarm: PropTypes.bool.isRequired,
  notificationMessage: PropTypes.string.isRequired,
  colorMode: PropTypes.string.isRequired,
};

const HandleNotifications = () => {
  const notification_alarm = useStore((state) => state.notification_alarm);
  const notification_message = useStore((state) => state.notification_message);
  const color_mode = useStore((state) => state.color_mode);

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      disableWindowBlurListener={true}
    >
      <Notify
        notificationAlarm={notification_alarm}
        notificationMessage={notification_message}
        colorMode={color_mode}
      />
    </SnackbarProvider>
  );
};

export { HandleNotifications };
