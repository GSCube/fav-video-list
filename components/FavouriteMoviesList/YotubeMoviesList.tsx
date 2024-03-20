'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { Typography, Button, Modal, CircularProgress } from '@mui/material';
import { Video, VideoTable } from '../Table';
import { Box } from '@mui/system';
import YouTube from 'react-youtube';
import { modalStyle, Wrapper } from '@/components/FavouriteMoviesList/styles';
import { prepareDataForYTVideos } from '@/components/FavouriteMoviesList/utils';
import {
  addToFavourites,
  deleteFromFavorites,
  deleteAllFromFavourites,
  REDIRECT_URL,
  refetchInterval,
  getFavoriteVideosWithViews,
} from '@/data/youtube';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddVideoBox } from '@/components/AddVideoBox';
import { AxiosError } from 'axios';

interface YoutubeMoviesListProps {
  accessToken: string;
}

export const YoutubeMoviesList: React.FC<YoutubeMoviesListProps> = ({ accessToken }) => {
  const ref = React.useRef(0);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedVideoId, setSelectedVideoId] = useState('');

  const {
    data: playlists,
    isError: isListError,
    isLoading: isListLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['videos', nextPageToken],
    queryFn: () => getFavoriteVideosWithViews(accessToken, nextPageToken),
    enabled: !!accessToken,
    retry: false,
    refetchInterval,
  });

  if ((error as AxiosError)?.response?.status === 401 || (error as AxiosError)?.response?.status === 403) {
    redirect(REDIRECT_URL);
  }

  const videos = playlists?.data?.items;

  const tableData: Video[] = videos?.map(prepareDataForYTVideos);

  const pageInfo = playlists?.data?.pageInfo;
  const moviesIds = tableData?.map(({ playlistElementId, videoId }) => ({ playlistElementId, videoId }));

  const { mutateAsync: handleDelete, isPending: isDeletePending } = useMutation({
    mutationFn: async ({playlistElementId, videoId}: {playlistElementId: string, videoId: string}) => await deleteFromFavorites(accessToken, playlistElementId, videoId),
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
    <Wrapper>
      <Typography variant="h4" component="h2">
        Youtube favorite videos list
      </Typography>

      <AddVideoBox
        onAdd={handleAdd}
        isError={isAddError}
        isLoading={isAddPending}
        isSuccess={isAddSuccess}
      />

      {tableData && (
        <VideoTable
          isLoading={isListLoading}
          videos={tableData}
          onPlay={handlePlay}
          onDelete={({playlistElementId, videoId}) => handleDelete({playlistElementId, videoId})}
          onPageChange={(newPage) => {
            if (newPage > ref.current) {
              setNextPageToken(playlists?.data?.nextPageToken);
            } else {
              setNextPageToken(playlists?.data?.prevPageToken);
            }
            ref.current = newPage;
          }}
          totalResults={pageInfo?.totalResults}
          rowsPerPage={pageInfo?.resultsPerPage}
          page={ref.current}
        />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <YouTube videoId={selectedVideoId} />
        </Box>
      </Modal>
      <Box mt={2}>
        <Button onClick={() => refetch()}>
          <RefreshIcon />
          Refresh
        </Button>
        <Button onClick={() => handleAsyncDelete()}>
          <DeleteIcon />
          Delete all (from this page)
        </Button>
      </Box>
    </Wrapper>
  );
};
