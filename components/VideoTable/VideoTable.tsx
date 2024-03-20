import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import dayjs from 'dayjs';
import { TablePagination } from '@mui/material';
import Image from 'next/image';
import { DeleteButton } from '@/components/DeleteButton';
import { TextWrapper } from '@/components/VideoTable/styles';
import { Video } from '@/data/types';
import { Skeleton } from '@mui/lab';

interface VideoTableProps {
  videos: Video[];
  onDelete: ({
    playlistElementId,
    videoId,
  }: {
    playlistElementId: string;
    videoId: string;
  }) => void;
  onPlay: (id: string) => void;
  onPageChange: (page: number) => void;
  totalResults: number;
  rowsPerPage: number;
  page: number;
  isDataLoading: boolean;
  isDeletePending: boolean;
}

const DATE_FORMAT = 'DD-MM-YYYY';

const createSkeleton = (length: number) => {
  return Array.from({ length }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton variant="text" width={132} height={96} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={200} />
      </TableCell>
      <TableCell align="right">
        <Skeleton variant="text" width={50} />
      </TableCell>
      <TableCell align="right">
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell align="right">
        <Skeleton variant="text" width={100} height={40} />
      </TableCell>
    </TableRow>
  ));
};

const defaultPageSize = 5;
const RowsSkeleton = () => createSkeleton(defaultPageSize);

export const VideoTable: React.FC<VideoTableProps> = ({
  videos,
  onDelete,
  onPlay,
  onPageChange,
  totalResults,
  rowsPerPage,
  page,
  isDataLoading,
  isDeletePending,
}) => {
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Video</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Views</TableCell>
              <TableCell align="right">Date Added</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isDataLoading ? (
              <RowsSkeleton />
            ) : (
              videos?.map(
                ({
                  videoId,
                  title,
                  viewCount,
                  thumbnail,
                  playlistElementId,
                  dateAdded,
                }) => (
                  <TableRow
                    key={playlistElementId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Image
                        width={120}
                        height={90}
                        onClick={() => onPlay(videoId)}
                        src={thumbnail}
                        alt=""
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextWrapper>{title}</TextWrapper>
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                      {viewCount}
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                      {dayjs(dateAdded).format(DATE_FORMAT)}
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                      <Tooltip title="Play">
                        <IconButton onClick={() => onPlay(videoId)}>
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                      <DeleteButton
                        onDelete={() => onDelete({ playlistElementId, videoId })}
                        isLoading={isDeletePending}
                      />
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        disabled={isDataLoading}
        count={totalResults || defaultPageSize}
        rowsPerPage={rowsPerPage || defaultPageSize}
        page={page}
        rowsPerPageOptions={[]}
        onPageChange={(_, page) => onPageChange(page)}
      />
    </Paper>
  );
};
