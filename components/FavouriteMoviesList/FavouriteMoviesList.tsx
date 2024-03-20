'use client';
import { YoutubeMoviesList } from './YotubeMoviesList';
import { VimeoMoviesList } from '@/components/FavouriteMoviesList/VimeoMoviesList';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { REDIRECT_URL } from '@/data/youtube';
import { FavouriteMoviesListWrapper } from '@/components/FavouriteMoviesList/styles';

export const FavouriteMoviesList = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(REDIRECT_URL);
    },
  });

  // @ts-ignore
  const { accessToken } = session || {};

  if (!accessToken) return null;

  return (
    <FavouriteMoviesListWrapper>
      <YoutubeMoviesList accessToken={accessToken} />
      <VimeoMoviesList />
    </FavouriteMoviesListWrapper>
  );
};
