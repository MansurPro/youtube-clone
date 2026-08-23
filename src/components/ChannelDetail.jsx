import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { Videos, ChannelCard } from './';
import { useApi } from '../utils/useApi';

const ChannelDetail = () => {
  const { id } = useParams();

  const { data: channelDetail } = useApi(`channels?part=snippet&id=${id}`, (d) => d?.items?.[0]);
  const { data: videos, error } = useApi(`search?channelId=${id}&part=snippet&order=date`);

  return (
    <Box minHeight="95vh">
      <Box>
        <div style={{
          height:'300px',
          background: 'linear-gradient(90deg, rgba(0,238,247,1) 0%, rgba(206,3,184,1) 100%, rgba(0,212,255,1) 100%)',
          zIndex: 10,
        }} />
        <ChannelCard channelDetail={channelDetail} marginTop="-110px" />
      </Box>
      <Box display="flex" p="2">
        <Box sx={{ mr: { sm: '100px' } }} />
        <Videos videos={videos} error={error}/>
      </Box>
    </Box>
  )
}

export default ChannelDetail;