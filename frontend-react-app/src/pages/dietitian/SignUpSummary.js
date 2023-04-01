import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import Grid from '@mui/material/Grid';
import PaymentForm from '../sign_up/payment_form/PaymentForm';
import APIClient from '../../helpers/APIClient';
import DiscountOrderSummary from '../sign_up/discount_order_summary/DiscountOrderSummary';
import CircularProgressPage from '../../reusable_ui_components/CircularProgressPage';

const SignUpSummary = (props) => {
  const [clientSecret, setClientSecret] = useState('');
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState('');
  const [discountCode, setDiscountCode] = useState(false);

  useEffect(() => {
    let mounted = true;
    APIClient.createPaymentIntent(
      props.numMeals,
      props.stagedClientId,
      false
    ).then((paymentIntentData) => {
      if (mounted && paymentIntentData) {
        setClientSecret(paymentIntentData.client_secret);
        setStripePaymentIntentId(paymentIntentData.stripe_payment_intent_id);
      }
    });
    return () => (mounted = false);
  }, [props.numMeals, props.stagedClientId]);

  const appearance = {
    theme: 'stripe',
  };
  const stripeOptions = {
    clientSecret: clientSecret,
    appearance: appearance,
  };
  return (
    <>
      {clientSecret ? (
        <Grid
          container
          justifyContent={'space-around'}
          marginBottom={'10vh'}
          marginTop={'5vh'}
          alignContent="space-between"
          alignItems={'stretch'}
        >
          <Grid
            item
            container
            xs={5}
            sm={4}
            med={4}
            lg={4}
            alignContent="space-between"
          >
            <DiscountOrderSummary
              stagedClientId={props.stagedClientId}
              shippingCost={props.shippingCost}
              scheduleMeals={props.prepaidMeals}
              dietitianPrepaying={true}
              setDiscountCode={(discount) => setDiscountCode(discount)}
              setPaymentIntentData={(newPaymentIntentData) => {
                setStripePaymentIntentId(
                  newPaymentIntentData.stripe_payment_intent_id
                );
                setClientSecret(newPaymentIntentData.client_secret);
              }}
            />
          </Grid>

          <Elements
            options={stripeOptions}
            stripe={props.stripePromise}
            key={clientSecret}
          >
            <Grid container item xs={6.5}>
              <PaymentForm
                dietitianPrepaying={true}
                discountCode={discountCode}
                stripePaymentIntentId={stripePaymentIntentId}
                numMeals={props.numMeals}
                stagedClientId={props.stagedClientId}
                dietitianId={props.dietitianId}
                clientSecret={clientSecret}
                returnUrl={APIClient.getPaidStagedMealsReturnUrl(
                  props.stagedClientId
                )}
              />
            </Grid>
          </Elements>
        </Grid>
      ) : (
        <Grid
          container
          justifyContent={'center'}
          sx={{
            height: '73vh',
          }}
        >
          <CircularProgressPage />
        </Grid>
      )}
    </>
  );
};
export default SignUpSummary;
