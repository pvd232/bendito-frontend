import checkProperties from '../../helpers/checkProperties';
import capitalize from '../../helpers/capitalize';
export default class Dietitian {
  constructor(dietitianObject) {
    if (dietitianObject) {
      this.id = dietitianObject.id;
      this.password = dietitianObject.password;
      this.firstName = dietitianObject.firstName;
      this.lastName = dietitianObject.lastName;
      this.dieteticRegistrationNumber =
        dietitianObject.dieteticRegistrationNumber;
      this.clinicCity = dietitianObject.clinicCity;
      this.clinicState = dietitianObject.clinicState;
      this.clinicUrl = dietitianObject.clinicUrl;
      this.datetime = dietitianObject.datetime;
      this.admin = dietitianObject.admin;
      this.active = dietitianObject.active;
    } else {
      this.id = '';
      this.password = '';
      this.firstName = '';
      this.lastName = '';
      this.dieteticRegistrationNumber = '';
      this.clinicCity = '';
      this.clinicState = '';
      this.clinicUrl = '';
      this.datetime = '';
      this.admin = false;
      this.active = true;
    }
    this.properlyInitialized = (() => checkProperties(this))();
  }
  static injectInstance(dietitianObject) {
    return new Dietitian(dietitianObject);
  }

  get formattedName() {
    return `${capitalize(this.firstName)} ${capitalize(this.lastName)}`;
  }
}
