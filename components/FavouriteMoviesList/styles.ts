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
