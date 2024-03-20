// here hoes vimeo UI components

// if we want simple solution with displaying separate list and components for different video platforms
// as for youtube we would do for vimeo similar to YoutubeMoviesList.tsx file

import { Typography, Alert } from '@mui/material';
import { Box } from '@mui/system';
import { VideoPlatformWrapper } from '@/components/VideoPlatformWrapper';

export const VimeoMoviesList = () => {
  return (
    <VideoPlatformWrapper
      title={'Vimeo favourite movies list (will be in future here...)'}
      onDelete={() => {}}
      onModalClose={() => {}}
      onRefresh={() => {}}
      isModalOpen={false}
      selectedVideoId={''}
    >
      <Box mb={2}>
        <Typography variant="body2">
          Here (or in setting) user will need to authenticate with vimeo account
        </Typography>
      </Box>
      <Box mb={2}>
        <Alert severity="info">
          <Typography variant="body1">
            Simplest solution: here goes table with Vimeo videos
          </Typography>
        </Alert>
      </Box>
      <Alert severity="warning">
        <Typography variant="body1">
          Hard solution: We could display Vimeo videos raws in same table with YT videos
          and even have different actions per different video provider...but pagination,
          deleting and adding videos would be much more complicated
        </Typography>
      </Alert>
    </VideoPlatformWrapper>
  );
};
