import EditDeliveryModal from '../EditDeliveryModal';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DeliveryDateUtility from '../../../../helpers/DeliveryDateUtility';
import BlueCircularProgress from '../../../reusable_ui_components/BlueCircularProgress';
import GreenFilledButton from './GreenFilledButton';
const DeliveryInfo = (props) => {
  const handleSkipWeek = async (deliveryDate) => {
    await props.skipWeek(deliveryDate);
    return;
  };
  const handleUnskipWeek = async (deliveryDate) => {
    await props.unskipWeek(deliveryDate);
    return;
  };

  return (
    <Grid
      container
      item
      lg={10}
      justifyContent={'space-between'}
      alignItems={'center'}
      py={3}
    >
      <Grid
        container
        item
        xs={6}
        direction={'column'}
        alignItems={'flex-start'}
      >
        <Grid item>
          <Typography fontSize={props.customTheme.fontEqualizer(18)}>
            Modify this week's delivery by{' '}
            {DeliveryDateUtility.getDeliveryDateForDisplay(
              DeliveryDateUtility.getCutoffDateFromIndex(
                props.selectedDeliveryIndex
              )
            )}
          </Typography>
        </Grid>
        <Grid item>
          <FormHelperText hidden={!props.editing} error={true}>
            {props.editing && props.netChangeInWeeklyMeals < 0
              ? `Remove ${-1 * props.netChangeInWeeklyMeals} meal${
                  Math.abs(props.netChangeInWeeklyMeals) > 1 ? 's' : ''
                } to keep your changes`
              : props.editing && props.netChangeInWeeklyMeals > 0
              ? `Add ${props.netChangeInWeeklyMeals} meal${
                  Math.abs(props.netChangeInWeeklyMeals) > 1 ? 's' : ''
                } to keep your changes`
              : props.editing && props.netChangeInWeeklySnacks < 0
              ? `Remove ${-1 * props.netChangeInWeeklySnacks} snack${
                  Math.abs(props.netChangeInWeeklySnacks) > 1 ? 's' : ''
                } to keep your changes`
              : props.editing && props.netChangeInWeeklySnacks > 0
              ? `Add ${props.netChangeInWeeklySnacks} snack${
                  Math.abs(props.netChangeInWeeklySnacks) > 1 ? 's' : ''
                } to keep your changes`
              : ''}
          </FormHelperText>
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={6}
        direction={'column'}
        alignItems={'flex-end'}
        marginBottom={props.customTheme.smallerScreen() ? '2vh' : '4vh'}
        marginTop={props.customTheme.smallerScreen() ? '2vh' : '2vh'}
      >
        <Grid
          item
          marginTop={props.customTheme.smallerScreen() ? '4vh' : ''}
          marginBottom={props.customTheme.smallerScreen() ? '4vh' : ''}
        >
          <EditDeliveryModal
            clientId={props.clientId}
            buttonText={'Edit delivery'}
            handleFinishEditing={props.handleFinishEditing}
            selectedDeliveryIndex={props.selectedDeliveryIndex}
            extendedScheduledOrderMeals={props.extendedScheduledOrderMeals}
            extendedScheduledOrderSnacks={props.extendedScheduledOrderSnacks}
            mealSubscription={props.mealSubscription}
            mealsPerWeek={props.extendedScheduledOrderMeals.length / 4}
            extendedMeals={props.extendedMeals}
            snacks={props.snacks}
            skipWeek={(deliveryDateIndex) => handleSkipWeek(deliveryDateIndex)}
            unskipWeek={(deliveryDateIndex) =>
              handleUnskipWeek(deliveryDateIndex)
            }
            pauseMealSubscription={() => props.pauseMealSubscription()}
            unpauseMealSubscription={() => props.unpauseMealSubscription()}
            handleUpdateFoodData={props.handleUpdateFoodData}
            handleDeleteSubscription={props.handleDeleteSubscription}
          ></EditDeliveryModal>
        </Grid>
        {props.editing === true ? (
          <Grid item>
            <GreenFilledButton
              id={'save-changes-button'}
              variant={'filled'}
              sx={{ marginTop: '2vh' }}
              onClick={props.handleSaveChanges}
            >
              {props.loading ? (
                <BlueCircularProgress />
              ) : (
                'Save Changes for this Week'
              )}
            </GreenFilledButton>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
};
export default DeliveryInfo;