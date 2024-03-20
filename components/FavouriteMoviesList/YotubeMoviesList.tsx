'use client';

import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { VideoTable } from '../VideoTable';
import { formatToTableData } from '@/components/FavouriteMoviesList/utils';
import {
  addToFavourites,
  deleteFromFavorites,
  deleteAllFromFavourites,
  SIGN_IN_REDIRECT_URL,
  favouriteVideosFetchInterval,
  getFavoriteVideosWithViews,
} from '@/data/youtube';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddVideoBox } from '@/components/AddVideoBox';
import { AxiosError } from 'axios';
import { VideoPlatformWrapper } from '@/components/VideoPlatformWrapper';
import { Video } from '@/data/types';

interface YoutubeMoviesListProps {
  accessToken: string;
}

export const YoutubeMoviesList: React.FC<YoutubeMoviesListProps> = ({ accessToken }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState('');

  const {
    data: playlists,
    isError: isListError,
    isLoading: isListLoading,
    refetch: refetchFavoriteVideosWithViews,
    error,
  } = useQuery({
    queryKey: ['videos', nextPageToken],
    queryFn: () => getFavoriteVideosWithViews(accessToken, nextPageToken),
    enabled: !!accessToken,
    retry: false,
    refetchInterval: favouriteVideosFetchInterval,
  });

  if (
    (error as AxiosError)?.response?.status === 401 ||
    (error as AxiosError)?.response?.status === 403
  ) {
    redirect(SIGN_IN_REDIRECT_URL);
  }

  const videos = playlists?.data?.items;
  const tableData: Video[] = videos?.map(formatToTableData);
  const pageInfo = playlists?.data?.pageInfo;
  const moviesIds = tableData?.map(({ playlistElementId, videoId }) => ({
    playlistElementId,
    videoId,
  }));

  const { mutateAsync: handleDelete, isPending: isDeletePending } = useMutation({
    mutationFn: async ({
      playlistElementId,
      videoId,
    }: {
      playlistElementId: string;
      videoId: string;
    }) => await deleteFromFavorites(accessToken, playlistElementId, videoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const { mutateAsync: handleAsyncDelete } = useMutation({
    mutationFn: () => deleteAllFromFavourites(accessToken, moviesIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const {
    mutateAsync: handleAdd,
    isError: isAddError,
    isPending: isAddPending,
    isSuccess: isAddSuccess,
  } = useMutation({
    mutationFn: (id: string) => addToFavourites(accessToken, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const handlePlay = (id: string) => {
    setSelectedVideoId(id);
    setOpen(true);
  };

  if (isListError) {
    return (
      <Typography variant="h3" component="h2">
        Error
      </Typography>
    );
  }

  return (
    <VideoPlatformWrapper
      onModalClose={() => setOpen(false)}
      isModalOpen={open}
      selectedVideoId={selectedVideoId}
      onRefresh={() => refetchFavoriteVideosWithViews()}
      onDelete={() => handleAsyncDelete()}
      title="Yotutube favourite videos"
    >
      <AddVideoBox
        onAdd={handleAdd}
        isError={isAddError}
        isLoading={isAddPending}
        isSuccess={isAddSuccess}
      />

      <VideoTable
        isDataLoading={isListLoading}
        isDeletePending={isDeletePending}
        videos={tableData}
        onPlay={handlePlay}
        onDelete={({ playlistElementId, videoId }) =>
          handleDelete({ playlistElementId, videoId })
        }
        onPageChange={(newPage) => {
          if (newPage > page) {
            setNextPageToken(playlists?.data?.nextPageToken);
          } else {
            setNextPageToken(playlists?.data?.prevPageToken);
          }
          setPage(newPage);
        }}
        totalResults={pageInfo?.totalResults}
        rowsPerPage={pageInfo?.resultsPerPage}
        page={page}
      />
    </VideoPlatformWrapper>
  );
};
