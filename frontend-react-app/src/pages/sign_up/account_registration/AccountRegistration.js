import { v4 as uuid } from 'uuid';
import { useTheme } from '@mui/material/styles';
import { useReducer, useState, useRef, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import BlackButton from '../../../reusable_ui_components/BlackButton.js';
import MealSubscription from '../../../data_models/model/MealSubscription.js';
import BlueCircularProgress from '../../../reusable_ui_components/BlueCircularProgress.js';
import HowItWorks from './HowItWorks.js';
const AccountRegistration = (props) => {
  const customTheme = useTheme();

  const [formValue, setFormValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      // if the client secret exists then this page is being rerendered and all of these values have been inputted

      id: props.stagedClientId,
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      address: '',
      street: '',
      suite: '',
      city: '',
      state: '',
      zipcode: '',
      phoneNumber: '',
      datetime: Date.now(),
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const timer = useRef();
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleInput = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    if (id === 'firstName' || id === 'lastName') {
      setFormValue({ [id]: value.trim().toLowerCase() });
    }
    // state value
    else if (id === 'confirm-password') {
      setFormValue({ confirmPassword: value });
    } else {
      setFormValue({ [id]: value });
    }
  };
  const validate = (form) => {
    if (formValue.password !== formValue.confirmPassword) {
      setError(true);
      return false;
    }
    setError(false);
    return form.checkValidity();
  };

  // Input handlers
  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);
      timer.current = window.setTimeout(() => {
        const mealSubscriptionObject = {
          id: uuid(),
          clientId: formValue.id,
          shippingCost: props.shippingCost,
          stripeSubscriptionId: '',
          dietitianId: props.dietitianId,
          datetime: Date.now(),
          paused: false,
          active: true,
        };
        const mealSubscription = new MealSubscription(mealSubscriptionObject);
        props.updateMealSubscription(mealSubscription);
        props.updateClientPassword(formValue.password);
        setLoading(false);
      }, 500);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    // check that all required values have been populated before triggering button click
    if (validate(form)) {
      handleButtonClick();
    }
  };

  return (
    <Grid container justifyContent={'center'}>
      <CardContent>
        <Grid item xs={12} margin={'0 auto'}>
          <form onSubmit={handleSubmit} autoComplete="new-password">
            <fieldset
              style={{
                boxShadow: customTheme.border.boxShadow.medium,
                padding: '4vh 5vw',
                boxSizing: 'border-box',
                margin: '0 10%',
                height: 'fit-content',
                border: 'none',
              }}
            >
              <FormGroup>
                <Grid container>
                  <Typography
                    width={'80%'}
                    fontSize={'2rem'}
                    textAlign={'center'}
                    margin={'0 auto'}
                    marginBottom={'5vh'}
                    marginTop={'2vh'}
                  >
                    Let's get started
                  </Typography>

                  <HowItWorks customTheme={customTheme} />
                  <Grid item lg={6} xs={12} sx={{ marginTop: '4vh' }}>
                    <Stack direction={'column'} rowGap={3}>
                      <TextField
                        required
                        autoComplete="new-password"
                        fullWidth
                        label={'Email'}
                        id="id"
                        sx={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          width: '80%',
                        }}
                        inputProps={{
                          style: { fontSize: customTheme.fontEqualizer(14) },
                        }} // font size of input text
                        disabled={true}
                        value={formValue.id}
                      />

                      <>
                        <TextField
                          autoComplete="new-password"
                          required
                          type="password"
                          fullWidth
                          label={'Create a password'}
                          // must set both name and autoComplete to 'new-password' this for autofill to stop
                          name="new-password"
                          id="password"
                          sx={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '80%',
                          }}
                          inputProps={{
                            style: { fontSize: customTheme.fontEqualizer(14) },
                          }} // font size of input text
                          InputLabelProps={{
                            style: { fontSize: customTheme.fontEqualizer(14) },
                          }}
                          onChange={handleInput}
                          value={formValue.password}
                        />
                        <TextField
                          autoComplete="new-password"
                          required
                          type="password"
                          fullWidth
                          label={'Confirm your password'}
                          // must set both name and autoComplete to 'new-password' this for autofill to stop
                          name="new-password"
                          id="confirm-password"
                          sx={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '80%',
                          }}
                          inputProps={{
                            style: { fontSize: customTheme.fontEqualizer(14) },
                          }} // font size of input text
                          InputLabelProps={{
                            style: { fontSize: customTheme.fontEqualizer(14) },
                          }}
                          onChange={handleInput}
                          value={formValue.confirmPassword}
                          error={error}
                          helperText={
                            error ? 'Your passwords do not match' : ''
                          }
                        />
                      </>

                      <BlackButton
                        id="password-button"
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          width: '80%',
                          paddingTop: '1vh',
                          paddingBottom: '1vh',
                        }}
                      >
                        {loading ? <BlueCircularProgress /> : 'Select meals'}
                      </BlackButton>
                      <Typography
                        fontFamily={'Inter'}
                        fontSize={customTheme.fontEqualizer(12)}
                        color={customTheme.palette.secondaryText.main}
                        sx={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          width: '80%',
                        }}
                      >
                        By clicking above, you agree to our{' '}
                        <a href="/">Terms of Use</a> and consent to our{' '}
                        <a href="/">Privacy Policy</a>
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </FormGroup>
            </fieldset>
          </form>
        </Grid>
      </CardContent>
    </Grid>
  );
};
export default AccountRegistration;
