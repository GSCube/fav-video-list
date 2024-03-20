import styled from 'styled-components';

export const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const FavouriteMoviesListWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  gap: 60px;
  max-width: 1000px;
  margin: 0 auto;
`;
