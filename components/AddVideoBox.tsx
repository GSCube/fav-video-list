import React from 'react';
import { TextField, Button, Alert, Typography } from '@mui/material';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { pattern } from '@/data/utils';

interface AddVideoBoxProps {
  onAdd: (id: string) => void;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  gap: 16px;
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  return (
    <Outer>
      {isError && <Alert severity="error">Wystąpił problem z dodaniem filmu</Alert>}
      {isSuccess && <Alert severity="info">Dodano</Alert>}
      <Typography variant="h6">Add liked video</Typography>
      <form onSubmit={handleSubmit(({ url }) => onAdd(url))}>
        <Wrapper>
          <Controller
            name="url"
            control={control}
            defaultValue=""
            rules={{
              required: 'Pole wymagane',
            }}
            render={({ field }) => (
              <TextField
                size={'small'}
                style={{ width: '300px' }}
                placeholder="Wpisz URL / ID filmu"
                {...field}
                variant="outlined"
                error={!!errors.url}
                helperText={errors.url ? (errors.url.message as string) : ' '}
              />
            )}
          />
          <Button
            style={{ height: '40px' }}
            variant="outlined"
            type="submit"
            disabled={isLoading}
          >
            Dodaj
          </Button>
        </Wrapper>
      </form>
    </Outer>
  );
};
