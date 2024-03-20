import styled from 'styled-components';
import Paper from '@mui/material/Paper';

export const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  gap: 16px;
`;

export const Outer = styled(Paper)`
  display: flex;
  margin: 20px 0;
  padding: 16px;
  background-color: white;
  flex-direction: column;
`;
