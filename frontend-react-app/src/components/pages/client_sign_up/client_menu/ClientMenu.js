import { v4 as uuid } from 'uuid';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import capitalize from '../../../../helpers/capitalize';
import LocalStorageManager from '../../../../helpers/LocalStorageManager';
import APIClient from '../../../../helpers/APIClient';
import ScheduleMeal from '../../../../data_models/model/ScheduleMeal';
import ScheduleMealDTO from '../../../../data_models/dto/ScheduleMealDTO';
import ScheduledOrderMealDTO from '../../../../data_models/dto/ScheduledOrderMealDTO';
import ExtendedScheduleMeal from '../../../../data_models/model/ExtendedScheduleMeal';
import ScheduleSnack from '../../../../data_models/model/ScheduleSnack';
import ScheduleSnackDTO from '../../../../data_models/dto/ScheduleSnackDTO';
import ScheduledOrderSnackDTO from '../../../../data_models/dto/ScheduledOrderSnackDTO';
import ExtendedScheduleSnack from '../../../../data_models/model/ExtendedScheduleSnack';
import ExtendedMealFactory from '../../../../data_models/factories/model/ExtendedMealFactory';
import MealDietaryRestrictionFactory from '../../../../data_models/factories/model/MealDietaryRestrictionFactory';
import createScheduledOrderMeals from '../helpers/createScheduledOrderMeals';
import createScheduledOrderSnacks from '../helpers/createScheduledOrderSnacks';
import SideBar from './SideBar';
import MediaCard from './MediaCard';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import SnackCard from './SnackCard';
import SnackFactory from '../../../../data_models/factories/model/SnackFactory';
import StagedScheduleMeal from '../../../../data_models/model/StagedScheduleMeal';
import ExtendedStagedScheduleMeal from '../../../../data_models/model/ExtendedStagedScheduleMeal';
import StagedScheduleSnack from '../../../../data_models/model/StagedScheduleSnack';
import ExtendedStagedScheduleSnack from '../../../../data_models/model/ExtendedStagedScheduleSnack';
import checkMinimumMealQuantity from './helpers/checkMinimumMealQuantity';
import { getMealPrice } from './helpers/getMealPrice';
import { getNumBoxes } from './helpers/getNumBoxes';

