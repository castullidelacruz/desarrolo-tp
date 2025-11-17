import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const subscribers = new Set();

export const notify = (message, options = {}) => {
  const { severity = "info", duration = 4000 } = options;
  subscribers.forEach((fn) => fn({ message, severity, duration }));
};

const NotificationCenter = () => {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "info",
    duration: 4000,
  });

  useEffect(() => {
    const handler = ({ message, severity, duration }) => {
      setState({ open: true, message, severity, duration });
    };
    subscribers.add(handler);
    return () => subscribers.delete(handler);
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setState((s) => ({ ...s, open: false }));
  };

  return (
    <Snackbar
      open={state.open}
      autoHideDuration={state.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={state.severity} variant="filled" sx={{ width: "100%" }}>
        {state.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationCenter;
