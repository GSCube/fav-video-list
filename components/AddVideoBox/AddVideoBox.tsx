import React from 'react';
import { TextField, Button, Alert, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { Outer, Wrapper } from '@/components/AddVideoBox/styles';

interface AddVideoBoxProps {
  onAdd: UseMutateAsyncFunction<AxiosResponse<any, any>, Error, string, unknown>;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

export const AddVideoBox: React.FC<AddVideoBoxProps> = ({
  onAdd,
  isError,
  isLoading,
  isSuccess,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const handlVideoSubmit = (url: string) => {
    onAdd(url)
      .then(() => {
        reset();
      })
      .catch(() => {});
  };

  return (
    <Outer>
      {isError && <Alert severity="error">Wystąpił problem z dodaniem filmu</Alert>}
      {isSuccess && <Alert severity="info">Dodano</Alert>}
      <Typography variant="h6">Add liked video</Typography>
      <form onSubmit={handleSubmit(({ url }) => handlVideoSubmit(url))}>
        <Wrapper>
          <Controller
            name="url"
            control={control}
            defaultValue=""
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <TextField
                size={'small'}
                style={{ width: '300px' }}
                placeholder="Add video URL / ID"
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
            Add
          </Button>
        </Wrapper>
      </form>
    </Outer>
  );
};
