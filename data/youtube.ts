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

// ------->  Playground to remove, just left it to show the development process <-------
// Proper way would be to document it in some ADR file or something similar
// So other developers see where problems were and how they were solved

// This approach didn't work for me because YT gives 500 error but....
// is adding video to the playlist...anyway...but now always :)
export const addToFavorites = (accessToken: string, id: string) =>
  axios.post(
    `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?part=snippet`,
    {
      snippet: {
        playlistId: 'LL',
        position: 0,
        resourceId: {
          kind: 'youtube#video',
          videoId: youtubeParser(id),
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );



// Fetch solution experiment
export const fetchFavoritesWithFetch = async (accessToken: string) => {
  if (!accessToken) {
    return;
  }
  const response = await fetch(
    `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?part=snippet&playlistId=LL`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    },
  );

  const data = await response.json();
  return data.items; // This will contain information about the user's favorite movies or videos
};

export const deleteVideo = async (accessToken: string, id: string) => {
  if (!accessToken) {
    return;
  }
  const response = await fetch(`${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?id=${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

// SWR solution experiment
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useYoutubeFavVideos = () => {
  const { data: session } = useSession();

  // @ts-ignore
  const { accessToken } = session || {};
  const {
    data,
    error,
    // @ts-ignore
    isLoading,
  } = useSWR(
    accessToken
      ? `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?access_token=${accessToken}&part=snippet&playlistId=LL`
      : null,
    fetcher,
  );

  return {
    videos: data?.items,
    isLoading,
    isError: error,
  };
};
