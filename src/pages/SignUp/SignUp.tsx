import React from 'react';
// Custom Imports Start
import SignUpController, { Props } from './SignUpController';
import styles from './SignUp.styles';
import { __ } from '../../lang/i18';
import withLayout from '../../utilities/LayoutWrapper/withLayout';
import MainLayout from '../../layouts/MainLayout';
import { Box, Typography, Button } from '@mui/material'
// Custom Imports End

// UI
const SignUp = (props: Props) => {
  // Getting data from Controller Start
  const instance = SignUpController(props);
  // Getting data from Controller End
  return (
    <Box
      sx={styles.MainBox}
    >
      <Typography sx={styles.ExampleText}>Example State Value: {instance.exampleState}</Typography>
      <Button sx={styles.ExampleButton} onClick={instance.handleExampleStateChange}>Change Example State</Button>
    </Box>
  );
};

export default withLayout(MainLayout)(SignUp);