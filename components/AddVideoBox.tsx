import React from 'react';
import { Input, Button, Alert, Typography } from '@mui/material';
import styled from 'styled-components';

interface AddVideoBoxProps {
  onAdd: (id: string) => void;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const Outer = styled.div`
  display: flex;
  margin-top: 20px;
  padding: 16px;
  background-color: white;
  flex-direction: column;
`;

export const AddVideoBox: React.FC<AddVideoBoxProps> = ({
  onAdd,
  isError,
  isLoading,
  isSuccess,
}) => {
  const [url, setUrl] = React.useState('');

  // TODO Add handling by form with validation with React Hook Form
  return (
    <Outer>
      {isError && <Alert severity="error">Wystąpił problem z dodaniem filmu</Alert>}
      {isSuccess && <Alert severity="info">Dodano</Alert>}
      <Typography variant="h6">Add liked video</Typography>
      <Wrapper>
        <Input
          placeholder="Wpisz URL / ID filmu"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button  disabled={isLoading} onClick={() => onAdd(url)}>
          Dodaj
        </Button>
      </Wrapper>
    </Outer>
  );
};
