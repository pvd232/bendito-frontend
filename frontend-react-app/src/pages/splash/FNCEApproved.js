import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import FNCElogo from '../../static/images/fnce_logo.png';
import cheraPlusFNCE from '../../static/images/chera_plus_fnce.png';
import logo from '../../static/images/chera_logo.png';
import academy2 from '../../static/images/eat_right_logo_5.png';
import { useTheme } from '@mui/material/styles';
import './css/FNCEApproved.css';
const FNCEApproved = () => {
  const customTheme = useTheme();
  return (
    <Grid
      item
      container
      className="fnce-approved-container splash-page-container"
    >
      <Grid item xs={10}>
        <Typography
          className="splash-page-title"
          fontSize={customTheme.pages.splash.fontSize.header}
          mb={customTheme.largerScreen() ? '10vh' : '5vh'}
        >
          Dietitian vetted & approved
        </Typography>
      </Grid>
      {customTheme.largerScreen() ? (
        <>
          <Grid item>
            <img src={cheraPlusFNCE} height="55vh" alt="chera plus fnce"></img>
          </Grid>
          <Grid item>
            <Typography fontSize={'3rem'}>=</Typography>
          </Grid>
          <Grid item>
            <img src={FNCElogo} height={'80vh'} alt="" />
          </Grid>
        </>
      ) : (
        <Grid
          container
          item
          justifyContent={'center'}
          spacing={2}
          alignItems={'center'}
        >
          <Grid item container justifyContent={'center'} lg={4} xs={10}>
            <img src={logo} alt="" height={'50vh'} />
          </Grid>
          <Grid container item justifyContent={'center'}>
            <Icon mx={'auto'} fontSize={'large'}>
              add
            </Icon>
          </Grid>
          <Grid
            container
            item
            justifyContent={'center'}
            paddingBottom={'0vh'}
            lg={4}
            xs={8}
          >
            <img src={academy2} height={'130vh'} alt="" />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default FNCEApproved;