const ClientMenu = (props) => {
  const customTheme = useTheme();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(true);
  const [filterMealTime, setFilterMealTime] = useState('all');
  const [filterMealPreferences, setFilterMealPreferences] = useState('all');
  const [extendedMeals, setExtendedMeals] = useState(props.extendedMeals);
  const [chosenScheduleMeals, setChosenScheduleMeals] = useState([]);
  const [chosenScheduleSnacks, setChosenScheduleSnacks] = useState([]);
  const mealTimes = ['breakfast', 'lunch', 'dinner'];
  const mealsByDietaryRestrictionMap = (() => {
    const mealsByDietaryRestrictionMapToReturn = new Map();
    props.extendedMeals.forEach((meal) => {
      meal.dietaryRestrictions.forEach((dietaryRestriction) => {
        if (
          !mealsByDietaryRestrictionMapToReturn.has(
            dietaryRestriction.dietaryRestrictionId
          )
        ) {
          const mealSet = new Set();
          mealSet.add(meal.id);
          mealsByDietaryRestrictionMapToReturn.set(
            dietaryRestriction.dietaryRestrictionId,
            mealSet
          );
        } else {
          mealsByDietaryRestrictionMapToReturn
            .get(dietaryRestriction.dietaryRestrictionId)
            .add(meal.id);
        }
      });
    });
    return mealsByDietaryRestrictionMapToReturn;
  })();
  const mealsByMealTimeMap = (() => {
    const mealsByMealTimeMapToReturn = new Map();
    props.extendedMeals.forEach((meal) => {
      if (!mealsByMealTimeMapToReturn.has(meal.mealTime)) {
        const mealSet = new Set();
        mealSet.add(meal.id);
        mealsByMealTimeMapToReturn.set(meal.mealTime, mealSet);
      } else {
        mealsByMealTimeMapToReturn.get(meal.mealTime).add(meal.id);
      }
    });
    return mealsByMealTimeMapToReturn;
  })();

  const timer = useRef();

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleFilterChange = (event) => {
    // Meal time filter selected
    if (event.target.name === 'filterMealTime') {
      setFilterMealTime(event.target.value);
      // No meal time filter
      if (event.target.value === 'all') {
        // No meal time and no dietary restriction filter
        if (filterMealPreferences === 'all') {
          setExtendedMeals(props.extendedMeals);
        } else {
          // No meal time filter, dietary restriction filter
          const filteredExtendedMeals = props.extendedMeals.filter(
            (extendedMeal) =>
              mealsByDietaryRestrictionMap
                .get(filterMealPreferences)
                ?.has(extendedMeal.id)
          );
          setExtendedMeals(filteredExtendedMeals);
        }
      } else {
        // Meal time filter
        if (filterMealPreferences === 'all') {
          // Meal time filter, no dietary restriction filter
          const filteredExtendedMeals = props.extendedMeals.filter(
            (extendedMeal) =>
              mealsByMealTimeMap.get(event.target.value)?.has(extendedMeal.id)
          );
          setExtendedMeals(filteredExtendedMeals);
        } else {
          const timeFilteredExtendedMeals = props.extendedMeals.filter(
            (extendedMeal) =>
              mealsByMealTimeMap.get(event.target.value)?.has(extendedMeal.id)
          );
          const filteredExtendedMeals = timeFilteredExtendedMeals.filter(
            (extendedMeal) =>
              mealsByDietaryRestrictionMap
                .get(filterMealPreferences)
                ?.has(extendedMeal.id)
          );
          // Meal time and dietary restriction filter
          setExtendedMeals(filteredExtendedMeals);
        }
      }
    }
    // Dietary restriction filter selected
    else {
      setFilterMealPreferences(event.target.value);
      // No dietary restriction filter
      if (event.target.value === 'all') {
        // No dietary restriction nor meal time filter
        if (filterMealTime === 'all') {
          setExtendedMeals(props.extendedMeals);
        } else {
          // No dietary restriction filter, meal time filter
          const filteredExtendedMeals = props.extendedMeals.filter(
            (extendedMeal) =>
              mealsByMealTimeMap.get(filterMealTime)?.has(extendedMeal.id)
          );
          setExtendedMeals(filteredExtendedMeals);
        }
      } else {
        // Dietary restriction filter
        if (filterMealTime === 'all') {
          // Dietary restriction filter and no meal time filter
          const filteredExtendedMeals = props.extendedMeals.filter(
            (extendedMeal) =>
              mealsByDietaryRestrictionMap
                .get(event.target.value)
                ?.has(extendedMeal.id)
          );
          setExtendedMeals(filteredExtendedMeals);
        } else {
          // Dietary restriction and meal time filter
          const timeFilteredExtendedMeals = props.extendedMeals.filter(
            (extendedMeal) =>
              mealsByMealTimeMap.get(filterMealTime)?.has(extendedMeal.id)
          );
          const filteredExtendedMeals = timeFilteredExtendedMeals.filter(
            (extendedMeal) =>
              mealsByDietaryRestrictionMap
                .get(event.target.value)
                ?.has(extendedMeal.id)
          );
          setExtendedMeals(filteredExtendedMeals);
        }
      }
    }
  };

  const handleAddMeal = (meal) => {
    const maxMeals = props.cogs.reduce((highest, current) => {
      return current.numMeals > highest.numMeals ? current : highest;
    }).numMeals;
    if (chosenScheduleMeals.length >= maxMeals) {
      return;
    }
    setChosenScheduleMeals((prevChosenMeal) => {
      const newScheduleMeal = (() => {
        const scheduleMealId = uuid();
        // Dynamically construct the correct type of schedule meal based on whether the dietitian is choosing meals for a client or for a meal subscription
        if (props.dietitianChoosingClientMeals) {
          return new StagedScheduleMeal({
            id: scheduleMealId,
            mealId: meal.id,
            stagedClientId: props.stagedClientId,
          });
        } else {
          return ScheduleMeal.initializeFromMeal(
            scheduleMealId,
            meal.id,
            props.mealSubscriptionId
          );
        }
      })();
      const newExtendedScheduleMeal = (() => {
        if (props.dietitianChoosingClientMeals) {
          return ExtendedStagedScheduleMeal.constructFromStagedScheduleMeal(
            newScheduleMeal,
            meal,
            new ExtendedMealFactory(new MealDietaryRestrictionFactory())
          );
        } else {
          return ExtendedScheduleMeal.constructFromScheduleMeal(
            newScheduleMeal,
            meal,
            new ExtendedMealFactory(new MealDietaryRestrictionFactory())
          );
        }
      })();

      return [...prevChosenMeal, newExtendedScheduleMeal];
    });
  };
  const handleRemoveMeal = (scheduleMeal) => {
    setChosenScheduleMeals((prevChosenMeal) =>
      prevChosenMeal.filter((prevScheduleMeal) => {
        return prevScheduleMeal.id !== scheduleMeal.id;
      })
    );
  };
  const handleAddSnack = (snack) => {
    setChosenScheduleSnacks((prevChosenSnack) => {
      const firstNewScheduleSnack = (() => {
        const scheduleSnackId = uuid();
        if (props.dietitianChoosingClientMeals) {
          return new StagedScheduleSnack({
            id: scheduleSnackId,
            snackId: snack.id,
            stagedClientId: props.stagedClientId,
          });
        } else {
          return ScheduleSnack.initializeFromSnack(
            uuid(),
            snack.id,
            props.mealSubscriptionId
          );
        }
      })();
      const secondNewScheduleSnack = (() => {
        const scheduleSnackId = uuid();
        if (props.dietitianChoosingClientMeals) {
          return new StagedScheduleSnack({
            id: scheduleSnackId,
            snackId: snack.id,
            stagedClientId: props.stagedClientId,
          });
        } else {
          return ScheduleSnack.initializeFromSnack(
            uuid(),
            snack.id,
            props.mealSubscriptionId
          );
        }
      })();
      const firstNewExtendedScheduleSnack = (() => {
        if (props.dietitianChoosingClientMeals) {
          return ExtendedStagedScheduleSnack.constructFromStagedScheduleSnack(
            firstNewScheduleSnack,
            snack,
            new SnackFactory()
          );
        } else {
          return ExtendedScheduleSnack.constructFromScheduleSnack(
            firstNewScheduleSnack,
            snack,
            new SnackFactory()
          );
        }
      })();
      const secondNewExtendedScheduleSnack = (() => {
        if (props.dietitianChoosingClientMeals) {
          return ExtendedStagedScheduleSnack.constructFromStagedScheduleSnack(
            secondNewScheduleSnack,
            snack,
            new SnackFactory()
          );
        } else {
          return ExtendedScheduleSnack.constructFromScheduleSnack(
            secondNewScheduleSnack,
            snack,
            new SnackFactory()
          );
        }
      })();
      return [
        ...prevChosenSnack,
        firstNewExtendedScheduleSnack,
        secondNewExtendedScheduleSnack,
      ];
    });
  };
  const handleRemoveSnack = (scheduleSnack) => {
    setChosenScheduleSnacks((prevChosenSnack) => {
      let removedScheduleSnacks = 0;
      let prevChosenSnackCopy = [...prevChosenSnack];
      let index = 0;
      while (removedScheduleSnacks < 2 && index < prevChosenSnack.length) {
        const prevScheduleSnack = prevChosenSnack[index];
        if (prevScheduleSnack.snackId === scheduleSnack.snackId) {
          prevChosenSnackCopy = prevChosenSnackCopy.filter(
            (prev) => prev.id !== prevScheduleSnack.id
          );
          removedScheduleSnacks += 1;
        }
        index += 1;
      }
      return prevChosenSnackCopy;
    });
  };

  const handleSubmit = async () => {
    setEditing(false);
    if (!checkMinimumMealQuantity(false, chosenScheduleMeals)) {
      return false;
    }
    if (!loading) {
      setLoading(true);
    }
    const minNumItems = props.cogs.reduce((lowest, current) => {
      return current.numMeals < lowest.numMeals ? current : lowest;
    }).numMeals;

    const numItems = (() => {
      if (
        chosenScheduleMeals.length + chosenScheduleSnacks.length <=
        minNumItems
      ) {
        return minNumItems;
      } else {
        return chosenScheduleMeals.length + chosenScheduleSnacks.length / 2;
      }
    })();

    const numBoxes = getNumBoxes(numItems, minNumItems);
    const mealPrice = getMealPrice(
      props.cogs,
      props.shippingRate,
      numItems,
      numBoxes
    );
    if (!props.dietitianChoosingClientMeals) {
      // Client choosing meals
      const newScheduledOrderMeals = createScheduledOrderMeals(
        chosenScheduleMeals,
        props.changingMeals && props.canChangeFirstWeek ? true : false
      );

      const scheduledOrderSnacks = (() => {
        if (chosenScheduleSnacks.length > 0) {
          return createScheduledOrderSnacks(
            chosenScheduleSnacks,
            props.changingMeals && props.canChangeFirstWeek ? true : false
          );
        } else {
          return [];
        }
      })();
      if (props.changingMeals) {
        //  Delete meals
        await APIClient.deleteScheduleMeals(
          LocalStorageManager.shared.clientMealSubscription.id
        );
        await APIClient.deleteScheduledOrderMeals(
          LocalStorageManager.shared.clientMealSubscription.id
        );
        if (props.hasSnacks) {
          // Delete snacks
          await APIClient.deleteScheduleSnacks(
            LocalStorageManager.shared.clientMealSubscription.id
          );
          await APIClient.deleteScheduledOrderSnacks(
            LocalStorageManager.shared.clientMealSubscription.id
          );
        }

        // Create meals
        const scheduleMealDTOs = chosenScheduleMeals.map((scheduleMeal) =>
          ScheduleMealDTO.initializeFromScheduleMeal(scheduleMeal)
        );
        await APIClient.createScheduleMeals(scheduleMealDTOs);

        const scheduledOrderMealDTOs = newScheduledOrderMeals.map(
          (scheduledOrderMeal) =>
            ScheduledOrderMealDTO.initializeFromScheduledOrderMeal(
              scheduledOrderMeal
            )
        );

        await APIClient.createScheduledOrderMeals(scheduledOrderMealDTOs);

        // Create snacks
        const scheduleSnackDTOs = chosenScheduleSnacks.map((scheduleSnack) =>
          ScheduleSnackDTO.initializeFromScheduleSnack(scheduleSnack)
        );
        await APIClient.createScheduleSnacks(scheduleSnackDTOs);
        const scheduledOrderSnackDTOs = scheduledOrderSnacks.map(
          (scheduledOrderSnack) =>
            ScheduledOrderSnackDTO.initializeFromScheduledOrderSnack(
              scheduledOrderSnack
            )
        );

        await APIClient.createScheduledOrderSnacks(scheduledOrderSnackDTOs);

        // Update stripe subscription with new numMeals and numSnacks
        await APIClient.updateStripeSubscription(
          LocalStorageManager.shared.clientMealSubscription.id,
          chosenScheduleMeals.length,
          chosenScheduleSnacks.length
        );

        timer.current = window.setTimeout(() => {
          setLoading(false);
          props.finishEditing();
        }, 500);
      } else {
        const scheduledOrderMeals = createScheduledOrderMeals(
          chosenScheduleMeals,
          true
        );
        const scheduledOrderSnacks = createScheduledOrderSnacks(
          chosenScheduleSnacks,
          true
        );
        timer.current = window.setTimeout(() => {
          setLoading(false);
          LocalStorageManager.shared.taskIndex += 1;
          props.updateMealsData(
            chosenScheduleMeals,
            scheduledOrderMeals,
            chosenScheduleSnacks,
            scheduledOrderSnacks,
            mealPrice
          );
        }, 500);
      }
    } else {
      // Dietitian choosing meals
      props.onSubmit(chosenScheduleMeals, chosenScheduleSnacks, mealPrice);
    }
  };
  return (
    <Grid
      container
      paddingLeft={'4vw'}
      paddingRight={'4vw'}
      paddingBottom={'10vh'}
      // Removes extra 'purple' space in view layout in chrome dev tools.
      alignItems="flex-start"
      paddingTop="5vh"
      backgroundColor={customTheme.palette.olive.secondary}
    >
      {/* Meals Cards */}
      <Grid
        container
        item
        md={8.5}
        lg={9.5}
        xs={12}
        marginBottom={customTheme.smallerScreen() ? '6vh' : ''}
        justifyContent={'center'}
        sx={{
          paddingRight: '2vw',
          borderRight: `solid 2px ${customTheme.palette.olive.main}`,
        }}
      >
        <Grid item container spacing={2} marginBottom="5vh">
          <Grid item container justifyContent={'flex-start'}>
            <Typography
              fontSize={'1.5rem'}
              textAlign={'center'}
              marginBottom={'2vh'}
              marginTop={'2vh'}
              color={customTheme.palette.olive.main}
            >
              Meals
            </Typography>
          </Grid>
          <Grid item lg={2} md={3} xs={5.5}>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: customTheme.palette.black.main,
                  fontWeight: 'bold',
                }}
              >
                Meal Time
              </InputLabel>
              <Select
                label="Meal Category"
                required
                name="filterMealTime"
                value={filterMealTime}
                onChange={handleFilterChange}
              >
                {mealTimes.map((mealTime, i) => (
                  <MenuItem key={`mealTimeMenuItem${i}`} value={mealTime}>
                    {capitalize(mealTime)}
                  </MenuItem>
                ))}
                {<MenuItem value={'all'}>All</MenuItem>}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={2} md={3} xs={5.5}>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  fontWeight: 'bold',
                  color: customTheme.palette.black.main,
                }}
              >
                Preferences
              </InputLabel>
              <Select
                label="Preferences"
                required
                name="filterMealPreferences"
                value={filterMealPreferences}
                onChange={handleFilterChange}
              >
                <MenuItem value={'vegetarian'}>Vegetarian</MenuItem>
                <MenuItem value={'all'}>All</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={6} md={8} xs={10} ml={2}>
            <FormHelperText
              hidden={
                !checkMinimumMealQuantity(editing, chosenScheduleMeals)
                  ? false
                  : true
              }
              error={true}
              sx={{
                fontSize: '1rem',
              }}
            >
              {`You must select a minimum of ${
                props.cogs.reduce((lowest, current) => {
                  return current.numMeals < lowest.numMeals ? current : lowest;
                }).numMeals
              } meals. Please add ${
                props.cogs.reduce((lowest, current) => {
                  return current.numMeals < lowest.numMeals ? current : lowest;
                }).numMeals - chosenScheduleMeals.length
              } more`}
            </FormHelperText>
          </Grid>
        </Grid>
        <Grid container item spacing={4} mb={'5vh'}>
          {extendedMeals.map((extendedMeal, i) => (
            <Grid item key={`mealGridItem${i}`} md={4}>
              {MediaCard({
                key: `mealMediaCard${i}`,
                meal: extendedMeal,
                index: i,
                handleAddMeal: (meal) => handleAddMeal(meal),
              })}
            </Grid>
          ))}
        </Grid>
        {/* Snack Cards */}
        <Grid item container justifyContent={'flex-start'}>
          <Typography
            fontSize={'1.5rem'}
            textAlign={'center'}
            marginBottom={'5vh'}
            marginTop={'2vh'}
            color={customTheme.palette.olive.main}
          >
            Snacks
          </Typography>
          <Grid item>
            <Tooltip
              title="Optional, ordered in quantities of 2"
              placement="right"
              sx={{
                color: customTheme.palette.olive.main,
              }}
            >
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container item spacing={7}>
          {props.snacks.map((snack, i) => (
            <Grid item key={`snackGridItem${i}`} md={4}>
              {SnackCard({
                key: `snackMediaCard${i}`,
                snack: snack,
                index: i,
                handleAddSnack: (snack) => handleAddSnack(snack),
              })}
            </Grid>
          ))}
        </Grid>
        {/* Snack Cards */}
      </Grid>

      {/* Side Bar */}
      <Grid item lg={2.5} md={3.5} xs={12}>
        <SideBar
          chosenScheduleMeals={chosenScheduleMeals}
          chosenScheduleSnacks={chosenScheduleSnacks}
          handleSubmit={handleSubmit}
          handleAddMeal={(newMeal) => handleAddMeal(newMeal)}
          handleAddSnack={(newSnack) => handleAddSnack(newSnack)}
          handleRemoveMeal={(removedMeal) => handleRemoveMeal(removedMeal)}
          handleRemoveSnack={(removedSnack) => handleRemoveSnack(removedSnack)}
          customTheme={customTheme}
          loading={loading}
          editMeals={props.changingMeals}
          cogs={props.cogs}
          shippingRate={props.shippingRate}
        />
      </Grid>
      {/* Side Bar */}
    </Grid>
  );
};
export default ClientMenu;
