import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import capitalize from '../../../../../helpers/capitalize';
import logo from '../../../../../static/images/chera_logo_300x300.png';
import scheduledOrderMealCard from './scss/ScheduledOrderMealCard.module.scss';

const ScheduledOrderMealCard = (props) => (
  <Card className={scheduledOrderMealCard.card}>
    <CardMedia
      component="img"
      src={logo}
      alt="green iguana"
      className={scheduledOrderMealCard.img}
    />
    <CardContent>
      <Typography gutterBottom>{props.mealData.meal.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {capitalize(props.mealData.meal.mealTime)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {props.mealData.meal.description}
      </Typography>
    </CardContent>
    <Grid item container className={scheduledOrderMealCard.actionsContainer}>
      <Grid item className={scheduledOrderMealCard.childContainer}>
        <CardActions>
          <Grid
            container
            className={scheduledOrderMealCard.iconButtonContainer}
          >
            <Grid item>
              <IconButton
                id={`remove-${props.mealData.extendedScheduledOrderMeal.id}`}
                onClick={() =>
                  props.handleRemoveScheduledOrderMeal(props.mealData)
                }
                disabled={props.cantMakeChanges}
                className={
                  props.cantMakeChanges
                    ? scheduledOrderMealCard.iconButton + 'Mui-disabled'
                    : scheduledOrderMealCard.iconButton
                }
              >
                <RemoveCircleIcon className={scheduledOrderMealCard.icon} />
              </IconButton>
            </Grid>

            <Grid item>
              <Typography>{props.mealData.quantity} in your box</Typography>
            </Grid>
            <Grid item>
              <IconButton
                id={`add-${props.mealData.extendedScheduledOrderMeal.id}`}
                onClick={() =>
                  props.handleAddScheduledOrderMeal(props.mealData)
                }
                disabled={props.cantMakeChanges}
                className={
                  props.cantMakeChanges
                    ? scheduledOrderMealCard.iconButton + 'Mui-disabled'
                    : scheduledOrderMealCard.iconButton
                }
              >
                <AddCircleIcon className={scheduledOrderMealCard.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </CardActions>
      </Grid>
    </Grid>
  </Card>
);
export default ScheduledOrderMealCard;
