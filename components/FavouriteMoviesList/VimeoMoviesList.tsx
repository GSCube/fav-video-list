// here hoes vimeo UI components

// if we want simple solution with displaying separate list and components for different video platforms
// as for youtube we would do for vimeo similar to YoutubeMoviesList.tsx file

import { Typography, Alert } from '@mui/material';

export const VimeoMoviesList = () => {
  return (
    <div>
      <Typography variant="h3" component="h2">
        Vimeo Movies List will be in future here
      </Typography>
      <Typography variant="body1">
        As simplest solution here (or in setting) user will need to authenticate with
        vimeo account
      </Typography>
      <Alert severity="info">
        <Typography variant="body1">here goes table with Vimeo videos</Typography>
      </Alert>
      <Alert severity="warning">
        <Typography variant="body1">
          Also easy way we could display Vimeo videos raws in same table with YT videos
          and even have different actions per different video provider. ...but pagination,
          deleting and adding videos would be much more complicated
        </Typography>
      </Alert>
    </div>
  );
};
