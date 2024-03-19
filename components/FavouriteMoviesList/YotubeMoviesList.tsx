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
  addLike,
  deleteFromFavorites,
  fetchFavorites,
  handleDeleteAll,
  REDIRECT_URL,
  refetchInterval,
} from '@/data/youtube';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddVideoBox } from '@/components/AddVideoBox';
import { AxiosError } from 'axios';

export const YoutubeMoviesList = () => {
  const ref = React.useRef(0);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(REDIRECT_URL);
    },
  });

  // @ts-ignore
  const { accessToken } = session || {};

  const {
    data: playlists,
    isError,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['videos', nextPageToken],
    queryFn: () => fetchFavorites(accessToken, nextPageToken),
    enabled: !!accessToken,
    // refetchInterval,
  });

  if ((error as AxiosError)?.response?.status === 401) {
    redirect(REDIRECT_URL);
  }

  const videos = playlists?.data?.items;
  const tableData: Video[] = videos?.map(prepareDataForYTVideos);

  const pageInfo = playlists?.data?.pageInfo;
  const moviesIds = tableData?.map(({ playlistElementId }) => playlistElementId);

  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteFromFavorites(accessToken, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const { mutateAsync: handleAsyncDelete } = useMutation({
    mutationFn: (id: string) => deleteFromFavorites(accessToken, id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['videos'] });
    },
  });

  const {
    mutate: handleAdd,
    isError: isAddError,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (id: string) => addLike(accessToken, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const handlePlay = (id: string) => {
    setSelectedVideoId(id);
    setOpen(true);
  };

  if (isLoading || !videos) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Typography variant="h3" component="h2">
        Error
      </Typography>
    );
  }

  return (
    <Wrapper>
      <Typography variant="h3" component="h2">
        Favorites YT Video list
      </Typography>

      <AddVideoBox
        onAdd={handleAdd}
        isError={isAddError}
        isLoading={isPending}
        isSuccess={isSuccess}
      />

      {tableData && (
        <VideoTable
          videos={tableData}
          onPlay={handlePlay}
          onDelete={(id) => handleDelete(id)}
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
      <div>
        <Button onClick={() => refetch()}>
          <RefreshIcon />
          Refresh
        </Button>
        <Button onClick={() => handleDeleteAll(moviesIds, handleAsyncDelete)}>
          <DeleteIcon />
          Delete all (from this page)
        </Button>
      </div>
    </Wrapper>
  );
};
