import { Stack, Box } from "@mui/material";
import { VideoCard, ChannelCard, Loader, ApiError } from "./";

const Videos = ({ videos, direction, error }) => {
  if(error) return <ApiError error={error} />;
  if(!videos?.length) return <Loader />;
  return (
    <Stack 
      direction={direction || "row"} 
      flexWrap="wrap" 
      justifyContent="start"
      gap={2}
    >
      {videos.map((item, idx) =>(
        <Box key={idx}>
          {item.id.videoId && <VideoCard video={item} />}
          {item.id.channelId && <ChannelCard channelDetail={item} />}
        </Box>
      ))}
    </Stack>
  )
}

export default Videos;