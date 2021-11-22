import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputLabel,
} from "@material-ui/core";
import React from "react";

export default function LoginForm(props) {
  const { open, onClose, onLoginChange, onLogin } = props;

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Enter credentials</DialogTitle>
      <DialogContent>
        <InputLabel>Login</InputLabel>
        <Input id="login" onChange={onLoginChange} type="text" />
        <InputLabel>Password</InputLabel>
        <Input id="password" onChange={onLoginChange} type="password" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onLogin} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
