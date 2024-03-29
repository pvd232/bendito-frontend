import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import logo from '../../../../static/images/chera_logo_300x300.png';
import capitalize from '../../../../helpers/capitalize';

const OrderMealCard = (props) => (
  <Card
    sx={{
      maxWidth: 350,
      height: '100%',
      maxHeight: 450,
      position: 'relative',
      marginBottom: '2vh',
    }}
  >
    <CardMedia
      component="img"
      src={logo}
      alt="green iguana"
      sx={{
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    />
    <CardContent>
      <Typography
        gutterBottom
      >
        {props.mealData.name}
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {capitalize(props.mealData.mealTime)}
        </Typography>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {props.mealData.description}
      </Typography>
    </CardContent>
    <Grid container justifyContent={'center'} alignItems={'flex-end'}>
      <Grid item>
        <Typography fontSize={'1rem'}>
          {props.mealData.quantity} ordered
        </Typography>
      </Grid>
    </Grid>
  </Card>
);
export default OrderMealCard;
