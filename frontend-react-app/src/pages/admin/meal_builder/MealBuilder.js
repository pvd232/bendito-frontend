import { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import APIClient from '../../../helpers/APIClient';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import BlackButton from '../../../reusable_ui_components/BlackButton';
import RowBorder from '../../dietitian/dietitian_menu/nutrition_details/RowBorder';
import capitalize from '../../../helpers/capitalize';
import IngredientRow from './IngredientRow';
import { v4 as uuid } from 'uuid';
import LocalStorageManager from '../../../helpers/LocalStorageManager';
import OrangeSwitch from './OrangeSwitch';
import MealPlanMealDTO from '../../../data_models/dto/MealPlanMealDTO';
import RecipeIngredientDTO from '../../../data_models/dto/RecipeIngredientDTO';
import createMealData from './helpers/createMealData';
import BlueCircularProgress from '../../../reusable_ui_components/BlueCircularProgress';
import MealCard from './MealCard';
import updateUSDAIngredients from './helpers/updateUSDAIngredients';
import { CircularProgress } from '@mui/material';
const MealBuilder = () => {
  const [mealName, setMealName] = useState(
    LocalStorageManager.shared.savedMealBuilderMeal
      ? LocalStorageManager.shared.savedMealBuilderMeal.mealName
      : ''
  );
  const [mealTime, setMealTime] = useState(
    LocalStorageManager.shared.savedMealBuilderMeal
      ? LocalStorageManager.shared.savedMealBuilderMeal.mealTime
      : ''
  );
  const [mealDescription, setMealDescription] = useState(
    LocalStorageManager.shared.savedMealBuilderMeal
      ? LocalStorageManager.shared.savedMealBuilderMeal.mealDescription
      : ''
  );
  const [mealPrice, setMealPrice] = useState(0);
  const [isVegetarian, setIsVegetarian] = useState(
    LocalStorageManager.shared.savedMealBuilderMeal
      ? LocalStorageManager.shared.savedMealBuilderMeal.isVegetarian
      : false
  );
  const [imageUrl, setImageUrl] = useState(
    LocalStorageManager.shared.savedMealBuilderMeal
      ? LocalStorageManager.shared.savedMealBuilderMeal.imageUrl
      : ''
  );
  const [mealIngredients, setMealIngredients] = useState(
    LocalStorageManager.shared.savedMealBuilderMeal
      ? LocalStorageManager.shared.savedMealBuilderMeal.mealIngredients
      : []
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  const [extendedUsdaIngredients, setExtendedUsdaIngredients] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    updateUSDAIngredients({
      mounted: mounted,
      setExtendedUsdaIngredients: setExtendedUsdaIngredients,
      setMealPrice: setMealPrice,
      setDietaryRestrictions: setDietaryRestrictions,
      setMealPlans: setMealPlans,
    });

    return () => (mounted = false);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const mealId = uuid();

    const [newMealDTO, newMealDietaryRestrictionDTO] = createMealData(
      mealId,
      dietaryRestrictions,
      mealName,
      mealTime,
      mealPrice,
      mealDescription,
      isVegetarian
    );
    await APIClient.createMeal(newMealDTO);

    if (newMealDietaryRestrictionDTO) {
      await APIClient.createMealDietaryRestriction(
        newMealDietaryRestrictionDTO
      );
    }

    for (const mealPlan of mealPlans) {
      const mealPlanMealDTO = new MealPlanMealDTO({
        id: uuid(),
        meal_id: mealId,
        meal_plan_id: mealPlan.id,
        active: true,
      });
      await APIClient.createMealPlanMeal(mealPlanMealDTO);
      const recipeIngredients = mealIngredients.map((ingredient) => {
        const newRecipeIngredientId = uuid();
        return new RecipeIngredientDTO({
          id: newRecipeIngredientId,
          usda_ingredient_id: ingredient.usdaIngredientId,
          meal_plan_meal_id: mealPlanMealDTO.id,
          usda_ingredient_portion_id: ingredient.usdaIngredientPortionId,
          quantity: ingredient.quantity,
          active: true,
        });
      });
      await APIClient.createRecipeIngredients(recipeIngredients);
      await APIClient.createRecipeIngredientNutrients(recipeIngredients);
    }
    setLoading(false);
    alert('Meal created!');
    LocalStorageManager.shared.deleteSavedMealBuilderMeal();
    window.location.reload();
  };
  const handleSave = () => {
    setSaveButtonLoading(true);
    const mealBuilderMeal = {
      mealName: mealName,
      mealTime: mealTime,
      mealDescription: mealDescription,
      mealPrice: mealPrice,
      isVegetarian: isVegetarian,
      dietaryRestrictions: dietaryRestrictions,
      imageUrl: imageUrl,
      mealIngredients: mealIngredients,
    };
    LocalStorageManager.shared.savedMealBuilderMeal = mealBuilderMeal;
    updateUSDAIngredients({
      mounted: true,
      setExtendedUsdaIngredients: setExtendedUsdaIngredients,
      setMealPrice: setMealPrice,
      setDietaryRestrictions: setDietaryRestrictions,
      setMealPlans: setMealPlans,
    }).then(() => setSaveButtonLoading(false));
  };

  const handleAddIngredient = (newIngredient) => {
    setMealIngredients([...mealIngredients, newIngredient]);
  };
  const handleRemoveIngredient = (index) => {
    setMealIngredients((prevMealIngredients) => {
      const newIngredients = [...prevMealIngredients];
      newIngredients.splice(index, 1);
      return newIngredients;
    });
  };
  const handleUpdateIngredient = (index, newIngredient) => {
    setMealIngredients((prevMealIngredients) => {
      const newMealIngredients = [...prevMealIngredients];
      newMealIngredients.splice(index, 1, newIngredient);
      return newMealIngredients;
    });
  };
  return (
    <Grid
      container
      paddingTop={'5vh'}
      paddingLeft={'3vw'}
      paddingRight={'3vw'}
      paddingBottom={'10vh'}
    >
      <Grid
        container
        item
        paddingTop={'6vh'}
        justifyContent={window.innerWidth < 450 ? 'center' : 'flex-start'}
        spacing={2}
      >
        <Grid item container>
          <Grid item>
            <Grid container item rowSpacing={4} columnGap={2}>
              <Grid item container justifyContent={'center'}>
                <Grid item>
                  <Typography variant="h4" fontWeight={'bold'}>
                    {'Meal Builder :)'}
                  </Typography>
                </Grid>
                <Grid container justifyContent={'flex-end'}>
                  <BlackButton onClick={handleSave}>
                    {saveButtonLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Save'
                    )}
                  </BlackButton>
                </Grid>
              </Grid>
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <Typography>Meal</Typography>
                </Grid>
                {/* Meal information */}
                <Grid item lg={2}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="mealName"
                    multiline
                    value={mealName}
                    onChange={(event) => {
                      setMealName(event.target.value);
                      setImageUrl(
                        event.target.value.toLowerCase().split(' ').join('_') +
                          '.jpg'
                      );
                    }}
                  />
                </Grid>

                <Grid item lg={5} sx={{ textAlign: 'right' }}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="mealDescription"
                    multiline
                    value={mealDescription}
                    onChange={(event) => setMealDescription(event.target.value)}
                  />
                </Grid>
                <Grid item lg={1.5} sx={{ textAlign: 'left' }}>
                  <FormControl fullWidth>
                    <InputLabel id="mealTimeLabel">Meal Time</InputLabel>
                    <Select
                      labelId="mealTimeLabel"
                      required
                      label="Meal Time"
                      name="mealTime"
                      value={mealTime}
                      onChange={(event) => setMealTime(event.target.value)}
                    >
                      {LocalStorageManager.shared.mealTimes.map((mealTime) => (
                        <MenuItem key={mealTime} value={mealTime}>
                          {capitalize(mealTime)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={2} sx={{ textAlign: 'right' }}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    name="imageURL"
                    multiline
                    value={imageUrl}
                  />
                </Grid>
                <Grid container item lg={1} alignItems="center">
                  <Grid item lg={2}>
                    <FormControlLabel
                      control={
                        <OrangeSwitch
                          checked={isVegetarian}
                          onChange={() => setIsVegetarian(!isVegetarian)}
                        />
                      }
                      label="Vegetarian"
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* Spacer */}
              <Grid item xs={12} paddingBottom={2}></Grid>
              {/* Ingredients */}

              <Grid container spacing={2}>
                {mealIngredients.map((ingredient, i) => (
                  <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    index={i}
                    updateIngredient={(newIngredient) =>
                      handleUpdateIngredient(i, newIngredient)
                    }
                    removeIngredient={() => handleRemoveIngredient(i)}
                    extendedUSDAIngredients={extendedUsdaIngredients}
                  />
                ))}
                <IngredientRow
                  index={mealIngredients.length + 1}
                  key={'newIngredient'}
                  updateIngredient={(newIngredient) =>
                    handleAddIngredient(newIngredient)
                  }
                  extendedUSDAIngredients={extendedUsdaIngredients}
                />
              </Grid>
              <Grid container justifyContent={'center'} paddingTop={4}>
                <Grid item paddingBottom={2}>
                  <MealCard
                    mealName={mealName}
                    mealTime={mealTime}
                    mealDescription={mealDescription}
                    imageUrl={imageUrl}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} marginY={'3vh'}>
            <RowBorder height={'2px'}></RowBorder>
          </Grid>
        </Grid>
        <Grid item xs={2} sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <BlackButton
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: '100%', padding: '1vh' }}
          >
            {loading ? <BlueCircularProgress /> : 'Submit'}
          </BlackButton>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MealBuilder;
