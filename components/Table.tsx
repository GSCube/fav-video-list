import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import dayjs from "dayjs";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return {name, calories, fat, carbs, protein};
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];


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
}


export const VideoTable: React.FC<VideoTableProps> = ({videos, onDelete, onPlay}) => {

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
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
          {videos?.map(({videoId, title, watchCount, thumbnail, playlistElementId, dateAdded}) => (
            <TableRow
              key={playlistElementId}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                <img onClick={() => onPlay(videoId)} src={thumbnail} alt=""/>
              </TableCell>
              <TableCell component="th" scope="row">
                {title}
              </TableCell>
              <TableCell component="th" scope="row">
                {watchCount}
              </TableCell>
              <TableCell component="th" scope="row">
                {dayjs(dateAdded).format('DD-MM-YYYY')}
              </TableCell><
              TableCell component="th" scope="row">
              <IconButton onClick={() => onPlay(videoId)} aria-label="delete">
                <PlayArrowIcon/>
              </IconButton>
              <IconButton onClick={() => onDelete(playlistElementId)} aria-label="delete">
                <DeleteIcon/>
              </IconButton>
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
