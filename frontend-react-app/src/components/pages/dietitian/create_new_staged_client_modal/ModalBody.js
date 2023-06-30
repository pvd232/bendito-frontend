import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import capitalize from '../../../../helpers/capitalize';
import BlueCircularProgress from '../../../shared_components/BlueCircularProgress';
import modalBody from './scss/ModalBody.module.scss';
import { Button } from '@mui/material';
const ModalBody = (props) => {
    const genderOptions = ['male', 'female', 'non-binary', 'other']
    const zipcodeIsHidden = (() => {
        if (!props.formValue.mealsPrepaid && !props.formValue.mealsPreSelected) {
        return true;
        } else {
        return false;
        }
    })();
    return (
        <DialogContent className={modalBody.dialog}>
            <Stack className={modalBody.stack}>
                <Typography className={modalBody.header}>Add a New Client</Typography>
                <Typography className={modalBody.subHeader}>
                Your client will receive an email with a link to sign up
                </Typography>
            </Stack>
            <form onSubmit={props.handleSubmit} autoComplete="new-password">
                <fieldset className={modalBody.fieldset}>
                <FormGroup>
                    <Grid container>
                    <Grid item xs={12} className={modalBody.content}>
                        <Stack className={modalBody.stack}>
                            <InputLabel className={modalBody.inputLabel}>
                            Client Email
                            </InputLabel>

                            <TextField
                            required
                            fullWidth
                            label={'Email'}
                            id="id"
                            type="email"
                            value={props.formValue.id}
                            onChange={props.handleInput}
                            error={props.error}
                            helperText={
                                props.error ? 'This email is already taken' : ''
                            }
                            />

                            <InputLabel className={modalBody.inputLabel}>
                            Client First Name
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                label={'First Name'}
                                id="firstName"
                                value={props.formValue.firstName}
                                onChange={props.handleInput}
                            />

                            <InputLabel className={modalBody.inputLabel}>
                                Client Age
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                label={'Age'}
                                id="age"
                                type='number'
                                inputProps={{
                                    step: 0.01,
                                    min: 0,
                                    max: 1000,
                                    }}
                                value={props.formValue.age ? parseFloat(props.formValue.age) : ''}
                                onChange={props.handleInput}
                            />

                            <InputLabel className={modalBody.inputLabel}>
                                Client Gender
                            </InputLabel>
                            <FormControl>
                                <InputLabel className={modalBody.inputLabel}>
                                    Gender
                                </InputLabel>
                                <Select
                                    label='Gender'
                                    required
                                    id="gender"
                                    value={props.formValue.gender}
                                    onChange={props.handleGenderInput}
                                >
                                {genderOptions.map((gender, i) => (
                                    <MenuItem
                                        key={`gender-${i}`}
                                        id={`gender-${i}`}
                                        value={gender}
                                    >
                                        {capitalize(gender)}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>

                            <InputLabel className={modalBody.inputLabel}>
                                Client Current Weight
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                label={'Current Weight'}
                                id="currentWeight"
                                placeholder='Current Weight'
                                type='number'
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 1000,
                                }}
                                value={props.formValue.currentWeight ? parseInt(props.formValue.currentWeight) : ''}
                                onChange={props.handleInput}
                            />

                            <InputLabel className={modalBody.inputLabel}>
                                Client Target Weight
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                label={'Target Weight'}
                                id="targetWeight"
                                type='number'
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 1000,
                                }}
                                placeholder='Target Weight'
                                value={props.formValue.targetWeight ? parseInt(props.formValue.targetWeight) : ''}
                                onChange={props.handleInput}
                            />

                            <InputLabel className={modalBody.inputLabel}>
                                Client Notes
                            </InputLabel>
                            <TextField
                                fullWidth
                                label={'Notes'}
                                id="notes"
                                value={props.formValue.notes}
                                onChange={props.handleInput}
                            />

                            <InputLabel className={modalBody.inputLabel}>
                                Client Meal Plan
                            </InputLabel>
                            <FormControl>
                                <InputLabel className={modalBody.inputLabel}>
                                Meal Plan
                                </InputLabel>
                                <Select
                                label="Meal Plan"
                                required
                                id="mealPlanId"
                                value={props.formValue.mealPlanId}
                                onChange={props.handleInput}
                                >
                                {props.mealPlans.map((mealPlan, i) => (
                                    <MenuItem
                                    key={`mealPlan-${i}`}
                                    id={`mealPlan-${i}`}
                                    value={mealPlan.id}
                                    >
                                    {`${capitalize(mealPlan.name)}: ${
                                        mealPlan.statedCaloricLowerBound
                                    }-${mealPlan.statedCaloricUpperBound} calories`}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <InputLabel className={modalBody.inputLabel}>
                                Client Diagnosis
                            </InputLabel>
                            <FormControl>
                                <InputLabel className={modalBody.inputLabel}>
                                Eating Disorder
                                </InputLabel>
                                <Select
                                label="Eating Disorder"
                                required
                                id="eatingDisorderId"
                                value={props.formValue.eatingDisorderId}
                                onChange={props.handleEatingDisorderInput}
                                >
                                {props.eatingDisorders.map((eatingDisorder, i) => (
                                    <MenuItem
                                    key={`eatingDisorder-${i}`}
                                    id={`eatingDisorder-${i}`}
                                    value={eatingDisorder.id}
                                    >
                                    {capitalize(eatingDisorder.name)}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        {/* <FormGroup>
                            <FormControlLabel
                            control={
                                <Switch
                                id="mealsPreSelected"
                                checked={props.formValue.mealsPreSelected}
                                value={props.formValue.mealsPreSelected}
                                onChange={props.handleInput}
                                />
                            }
                            label="Choose Client Meals"
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormControlLabel
                            control={
                                <Switch
                                id="mealsPrepaid"
                                checked={props.formValue.mealsPrepaid}
                                value={props.formValue.mealsPrepaid}
                                onChange={props.handleInput}
                                />
                            }
                            label="Pay for First Week Meals"
                            />
                        </FormGroup> */}
                        {!zipcodeIsHidden ? (
                            <>
                            <InputLabel className={modalBody.inputLabel}>
                                Client Zipcode
                            </InputLabel>

                            <TextField
                                fullWidth
                                label={'Zipcode'}
                                id="zipcode"
                                value={props.zipcode}
                                onChange={props.handleInput}
                                hidden={zipcodeIsHidden}
                                required={
                                props.formValue.mealsPrepaid ||
                                props.formValue.mealsPreSelected
                                }
                                error={props.zipcodeError}
                                helperText={
                                props.error ? 'Please choose a valid zipcode' : ''
                                }
                            />
                            </>
                        ) : (
                            <></>
                        )}

                        <Button
                            id="staged-client-submit"
                            type="submit"
                            variant="contained"
                            disabled={props.loading}
                            className={modalBody.submitButton}
                        >
                            {props.loading ? (
                            <BlueCircularProgress />
                            ) : props.formValue.mealsPreSelected ? (
                            'Continue to Select Meals'
                            ) : (
                            'Submit'
                            )}
                        </Button>
                        </Stack>
                    </Grid>
                    </Grid>
                </FormGroup>
                </fieldset>
            </form>
        </DialogContent>
    );
};
export default ModalBody;
