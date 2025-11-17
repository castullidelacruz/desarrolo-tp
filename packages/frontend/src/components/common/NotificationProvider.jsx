import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "info",
    duration: 4000,
  });

  const notify = useCallback((message, options = {}) => {
    const { severity = "info", duration = 4000 } = options;
    setState({ open: true, message, severity, duration });
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setState((s) => ({ ...s, open: false }));
  };

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
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
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotify debe usarse dentro de NotificationProvider");
  return ctx.notify;
};

export default NotificationProvider;
