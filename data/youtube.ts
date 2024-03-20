import axios, { AxiosResponse } from 'axios';
import { youtubeParser } from '@/data/utils';
import { UseMutateAsyncFunction } from '@tanstack/react-query';

export const REDIRECT_URL = '/api/auth/signin?callbackUrl=/';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const PATHS: {
  [key: string]: string;
} = {
  PLAYLIST_ITEMS: '/playlistItems',
  VIDEOS: '/videos',
};


export const refetchInterval = 600000; // set interval to 10min

export const getFavoriteVideos = async (
  accessToken: string,
  nextPageToken?: string | null,
  videoId?: string,
) => {
  const pageToken = nextPageToken ? `&pageToken=${nextPageToken}` : '';
  const videoIdToFetch = videoId ? `&videoId=${videoId}` : '';
  return axios.get(
    `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?access_token=${accessToken}&part=snippet&playlistId=LL${pageToken}${videoIdToFetch}`,
  );
};

export const getFavoriteVideosWithViews = async (
  accessToken: string,
  nextPageToken?: string | null,
) => {
  const listResponse = await getFavoriteVideos(accessToken, nextPageToken);
  const ids = listResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);

  const viewsResponse = await getViews(accessToken, ids);

  const items = listResponse.data.items.map((item: any, index: number) => {
    const views = viewsResponse.data.items[index].statistics.viewCount;
    return {
      ...item,
      views,
    };
  });

  return { ...listResponse, data: { ...listResponse.data, items } };
};

export const getViews = async (accessToken: string, ids: string[]) => {
  const idsString = ids.join(',');

  return axios.get(
    `${YOUTUBE_BASE_URL + PATHS.VIDEOS}?access_token=${accessToken}&part=statistics&id=${idsString}`,
  );
};

export const addToFavourites = async (accessToken: string, id: string) => {
  const parsedId = youtubeParser(id);
  const response =  await axios.post(
    `${YOUTUBE_BASE_URL + PATHS.VIDEOS}/rate?access_token=${accessToken}&id=${parsedId}&rating=like`,
  );

  let shouldContinuePolling = true;

  const validateResponse = async () => {
    try {
      const resp = await getFavoriteVideos(accessToken, null, parsedId);
      if (resp.data.items.length > 0) {
        shouldContinuePolling = false;
      }
    }
    catch (e) {}
  }

  await validateResponse()

  while (shouldContinuePolling) {
    await wait(3800);
    await validateResponse()
  }

  return response;
};



export const deleteFromFavorites = async (accessToken: string, playlistElementId: string, videoId: string) => {
  const response = await axios.delete(
    `${YOUTUBE_BASE_URL + PATHS.PLAYLIST_ITEMS}?access_token=${accessToken}&id=${playlistElementId}`,
  )

  let shouldContinuePolling = true;

  const validateResponse = async () => {
    const resp = await getFavoriteVideos(accessToken, null, videoId);
    if (resp.data.items.length === 0) {
      shouldContinuePolling = false;
    }
  }

  await validateResponse()

  while (shouldContinuePolling) {
    await wait(800);
    await validateResponse()
  }

  return response;
};

const wait = function (ms = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

export const deleteAllFromFavourites = async (
  accessToken: string,
  moviesIds: {playlistElementId: string, videoId: string}[],
) => {
  await Promise.all(moviesIds?.map(({ playlistElementId, videoId }) => deleteFromFavorites(accessToken, playlistElementId, videoId)));
};
