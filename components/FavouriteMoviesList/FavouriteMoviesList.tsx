'use client';
import { YoutubeMoviesList } from './YotubeMoviesList';
import { VimeoMoviesList } from '@/components/FavouriteMoviesList/VimeoMoviesList';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  gap: 60px;
  max-width: 1000px;
  margin: 0 auto;
`;

export const FavouriteMoviesList = () => {
  return (
    <Wrapper>
      <YoutubeMoviesList />
      <VimeoMoviesList />
    </Wrapper>
  );
};
