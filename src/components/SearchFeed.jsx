import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useApi } from '../utils/useApi';
import { Videos } from './';

const SearchFeed = () => {
  const { searchTerm } = useParams();
  const { data: videos, error } = useApi(`search?part=snippet&q=${searchTerm}`);

  return (
    <Box p={2} sx={{ overflowY: 'auto', height: '90vh', flex: 2 }}>
      <Typography 
        variant='h4' 
        fontWeight="bold" 
        mb={2}
        sx={{ color: 'white' }}
      >
        Search Results for: <span style={{
          color: '#F31503',
        }}>{ searchTerm }</span> videos
      </Typography>

      <Videos videos={videos} error={error} />
    </Box>
  )
}

export default SearchFeed;