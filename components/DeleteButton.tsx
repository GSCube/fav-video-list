import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';

interface DeleteButtonProps {
  onDelete: () => void;
  isLoading: boolean;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  min-height: 40px;
  align-items: center;
  justify-content: flex-end;
`;

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, isLoading }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (!isLoading) {
      setAnchorEl(null);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Tooltip title="Delete">
        <IconButton onClick={handleClick}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ padding: '20px' }}>
          <Typography>Are you sure you want to delete this item?</Typography>
          <Wrapper>
            {isLoading ? (
              <>
                Removing...
                <CircularProgress size={20} />
              </>
            ) : (
              <>
                <Button onClick={onDelete} color="secondary">
                  Confirm
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </>
            )}
          </Wrapper>
        </div>
      </Popover>
    </>
  );
};
