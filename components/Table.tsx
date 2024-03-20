import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { TablePagination } from '@mui/material';

export interface Video {
  playlistElementId: string;
  videoId: string;
  title: string;
  thumbnail: string;
  dateAdded: string;
  viewCount: number;
}

interface VideoTableProps {
  videos: Video[];
  onDelete: ({ playlistElementId, videoId }: { playlistElementId: string, videoId: string }) => void;
  onPlay: (id: string) => void;
  onPageChange: (page: number) => void;
  totalResults: number;
  rowsPerPage: number;
  page: number;
  isLoading: boolean;
}

const Text = styled.p`
  max-width: 300px;
`;

export const VideoTable: React.FC<VideoTableProps> = ({
  videos,
  onDelete,
  onPlay,
  onPageChange,
  totalResults,
  rowsPerPage,
  page,
  isLoading,
}) => {
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Video</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Views</TableCell>
              <TableCell align="right">Date Added</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <TableBody>
              {videos?.map(
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
                      <img onClick={() => onPlay(videoId)} src={thumbnail} alt="" />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Text>{title}</Text>
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                      {viewCount}
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                      {dayjs(dateAdded).format('DD-MM-YYYY')}
                    </TableCell>
                    <TableCell align="right" component="th" scope="row">
                      <IconButton onClick={() => onPlay(videoId)}>
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton onClick={() => onDelete({ playlistElementId, videoId })}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalResults}
        rowsPerPage={rowsPerPage}
        page={page}
        rowsPerPageOptions={[]}
        onPageChange={(_, page) => onPageChange(page)}
      />
    </Paper>
  );
};
