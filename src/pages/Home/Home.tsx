import React from 'react'
// Custom Imports Start
import HomeController, { Props } from './HomeController';
import { Grid, TextField, Typography } from '@mui/material'
import OutlinedButton from '../../components/Button/OutlinedButton';
import styles from './Home.styles';
import { __ } from '../../lang/i18';
import withLayout from '../../utilities/LayoutWrapper/withLayout';
import MainLayout from '../../layouts/MainLayout';
// Custom Imports End


// UI
const Home = (props: Props) => {
  // Getting data from Controller Start
  const instance = HomeController(props);
  // Getting data from Controller End

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} sx={styles.TitleContainer}>
        <Typography component={'h1'} sx={styles.Title}>{__("Home.title")}</Typography>
      </Grid>
      <Grid item xs={12} sx={styles.FormContainer}>
        <TextField
          type={'email'}
          value={instance.email}
          placeholder={__("Home.emailPlaceholder")}
          label={__("Home.emailLabel")}
          onChange={instance.handleEmailChange}
          sx={styles.EmailInput}
        />
        {/* Custom component example */}
        <OutlinedButton sx={styles.SubmitButton} buttonText={__("common.submit")} onClick={instance.handleSubmit} />
      </Grid>
    </Grid>
  )
}

export default withLayout(MainLayout)(Home);
