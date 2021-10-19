import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

//* *Recebe todas as propriedades que um rect button tem */
interface ButtonProps extends RectButtonProperties {
  children: string;
}

const Button: React.FC = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonText>{children}</ButtonText>
    </Container>
  );
};

export default Button;
