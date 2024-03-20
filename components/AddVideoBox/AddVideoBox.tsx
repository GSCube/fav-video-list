import React from 'react';
import { TextField, Alert, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { Outer, Wrapper } from '@/components/AddVideoBox/styles';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';

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
      <Box mb={2}>
        {isError && (
          <Alert severity="error">
            There was an error while adding video. Check url or video id and try again.
          </Alert>
        )}
        {isSuccess && <Alert severity="info">Added successfully</Alert>}
      </Box>
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
                style={{ width: '100%' }}
                placeholder="Add video url or video id"
                {...field}
                variant="outlined"
                error={!!errors.url}
                helperText={
                  errors.url
                    ? (errors.url.message as string)
                    : 'eg. https://www.youtube.com/watch?v=videoId or videoId'
                }
              />
            )}
          />
          <LoadingButton
            loading={isLoading}
            style={{ height: '40px' }}
            variant="outlined"
            type="submit"
          >
            Add
          </LoadingButton>
        </Wrapper>
      </form>
    </Outer>
  );
};
