import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Icon from '@mui/material/Icon';
import DeliveryDateUtility from '../../../../helpers/DeliveryDateUtility';
import capitalize from '../../../../helpers/capitalize';
import BlackButton from '../../../shared_components/BlackButton.ts';
import getOrderSubtotal from './helpers/getOrderSubtotal';
import BlueCircularProgress from '../../../shared_components/BlueCircularProgress';
import { getMealPrice } from './helpers/getMealPrice';

const SideBar = (props) => {
  const breakfastMeals = props.chosenScheduleMeals.filter(
    (chosenMeal) => chosenMeal.associatedMeal.mealTime === 'breakfast'
  );
  const lunchMeals = props.chosenScheduleMeals.filter(
    (chosenMeal) => chosenMeal.associatedMeal.mealTime === 'lunch'
  );
  const dinnerMeals = props.chosenScheduleMeals.filter(
    (chosenMeal) => chosenMeal.associatedMeal.mealTime === 'dinner'
  );
  const mealsByMealTime = [
    {
      mealTime: 'breakfast',
      meals: breakfastMeals,
    },
    {
      mealTime: 'lunch',
      meals: lunchMeals,
    },
    {
      mealTime: 'dinner',
      meals: dinnerMeals,
    },
  ];
  const minCostPerMeal = props.cogs.reduce((lowest, current) => {
    return current.costPerMeal < lowest.costPerMeal ? current : lowest;
  });
  // Lowest per meal cost will always be the max items per box
  const itemsPerBox = minCostPerMeal.numMeals;
  const minPricePerMeal = getMealPrice(
    props.cogs,
    props.shippingRate,
    itemsPerBox
  );
  const minNumMeals = props.cogs.reduce((lowest, current) => {
    return current.numMeals < lowest.numMeals ? current : lowest;
  }).numMeals;

  // Meals + snacks / 2
  const currentNumItems = (() => {
    if (
      props.chosenScheduleMeals.length + props.chosenScheduleSnacks.length <=
      minNumMeals
    ) {
      return minNumMeals;
    } else {
      return (
        props.chosenScheduleMeals.length + props.chosenScheduleSnacks.length / 2
      );
    }
  })();

  const currentPricePerMeal = getMealPrice(
    props.cogs,
    props.shippingRate,
    currentNumItems
  );
  const isLowest = currentPricePerMeal === minPricePerMeal;
  const mealsToAdd = (() => {
    // If currentNumItems is greater than itemsPerBox, then we need to find the next number of meals with the same low price as itemsPerBox
    const closestNumMealsForLowestPrice = (() =>
      // Find the next lowest price per meal
      // If there is no next lowest price per meal, then we need to add the num meals for two times the itemsPerBox
      {
        const lowestPricedMeals = props.cogs.filter((meal) => {
          return (
            getMealPrice(props.cogs, props.shippingRate, meal.numMeals) ===
            minPricePerMeal
          );
        });

        const validMeals = lowestPricedMeals.filter((meal) => {
          return meal.numMeals > currentNumItems;
        });

        if (validMeals.length > 0) {
          return validMeals.reduce((prev, curr) => {
            return curr.numMeals < prev.numMeals ? curr : prev;
          }).numMeals;
        } else {
          return itemsPerBox * (Math.floor(currentNumItems / itemsPerBox) + 1);
        }
      })();
    return Math.abs(currentNumItems - closestNumMealsForLowestPrice);
  })();
  return (
    <Grid container paddingLeft={'2vw'}>
      <Grid item xs={12}>
        <Typography
          fontSize={'1rem'}
          textAlign={'left'}
          margin={'0 auto'}
          paddingBottom={'2vh'}
        >
          Delivery for{' '}
          <strong>
            Sunday,{' '}
            {`${
              DeliveryDateUtility.months[
                DeliveryDateUtility.getDeliveryDateFromIndex(0).getMonth()
              ]
            } ${DeliveryDateUtility.getDeliveryDateFromIndex(0).getDate()}`}
          </strong>
        </Typography>
      </Grid>

      <Grid container item>
        <Grid item xs={12}>
          {mealsByMealTime.map((mealTimeObject, i) => (
            <div
              key={`mealsByTimeDiv${i}`}
              style={{
                borderBottom: `solid 2px ${props.customTheme.palette.olive.main}`,
                marginBottom: '3vh',
              }}
            >
              <Typography
                fontSize={'.9rem'}
                fontStyle={'italic'}
                key={`mealsByTimeTypo${i}`}
              >
                {`${capitalize(mealTimeObject.mealTime)}:`}{' '}
              </Typography>
              <Stack key={`stack1${i}`}>
                {mealTimeObject.meals.map((chosenMeal, j) => (
                  <Grid
                    item
                    container
                    xs={12}
                    alignItems={'center'}
                    paddingBottom={'1vh'}
                    key={`mealTimeObjectGridContainer${i}${j}`}
                  >
                    <Grid item xs={9} key={`mealTimeObjectGrid9${i}${j}`}>
                      <Typography
                        fontSize={'.9rem'}
                        key={`mealTimeObjectTypo${i}${j}`}
                        fontWeight={'bold'}
                      >
                        {chosenMeal.associatedMeal.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} key={`mealTimeObjectGrid3${i}${j}`}>
                      {/*  stack is a grid with direction column, so alignItems aligns along the x-axis */}
                      <Stack
                        alignItems={'flex-end'}
                        spacing={1}
                        key={`mealTimeObjectStack${i}${j}`}
                      >
                        {!props.preSelectedMeals && !props.prepaidMeals && (
                          <>
                            <Icon
                              key={`icon1${i}${j}`}
                              onClick={() =>
                                props.handleAddMeal(chosenMeal.associatedMeal)
                              }
                              sx={{
                                color: `${props.customTheme.palette.olive.main}`,
                                cursor: 'pointer',
                              }}
                            >
                              add
                            </Icon>
                            <Icon
                              key={`removeMealIcon${i}${j}`}
                              onClick={() => props.handleRemoveMeal(chosenMeal)}
                              sx={{
                                color: `${props.customTheme.palette.darkGrey.secondary}`,
                                cursor: 'pointer',
                              }}
                            >
                              remove
                            </Icon>
                          </>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </div>
          ))}
        </Grid>
        <Grid item xs={12}>
          <div
            style={{
              borderBottom: `solid 2px ${props.customTheme.palette.olive.main}`,
              marginBottom: '3vh',
            }}
          >
            <Typography fontSize={'.9rem'} textAlign={'left'} margin={'0 auto'}>
              Snacks:
            </Typography>
            {props.chosenScheduleSnacks.map((chosenSnack, k) => (
              <Grid
                item
                container
                xs={12}
                alignItems={'center'}
                paddingBottom={'1vh'}
                key={`snackGridContainer${k}`}
              >
                <Grid item xs={9} key={`snackGrid9${k}`}>
                  <Typography
                    fontSize={'.9rem'}
                    key={`mealTimeObjectTypo${k}`}
                    fontWeight={'bold'}
                  >
                    {chosenSnack.associatedSnack.name}
                  </Typography>
                </Grid>
                <Grid item xs={3} key={`mealTimeObjectGrid3${k}`}>
                  <Stack
                    alignItems={'flex-end'}
                    spacing={1}
                    key={`mealTimeObjectStack${k}`}
                  >
                    <Icon
                      key={`icon1${k}`}
                      onClick={() =>
                        props.handleAddSnack(chosenSnack.associatedSnack)
                      }
                      sx={{
                        color: `${props.customTheme.palette.olive.main}`,
                        cursor: 'pointer',
                      }}
                    >
                      add
                    </Icon>
                    <Icon
                      key={`removeSnackIcon${k}`}
                      onClick={() => props.handleRemoveSnack(chosenSnack)}
                      sx={{
                        color: `${props.customTheme.palette.darkGrey.secondary}`,
                        cursor: 'pointer',
                      }}
                    >
                      remove
                    </Icon>
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography
            fontSize={'1rem'}
            textAlign={'left'}
            margin={'0 auto'}
            paddingTop={'1vh'}
            fontWeight={'bold'}
          >
            Order Summary
          </Typography>
        </Grid>
        <Grid
          container
          sx={{
            marginBottom: '5vh',
            paddingTop: '1vh',
          }}
          rowSpacing={2}
        >
          {props.chosenScheduleMeals.length > 0 && (
            <Grid item xs={12}>
              <Typography fontSize={'1rem'} textAlign={'left'}>
                {`${props.chosenScheduleMeals.length} meals`}
              </Typography>
            </Grid>
          )}

          {props.chosenScheduleMeals.length >= minNumMeals && !isLowest && (
            <Grid item xs={12}>
              <Typography
                fontSize={'1rem'}
                textAlign={'left'}
                variant="body2"
                sx={{
                  color: `${props.customTheme.palette.olive.main}`,
                }}
              >
                {`Add ${mealsToAdd} meal${
                  mealsToAdd > 1 ? 's' : ''
                } to get a discount!`}
              </Typography>
            </Grid>
          )}
          {props.chosenScheduleSnacks.length > 0 && (
            <Grid item xs={12}>
              <Typography fontSize={'1rem'} textAlign={'left'}>
                {`${props.chosenScheduleSnacks.length} snacks`}
              </Typography>
            </Grid>
          )}

          <Grid item xs={5}>
            <Typography fontSize={'1rem'} textAlign={'left'}>
              {`Total: $${getOrderSubtotal(
                getMealPrice(props.cogs, props.shippingRate, currentNumItems),
                props.chosenScheduleMeals,
                props.chosenScheduleSnacks
              ).toFixed(2)}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            marginBottom: '5vh',
            paddingTop: '1vh',
          }}
        >
          <BlackButton
            id="client-menu-submit"
            variant="contained"
            type={'submit'}
            disabled={props.loading}
            onClick={props.handleSubmit}
            sx={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '100%',
              paddingTop: '1vh',
              paddingBottom: '1vh',
              marginTop: '3vh',
              borderRadius: '30px',
              backgroundColor: `${props.customTheme.palette.olive.main}`,
              color: `${props.customTheme.palette.white1.main}`,
            }}
          >
            {props.loading ? (
              <BlueCircularProgress />
            ) : !props.editMeals ? (
              'Next'
            ) : (
              'Confirm'
            )}
          </BlackButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SideBar;
