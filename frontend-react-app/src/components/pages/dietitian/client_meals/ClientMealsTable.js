import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import capitalize from '../../../../helpers/capitalize';
import ScheduleMealCard from './ScheduleMealCard';
import clientMealsTable from './scss/ClientMealsTable.module.scss';
import DeliveryDateUtility from '../../../../helpers/DeliveryDateUtility';
const ClientMealsTable = (props) => {
  const deliveryDayIndex = [0, 1, 2, 3];
  const handleChangeDeliveryIndex = (event) => {
    const selectedDeliveryIndex = event.target.value;
    props.handleChangeDeliveryIndex(selectedDeliveryIndex);
  };

  return (
    <Grid container item className={clientMealsTable.tableContainer}>
      <Grid container item className={clientMealsTable.tableSubContainer}>
        <Grid container item>
          <Typography className={clientMealsTable.header}>
            {props.filterClientfirstName.charAt(0).toUpperCase() +
              props.filterClientfirstName.slice(1)}
            's Weekly Scheduled Meals
          </Typography>
        </Grid>
        <Grid container>
          <Grid container className={clientMealsTable.filterContainer}>
            <Grid item lg={2.5} xs={7}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  label="Client"
                  required
                  name="client"
                  value={props.filterClient}
                  onChange={(e) => props.handleFilterChange(e)}
                >
                  {props.clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {capitalize(client.firstName) +
                        ' ' +
                        capitalize(client.lastName)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl fullWidth>
                <InputLabel>Date</InputLabel>
                <Select
                  label="Date"
                  required
                  name="date"
                  value={props.selectedDeliveryIndex}
                  onChange={handleChangeDeliveryIndex}
                >
                  {deliveryDayIndex.map((index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {`${DeliveryDateUtility.getDeliveryDateFromIndex(
                          index
                        ).getDate()} ${
                          DeliveryDateUtility.months[
                            DeliveryDateUtility.getDeliveryDateFromIndex(
                              index
                            ).getMonth()
                          ]
                        }`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {props.currentScheduledOrderMeals.map(
          (scheduledOrderMealCardData, i) => {
            return (
              <Grid
                item
                key={`gridChosenScheduledOrderMeal${i}`}
                className={clientMealsTable.scheduleMealCardContainer}
              >
                <ScheduleMealCard
                  mealData={scheduledOrderMealCardData}
                  key={`clientMeal${i}`}
                />
              </Grid>
            );
          }
        )}
      </Grid>
    </Grid>
  );
};
export default ClientMealsTable;
