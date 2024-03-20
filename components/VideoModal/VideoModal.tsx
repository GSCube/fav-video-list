import { modalStyle } from './styles';
import { Box } from '@mui/system';
import YouTube from 'react-youtube';
import { Modal } from '@mui/material';
import React from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoId }) => (
  <Modal
    open={isOpen}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={modalStyle}>
      <YouTube videoId={videoId} />
    </Box>
  </Modal>
);
