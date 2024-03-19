import { YoutubeMoviesList } from './YotubeMoviesList'
import { VimeoMoviesList } from '@/components/FavouriteMoviesList/VimeoMoviesList';

export const FavouriteMoviesList = () => {
  return (
    <>
      <YoutubeMoviesList />
      <VimeoMoviesList />
    </>
  );
};
