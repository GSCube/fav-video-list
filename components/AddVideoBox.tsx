import React from 'react';
import {Input, Button, Alert} from '@mui/material';
import styled from "styled-components";

interface AddVideoBoxProps {
  onAdd: (id: string) => void;
  isError: boolean;
  isLoading: boolean;
}

//styled wrapper
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f5f5;
`

export const AddVideoBox: React.FC<AddVideoBoxProps> = ({onAdd, isError, isLoading}) => {
  const [url, setUrl] = React.useState('');

  return (
    <>
      {isError && <Alert severity="error">Wystąpił problem z dodaniem filmu</Alert>}
      <Wrapper>
        <Input placeholder="Wpisz URL / ID filmu" value={url} onChange={({target}) => setUrl(target.value)}/>
        <Button disabled={isLoading} onClick={() => onAdd(url)}>Dodaj</Button>
      </Wrapper>
    </>
  )
}
