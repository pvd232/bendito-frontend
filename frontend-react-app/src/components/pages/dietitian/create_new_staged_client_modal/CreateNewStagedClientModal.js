import { useState, useReducer } from 'react';
import Grid from '@mui/material/Grid';
import { v4 as uuidv4 } from 'uuid';
import Icon from '@mui/material/Icon';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RedeemIcon from '@mui/icons-material/Redeem';
import APIClient from '../../../../helpers/APIClient';
import Transition from '../../../shared_components/Transition';
import StagedClient from '../../../../data_models/model/StagedClient';
import StagedScheduleMealDTO from '../../../../data_models/dto/StagedScheduleMealDTO';
import StagedScheduleSnackDTO from '../../../../data_models/dto/StagedScheduleSnackDTO';
import StagedClientDTO from '../../../../data_models/dto/StagedClientDTO';
import COGSDTO from '../../../../data_models/dto/COGSDTO';
import ClientMenu from '../../client_sign_up/client_menu/ClientMenu';
import SignUpSummary from '../SignUpSummary';
import ModalBody from './ModalBody';
import createNewStagedClientModal from './scss/CreateNewStagedClientModal.module.scss';
import { validateZipcode } from '../../client_sign_up/account_registration/helpers/validateZipcode';
import { Typography } from '@mui/material';
import { useWindowWidth } from '../../../hooks/useWindowWidth';
import ScreenSize from '../../../../types/enums/ScreenSize';

const CreateNewStagedClientModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [numberOfPrePaidMeals, setNumberOfPrePaidMeals] = useState(0);
  const [numberOfPrePaidSnacks, setNumberOfPrePaidSnacks] = useState(0);
  const [prepaidMeals, setPrepaidMeals] = useState([]);
  const [prepaidSnacks, setPrepaidSnacks] = useState([]);
  const [page, setPage] = useState('SignUp');
  const [zipcode, setZipcode] = useState('');
  const [cogs, setCogs] = useState('');
  const [mealPrice, setMealPrice] = useState(false);
  const [shippingRate, setShippingRate] = useState(false);
  const [zipcodeError, setZipcodeError] = useState(false);
  const [stagedClientId, setStagedClientId] = useState('');

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < ScreenSize.xs;

  const [formValue, setFormValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      // if the client secret exists then this page is being rerendered and all of these values have been inputted

      id: uuidv4(),
      email: '',
      dietitianId: props.dietitianId,
      firstName: '',
      mealPlanId: '',
      eatingDisorderId: '',
      currentWeight: 0,
      targetWeight: 0,
      age: 0,
      gender: '',
      notes: '',
      active: true,
      accountCreated: false,
      datetime: Date.now(),
      waitlisted: false,
      mealsPreSelected: false,
      mealsPrepaid: false,
    }
  );

  const resetFormValues = () => {
    const resetFormValues = {
      id: uuidv4(),
      email: '',
      dietitianId: props.dietitianId,
      firstName: '',
      mealPlanId: '',
      eatingDisorderId: '',
      currentWeight: 0,
      targetWeight: 0,
      age: 0,
      gender: '',
      notes: '',
      active: true,
      accountCreated: false,
      datetime: Date.now(),
      waitlisted: false,
      mealsPreSelected: false,
      mealsPrepaid: false,
    };
    setFormValue(resetFormValues);
  };

  const validate = async (form) => {
    const stagedClientExists = await APIClient.getStagedClient(
      false,
      formValue.email
    );
    const clientExists = await APIClient.getClient(formValue.email);
    const clientExistsAsDietitian = await APIClient.getDietitian(
      formValue.email
    );

    if (stagedClientExists || clientExistsAsDietitian || clientExists) {
      setError(true);
      return false;
    }
    const validZipcode = validateZipcode(zipcode);
    if (!validZipcode) {
      setZipcodeError(true);
    }

    setError(false);
    setZipcodeError(false);
    return form.checkValidity();
  };

  // Input handlers
  const handleButtonClick = async (
    scheduleMeals,
    scheduleSnacks,
    mealPrice = false
  ) => {
    const newStagedClient = new StagedClient(formValue);
    setStagedClientId(newStagedClient.id);

    // Regular client creation with no meals selected nor paid for
    if (!formValue.mealsPreSelected) {
      const newStagedClientDTO =
        StagedClientDTO.initializeFromStagedClient(newStagedClient);
      await APIClient.createStagedClient(newStagedClientDTO);
      props.handleFinishCreatingStagedClient(newStagedClient);
      resetFormValues();
      setLoading(false);
      setOpen(false);
      // Dietitian is selecting client meals, and has already filled out their info on the form and picked their meals
    } else if (formValue.mealsPreSelected && scheduleMeals) {
      // Meal price will be determined dynamically as the meals are being selected
      // Thus set the meal price after the dietitian has selected the meals
      setMealPrice(mealPrice);
      const newStagedClient = new StagedClient(formValue);
      const stagedScheduleMealDTOs = scheduleMeals.map((stagedScheduleMeal) =>
        StagedScheduleMealDTO.initializeFromStagedScheduleMeal(
          stagedScheduleMeal
        )
      );
      const stagedScheduleSnackDTOs = scheduleSnacks.map(
        (stagedScheduleSnack) =>
          StagedScheduleSnackDTO.initializeFromStagedScheduleSnack(
            stagedScheduleSnack
          )
      );
      const newStagedClientDTO =
        StagedClientDTO.initializeFromStagedClient(newStagedClient);
      await APIClient.createStagedClient(newStagedClientDTO);
      await APIClient.createStagedScheduleMeals(stagedScheduleMealDTOs);
      await APIClient.createStagedScheduleSnacks(stagedScheduleSnackDTOs);

      props.handleFinishCreatingStagedClient(newStagedClient);
      setLoading(false);

      if (formValue.mealsPrepaid) {
        // Pass extendedScheduleMeals to DiscountOrderSummary page via props
        setNumberOfPrePaidMeals(scheduleMeals.length);
        setNumberOfPrePaidSnacks(scheduleSnacks.length);
        setPrepaidMeals(scheduleMeals);
        setPrepaidSnacks(scheduleSnacks);
        setShowCheckout(true);
        setPage('SignUpSummary');
      } else {
        setOpen(false);
        resetFormValues();
        setShowMenu(false);
        setPage('SignUp');
      }
    } else {
      // Dietitian is selecting client meals, and has just filled out their info on the form
      const shippingRate = await APIClient.getShippingRate(zipcode);
      const cogsData = await APIClient.getCOGS();
      const cogsDTOs = cogsData.map((cog) => {
        return new COGSDTO(cog);
      });
      setCogs(cogsDTOs);
      setShippingRate(shippingRate);
      setShowMenu(true);
      setPage('DietitianChooseClientMealsMenu');
      setLoading(false);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const form = event.target;

    // Check that all required values have been populated before triggering button click
    const validated = await validate(form);
    if (validated) {
      handleButtonClick(false, false);
    } else {
      setLoading(false);
      return false;
    }
  };

  const handleEatingDisorderInput = (event) => {
    const value = event.target.value;
    setFormValue({ eatingDisorderId: value });
  };

  const handleGenderInput = (event) => {
    const value = event.target.value;
    setFormValue({ gender: value });
  };

  const handleInput = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    if (id === undefined) {
      setFormValue({ mealPlanId: value });
    } else if (id === 'mealsPreSelected') {
      const valueToSet = (() => {
        // Performing this operation: setState(!booleanValue)
        if (value === 'true') {
          return false;
        } else if (value === 'false') {
          return true;
        }
      })();
      setFormValue({ mealsPreSelected: valueToSet });
    } else if (id === 'mealsPrepaid') {
      const valueToSet = (() => {
        // Performing this operation: setState(!booleanValue)
        if (value === 'true') {
          return false;
        } else if (value === 'false') {
          return true;
        }
      })();
      setFormValue({ mealsPreSelected: valueToSet });
      setFormValue({ mealsPrepaid: valueToSet });
    } else if (id === 'zipcode') {
      setZipcode(value);
    } else {
      setFormValue({ [id]: value });
    }
  };
  const handleClickOpen = () => {
    setPage('SignUp');
    setError(false);
    setShowMenu(false);
    setShowCheckout(false);
    resetFormValues();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const UIContainer = {};
  UIContainer['SignUpSummary'] = (
    <SignUpSummary
      stripePromise={props.stripePromise}
      numMeals={numberOfPrePaidMeals}
      numSnacks={numberOfPrePaidSnacks}
      stagedClientId={stagedClientId}
      dietitianId={props.dietitianId}
      prepaidMeals={prepaidMeals}
      prepaidSnacks={prepaidSnacks}
      mealPrice={mealPrice}
    />
  );
  UIContainer['DietitianChooseClientMealsMenu'] = (
    <ClientMenu
      stagedClientId={formValue.id}
      dietitianChoosingClientMeals={true}
      onSubmit={(scheduleMeals, scheduleSnacks, mealPrice) =>
        handleButtonClick(scheduleMeals, scheduleSnacks, mealPrice)
      }
      extendedMeals={props.extendedMeals}
      snacks={props.snacks}
      // Passed in to determine meal price
      shippingRate={shippingRate}
      cogs={cogs}
    />
  );
  UIContainer['SignUp'] = (
    <ModalBody
      formValue={formValue}
      handleInput={handleInput}
      error={error}
      loading={loading}
      handleSubmit={handleSubmit}
      mealPlans={props.mealPlans}
      eatingDisorders={props.eatingDisorders}
      handleEatingDisorderInput={handleEatingDisorderInput}
      handleGenderInput={handleGenderInput}
      zipcode={zipcode}
      zipcodeError={zipcodeError}
    />
  );
  return (
    <div className={createNewStagedClientModal.rootDiv}>
      <Grid container>
        <Grid item>
          <IconButton
            id="add-staged-client-button"
            variant="contained"
            onClick={handleClickOpen}
            className={createNewStagedClientModal.button}
          >
            <RedeemIcon />
            &nbsp;
            <Typography className={createNewStagedClientModal.buttonText}>
              {!isMobile ? 'Refer a Client' : ''}
            </Typography>
          </IconButton>
        </Grid>
        <Grid item>
          <Tooltip
            title={'New clients will get their first week of meals free!'}
          >
            <IconButton>
              <InfoOutlinedIcon
                className={createNewStagedClientModal.toolTip}
              />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth={page === 'SignUp' ? 'md' : 'xl'}
        fullWidth={true}
      >
        <Grid
          container
          className={
            showMenu && !showCheckout
              ? createNewStagedClientModal.themeColoredContainer
              : createNewStagedClientModal.regularContainer
          }
        >
          <Grid item>
            <Icon
              onClick={handleClose}
              className={createNewStagedClientModal.closeIcon}
            >
              close
            </Icon>
          </Grid>
        </Grid>
        {UIContainer[page]}
      </Dialog>
    </div>
  );
};
export default CreateNewStagedClientModal;
