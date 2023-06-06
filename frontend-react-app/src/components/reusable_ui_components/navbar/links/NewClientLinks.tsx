import ClientProfileDropDown from '../ClientProfileDropDown';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../scss/ClientLinks.module.scss';

const NewClientLinks = () => {
  const navigate = useNavigate();
  return (
    <Grid container item className={styles.clientLinksContainer}>
      <Grid item>
        <Typography className={styles.link} onClick={() => navigate('/home')}>
          My schedule
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          className={styles.link}
          onClick={() => navigate('/previous-deliveries')}
        >
          Previous deliveries
        </Typography>
      </Grid>
      <Grid item>
        <ClientProfileDropDown />
      </Grid>
    </Grid>
  );
};
export default NewClientLinks;