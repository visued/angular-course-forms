import { FormArray, FormControl } from "@angular/forms";

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

  static cepValidator(control: FormControl) {
      const cep = control.value;

      if(cep && cep !== '') {
        const validacep = /^[0-9]{8}$/;
        return validacep.test(cep) ? null : { cepInvalido: true};
      }

    return null;
  }

  static equalsTo(otherField: string) {
      const validator = (formControl: FormArray) => {
          if(otherField == null) {
              throw new Error('É necessário informar um campo!');
          }

          if(!formControl.root || !(<FormControl>formControl.root).controls){
              return null;
          }

          const field = (<FormControl>formControl.root).get(otherField);

          if(!field){
            throw new Error('É necessário informar um campo válido!');
          }

          if(field.value !== formControl.value){
            return { equalsTo : otherField };
          }

          return null;
      }
      return validator;
  }
}
