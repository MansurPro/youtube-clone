import { Box, Typography } from '@mui/material';

const messageFor = (error) => {
  // Our own proxy replies { error } and knows exactly what went wrong (e.g. a
  // missing key on the deploy), so prefer that over guessing from the status.
  const fromProxy = error?.response?.data?.error;
  if (typeof fromProxy === 'string') return fromProxy;

  switch (error?.response?.status) {
    case 401:
    case 403:
      return 'API key was rejected. Check RAPID_API_KEY on the deploy.';
    case 429:
      return 'API quota exceeded. Try again later.';
    default:
      return 'Could not reach the API. Check your connection and try again.';
  }
};

const ApiError = ({ error }) => (
  <Box p={2}>
    <Typography variant="h6" sx={{ color: '#FC1503' }}>
      {messageFor(error)}
    </Typography>
  </Box>
);

export default ApiError;
