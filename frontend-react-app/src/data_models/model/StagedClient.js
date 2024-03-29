import checkProperties from '../../helpers/checkProperties';
import capitalize from '../../helpers/capitalize';
export default class StagedClient {
  constructor(stagedClient) {
    this.id = stagedClient.id;
    this.email = stagedClient.email;
    this.dietitianId = stagedClient.dietitianId ?? '';
    this.firstName = stagedClient.firstName;
    this.currentWeight = stagedClient.currentWeight;
    this.targetWeight = stagedClient.targetWeight;
    this.age = stagedClient.age;
    this.gender = stagedClient.gender;
    this.eatingDisorderId = stagedClient.eatingDisorderId;
    this.mealPlanId = stagedClient.mealPlanId;
    this.datetime = stagedClient.datetime;
    this.accountCreated = stagedClient.accountCreated;
    this.notes = stagedClient.notes;
    this.active = stagedClient.active;
    this.waitlisted = stagedClient.waitlisted;
    this.mealsPreSelected = stagedClient.mealsPreSelected;
    this.mealsPrepaid = stagedClient.mealsPrepaid;
    this.isStagedClient = true;
    this.properlyInitialized = (() => checkProperties(this))();
  }
  get formattedName() {
    return `${capitalize(this.firstName)}`;
  }
}
