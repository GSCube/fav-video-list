import { Button, Typography } from '@mui/material';
import React from 'react';
import { Wrapper } from './styles';
import { VideoModal } from '@/components/VideoModal';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';

interface VideoPlatformWrapperProps {
  title: string;
  children: React.ReactNode;
  isModalOpen: boolean;
  onModalClose: () => void;
  onRefresh: () => void;
  onDelete: () => void;
  selectedVideoId: string;
}

export const VideoPlatformWrapper: React.FC<VideoPlatformWrapperProps> = ({
  title,
  children,
  isModalOpen,
  onModalClose,
  selectedVideoId,
  onRefresh,
  onDelete,
}) => (
  <>
    <Wrapper>
      <Typography variant="h4" component="h2">
        {title}
      </Typography>
      {children}

      <Box mt={2}>
        <Button onClick={onRefresh}>
          <RefreshIcon />
          Refresh
        </Button>
        <Button onClick={onDelete}>
          <DeleteIcon />
          Delete all (from this page)
        </Button>
      </Box>
    </Wrapper>

    <VideoModal onClose={onModalClose} isOpen={isModalOpen} videoId={selectedVideoId} />
  </>
);
