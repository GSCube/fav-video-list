'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { Typography, Button, Modal, CircularProgress } from '@mui/material';
import { Video, VideoTable } from '../Table';
import { Box } from '@mui/system';
import YouTube from 'react-youtube';
import { modalStyle } from '@/components/FavouriteMoviesList/styles';
import { prepareDataForYTVideos } from '@/components/FavouriteMoviesList/utils';
import { addToFavorites, deleteFromFavorites, fetchFavorites } from '@/data/youtube';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutateAsyncFunction,
} from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddVideoBox } from '@/components/AddVideoBox';
import { AxiosError, AxiosResponse } from 'axios';

const handleDeleteAll = async (
  moviesIds: string[],
  handleAsyncDelete: UseMutateAsyncFunction<AxiosResponse<any, any>, Error, string, void>,
) => {
  await Promise.all(moviesIds?.map((id) => handleAsyncDelete(id)));
};

// Make requests in interval so user can see the changes in real time
// and to fetch latest data after adding or deleting a video
// as for some reason the data is not updated immediately after adding or deleting a video
const refetchInterval = 2000; // 2 seconds

const REDIRECT_URL = '/api/auth/signin?callbackUrl=/';
export const FavouriteMoviesList = () => {
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
    refetchInterval,
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
  } = useMutation({
    mutationFn: (id: string) => addToFavorites(accessToken, id),
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
    <section>
      <Typography variant="h3" component="h2">
        Favorites Movies list
      </Typography>

      <AddVideoBox onAdd={handleAdd} isError={isAddError} isLoading={isPending} />

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
      <Button onClick={() => refetch()}>
        <RefreshIcon />
        Refresh
      </Button>
      <Button onClick={() => handleDeleteAll(moviesIds, handleAsyncDelete)}>
        <DeleteIcon />
        Delete all (from this page)
      </Button>
    </section>
  );
};
