import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import axios, { AxiosResponse } from 'axios';
import { youtubeParser } from '@/data/utils';
import { UseMutateAsyncFunction } from '@tanstack/react-query';

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
export const REDIRECT_URL = '/api/auth/signin?callbackUrl=/';

// Make requests in interval so user can see the changes in real time
// and to fetch latest data after adding or deleting a video
// as for some reason the data is not updated immediately after adding or deleting a video

export const refetchInterval = 2000; // 2 seconds

export const handleDeleteAll = async (
  moviesIds: string[],
  handleAsyncDelete: UseMutateAsyncFunction<AxiosResponse<any, any>, Error, string, void>,
) => {
  await Promise.all(moviesIds?.map((id) => handleAsyncDelete(id)));
};

const PATHS: {
  [key: string]: string;
} = {
  PLAYLIST_ITEMS: '/playlistItems',
};

export const fetchFavorites = (accessToken: string, nextPageToken?: string | null) => {
  if (nextPageToken) {
    return axios.get(
      `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?access_token=${accessToken}&part=snippet&playlistId=LL&pageToken=${nextPageToken}`,
    );
  }
  return axios.get(
    `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?access_token=${accessToken}&part=snippet&playlistId=LL`,
  );
};

export const deleteFromFavorites = (accessToken: string, id: string) =>
  axios.delete(
    `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?access_token=${accessToken}&id=${id}`,
  );

export const addLike = (accessToken: string, id: string) =>
  axios.post(
    `${YOUTUBE_BASE_URL}/videos/rate?access_token=${accessToken}&id=${youtubeParser(id)}&rating=like`,
  );

