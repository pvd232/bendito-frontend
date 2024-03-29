import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import APIClient from '../../../../helpers/APIClient';
import DeliveryDateUtility from '../../../../helpers/DeliveryDateUtility';
import Transition from '../../../shared_components/Transition';
import BlueCircularProgress from '../../../shared_components/BlueCircularProgress';
import ClientMenu from '../../client_sign_up/client_menu/ClientMenu';
import checkUpcomingDelivery from '../helpers/checkUpcomingDelivery';
import { pastCutoffDate } from './helpers/pastCutoffDate';
import editDeliveryModal from './scss/EditDeliveryModal.module.scss';
import COGSDTO from '../../../../data_models/dto/COGSDTO';
import SettingsIcon from '@mui/icons-material/Settings';
import { useWindowWidth } from '../../../hooks/useWindowWidth';
import ScreenSize from '../../../../types/enums/ScreenSize';
const EditDeliveryModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cogs, setCogs] = useState(false);
  const [loadingPauseSubscription, setLoadingPauseSubscription] =
    useState(false);

  const [editMeals, setEditMeals] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= ScreenSize.xs;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setEditMeals(false);
    setOpen(false);
  };

  const handleUpdateFoodData = async () => {
    await props.handleUpdateFoodData();
    handleClose();
  };
  const handleSkipWeek = async () => {
    setLoading(true);
    if (props.weekSkipped) {
      // Unskip week in component then update scheduledOrderMeals in parent with call to props
      await APIClient.unskipWeek(
        props.mealSubscription.id,
        props.mealSubscription.stripeSubscriptionId,
        DeliveryDateUtility.getDeliveryDateFromIndex(
          props.selectedDeliveryIndex
        ).getTime() / 1000
      );
      props.unskipWeek();
      setLoading(false);
    } else {
      await APIClient.skipWeek(
        props.mealSubscription.id,
        props.mealSubscription.stripeSubscriptionId,
        DeliveryDateUtility.getDeliveryDateFromIndex(
          props.selectedDeliveryIndex
        ).getTime() / 1000
      );
      props.skipWeek();
      setLoading(false);
    }
  };

  const handlePauseMealSubscription = async () => {
    setLoadingPauseSubscription(true);
    // Update mealSubscription in backend
    APIClient.pauseMealSubscription(props.mealSubscription.id).then(() => {
      APIClient.pauseScheduledOrderMeals(props.mealSubscription.id).then(() => {
        props.pauseMealSubscription();
        setLoadingPauseSubscription(false);
      });
    });
  };
  const handleUnpauseMealSubscription = async () => {
    setLoadingPauseSubscription(true);
    // Update meal program in backend
    APIClient.unpauseMealSubscription(props.mealSubscription.id).then(() => {
      APIClient.unpauseScheduledOrderMeals(props.mealSubscription.id).then(
        () => {
          props.unpauseMealSubscription();
          setLoadingPauseSubscription(false);
        }
      );
    });
  };

  const handleChangeMeals = async () => {
    const cogsData = await APIClient.getCOGS();
    const cogsDTOs = cogsData.map((cog) => {
      return new COGSDTO(cog);
    });
    setCogs(cogsDTOs);
    setEditMeals(true);
  };
  const skipWeekButtonDisabled = (() => {
    if (
      pastCutoffDate(props.selectedDeliveryIndex) ||
      props.paused ||
      (props.isFirstDelivery && props.selectedDeliveryIndex === 0)
    ) {
      return true;
    } else {
      return false;
    }
  })();
  const canModifyFirstWeekMeals = (() => {
    if (pastCutoffDate(props.selectedDeliveryIndex) || props.isFirstDelivery) {
      return false;
    } else {
      return true;
    }
  })();
  return (
    <Grid item className={editDeliveryModal.container}>
      <Button
        id="edit-delivery-button"
        variant="outlined"
        onClick={() => {
          handleClickOpen();
        }}
        className={editDeliveryModal.button}
      >
        {!isMobile ? props.buttonText : <SettingsIcon />}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        // keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={editMeals ? 'xl' : 'xs'}
      >
        {!editMeals ? (
          <Grid container item className={editDeliveryModal.dialogContainer}>
            <Grid item>
              <Typography className={editDeliveryModal.header}>
                Manage Delivery
              </Typography>
            </Grid>
            <DialogContent>
              <Grid
                container
                item
                className={editDeliveryModal.dialogContentContainer}
              >
                <Grid item>
                  <Typography className={editDeliveryModal.modalBodyText}>
                    {props.paused &&
                    !checkUpcomingDelivery(props.extendedScheduledOrderMeals)
                      ? 'Your subscription is paused. You have no upcoming deliveries.'
                      : "This week's delivery is estimated to arrive on:"}
                  </Typography>
                </Grid>
                <Grid item>
                  {checkUpcomingDelivery(props.extendedScheduledOrderMeals) && (
                    <Grid item>
                      <Typography
                        className={editDeliveryModal.deliveryDateText}
                      >
                        {
                          DeliveryDateUtility.weekdays[
                            DeliveryDateUtility.getDeliveryDateFromIndex(
                              props.selectedDeliveryIndex
                            ).getDay()
                          ]
                        }
                        {', '}
                        {
                          DeliveryDateUtility.months[
                            DeliveryDateUtility.getDeliveryDateFromIndex(
                              props.selectedDeliveryIndex
                            ).getMonth()
                          ]
                        }{' '}
                        {DeliveryDateUtility.getDeliveryDateFromIndex(
                          props.selectedDeliveryIndex
                        ).getDate()}
                        , 2PM - 8PM
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <Grid
                  container
                  item
                  className={editDeliveryModal.dialogActionsContainer}
                >
                  <Grid item>
                    <Typography className={editDeliveryModal.modalBodyText}>
                      {!props.paused
                        ? !pastCutoffDate(props.selectedDeliveryIndex) &&
                          props.weekSkipped
                          ? 'Would you like to unskip your delivery for this week?'
                          : !pastCutoffDate(props.selectedDeliveryIndex) &&
                            !props.weekSkipped
                          ? "Can't make this week?"
                          : "The deadline has passed to make changes to this week's order."
                        : props.paused &&
                          (checkUpcomingDelivery(
                            props.extendedScheduledOrderMeals
                          )
                            ? 'Your weekly meals will be skipped indefinitely after this week.'
                            : 'Your delivery will be skipped this week.')}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Button
                      id="skip-week-button"
                      disabled={skipWeekButtonDisabled}
                      variant={'contained'}
                      onClick={handleSkipWeek}
                      className={editDeliveryModal.dialogButton}
                    >
                      {loading ? (
                        <BlueCircularProgress />
                      ) : props.weekSkipped ? (
                        'Unskip week'
                      ) : (
                        'Skip this week'
                      )}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Typography className={editDeliveryModal.modalBodyText}>
                      {!props.paused
                        ? `You are currently receiving ${props.mealsPerWeek} meals per week.`
                        : "Your subscription is paused and you're not receiving any new meals."}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      disabled={props.paused || props.isFirstDelivery}
                      variant="contained"
                      onClick={handleChangeMeals}
                      className={editDeliveryModal.dialogButton}
                    >
                      Change Meals
                    </Button>
                  </Grid>
                  <Grid item>
                    <Typography className={editDeliveryModal.modalBodyText}>
                      {props.paused
                        ? 'Want to get resume your subscription?'
                        : 'Need to take a break?'}
                    </Typography>
                  </Grid>

                  <Grid item>
                    {!props.paused ? (
                      <Button
                        id="pause-subscription-button"
                        onClick={handlePauseMealSubscription}
                        variant="contained"
                        className={editDeliveryModal.dialogButton}
                      >
                        {loadingPauseSubscription ? (
                          <BlueCircularProgress />
                        ) : (
                          'Pause subscription'
                        )}
                      </Button>
                    ) : (
                      <Button
                        id="unpause-subscription-button"
                        onClick={handleUnpauseMealSubscription}
                        variant="contained"
                        className={editDeliveryModal.dialogButton}
                      >
                        {loadingPauseSubscription ? (
                          <BlueCircularProgress />
                        ) : (
                          'Unpause subscription'
                        )}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </Grid>
        ) : (
          <ClientMenu
            hasSnacks={props.extendedScheduledOrderSnacks.length > 0}
            snacks={props.snacks}
            extendedMeals={props.extendedMeals}
            changingMeals={true}
            canChangeFirstWeek={canModifyFirstWeekMeals}
            finishEditing={handleUpdateFoodData}
            userId={props.mealSubscription.clientId}
            mealSubscriptionId={props.mealSubscription.id}
            dietitianChoosingClientMeals={false}
            cogs={cogs}
            shippingRate={props.mealSubscription.shippingRate}
          ></ClientMenu>
        )}
      </Dialog>
    </Grid>
  );
};
export default EditDeliveryModal;
