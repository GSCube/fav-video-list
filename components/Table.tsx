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
  watchCount: number;
}

interface VideoTableProps {
  videos: Video[];
  onDelete: (id: string) => void;
  onPlay: (id: string) => void;
  onPageChange: (page: number) => void;
  totalResults: number;
  rowsPerPage: number;
  page: number;
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
}) => {
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Video</TableCell>
              <TableCell>Tutuł</TableCell>
              <TableCell align="right">Odtworzenia</TableCell>
              <TableCell align="right">Data Dodania</TableCell>
              <TableCell align="right">Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos?.map(
              ({
                videoId,
                title,
                watchCount,
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
                    {watchCount}
                  </TableCell>
                  <TableCell align="right" component="th" scope="row">
                    {dayjs(dateAdded).format('DD-MM-YYYY')}
                  </TableCell>
                  <TableCell align="right" component="th" scope="row">
                    <IconButton onClick={() => onPlay(videoId)}>
                      <PlayArrowIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(playlistElementId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
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
