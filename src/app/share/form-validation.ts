import { FormArray } from "@angular/forms";

export class FormValidation {
  static requiredMinCheckBox(min = 1) {
    const validator = (formArray: FormArray) => {
      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) => (current ? total + current : total), 0);

      return totalChecked >= min ? null : { required: true };
    };

    return validator;
  }
}
