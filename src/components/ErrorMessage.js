import { Alert, Button } from '@mui/material';

/** User-friendly API error with an optional retry action. */
export function ErrorMessage({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      variant="outlined"
      sx={{ borderRadius: 3, alignItems: 'center' }}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}
