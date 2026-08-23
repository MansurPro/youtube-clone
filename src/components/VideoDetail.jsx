import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Typography, Box, Stack } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

import { Videos, Loader, ApiError } from './';
import { useApi } from '../utils/useApi';

const VideoDetail = () => {
  const { id } = useParams();

  const { data: videoDetail, error: detailError } = useApi(`videos?part=snippet,statistics&id=${id}`, (d) => d?.items?.[0]);
  const { data: videos, error: videosError } = useApi(`search?part=snippet&relatedToVideoId=${id}&type=video`);

  if(detailError) return <ApiError error={detailError} />;
  if(!videoDetail?.snippet) return <Loader />;
  // statistics is absent on some videos, so don't destructure straight into it
  const { snippet: { title, channelId, channelTitle }, statistics = {} } = videoDetail;
  const { viewCount, likeCount } = statistics;

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <Box flex={1}>
          <Box sx={{ width: '100%', position: 'sticky', top: '86px' }}>
            <ReactPlayer 
              src={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
            />
            <Typography color="#fff" variant='h5' fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack 
              direction="row" 
              justifyContent="space-between"
              sx={{ color: '#fff'}}
              py={2} px={2}
            >
              <Link to={`/channel/${channelId}`} >
                <Typography variant="h6" color="#fff">
                  {channelTitle}
                  <CheckCircle sx={{ fontSize: '12px', color: 'gray', ml: '5px' }} />
                </Typography>
              </Link>
              <Stack direction='row' gap="20px">
                {viewCount && (
                  <Typography variant='body1' sx={{ opacity: 0.7 }}>
                    {parseInt(viewCount).toLocaleString()} views
                  </Typography>
                )}
                {likeCount && (
                  <Typography variant='body1' sx={{ opacity: 0.7 }}>
                    {parseInt(likeCount).toLocaleString()} likes
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
        <Videos videos={videos} error={videosError} direction="column" />
        </Box>

      </Stack>
    </Box>
  )
}

export default VideoDetail;