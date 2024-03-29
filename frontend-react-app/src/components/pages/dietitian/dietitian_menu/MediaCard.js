import React from 'react';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import NutritionDetails from './nutrition_details/NutritionDetails';
import { FoodCard } from '../../../shared_components/FoodCard';
import mediaCard from './scss/MediaCard.module.scss';
import IngredientList from './ingredients/IngredientList';
const MediaCard = React.memo(
  (props) => {
    const childComponent = (() => {
      if (props.shouldDisplayNutritionDetails) {
        return (
          <Grid item container className={mediaCard.actionsContainer}>
            <Grid container item className={mediaCard.childContainer}>
              <CardActions>
                <Grid container className={mediaCard.iconButtonContainer}>
                  <>
                    <NutritionDetails
                      isSnackCard={props.isSnackCard ?? false}
                      mealPlanMeal={props.mealPlanMeal}
                      name={props.name}
                    ></NutritionDetails>
                    <IngredientList
                      ingredientItems={props.mealPlanMeal.recipe}
                    ></IngredientList>
                  </>
                </Grid>
              </CardActions>
            </Grid>
          </Grid>
        );
      } else {
        return <></>;
      }
    })();
    return (
      <FoodCard
        mealName={props.name}
        mealTime={props.mealTime}
        mealDescription={props.description}
        mealImageUrl={props.imageUrl}
        isSnackCard={props.isSnackCard ?? false}
        childComponent={childComponent}
      />
    );
  },
  (prevProps, props) => {
    if (prevProps.shouldDisplayNutritionDetails) {
      if (prevProps.mealPlanMeal.id !== props.mealPlanMeal.id) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
);
export default MediaCard;
