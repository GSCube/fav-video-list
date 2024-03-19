// here hoes vimeo UI components

// if we want simple solution with displaying separate list and components for different video platforms
// as for youtube we would do for vimeo similar to YoutubeMoviesList.tsx file

import { Typography } from '@mui/material';

export const VimeoMoviesList = () => {
  return (
    <div>
      <Typography variant="h3" component="h2">
        Vimeo Movies List will be in future here
      </Typography>
      <Typography variant="body1">
        Here (or in setting) user will need to authenticate with vimeo account
      </Typography>
      <Typography variant="body1">here goes table with Viemo videos</Typography>
      <Typography variant="body2">
        Easy way we could display viemo videos raws in same table with YT videos But
        pagination, deleting and adding videos would be much more complicated
      </Typography>
    </div>
  );
};
