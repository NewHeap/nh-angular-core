import {Injectable} from "@angular/core";
import {FormGroup, FormControl, AbstractControl} from "@angular/forms";

export interface IServerSideFormValidationService{
}

@Injectable()
export class ServerSideFormValidationService implements IServerSideFormValidationService{

    public validate<T extends IServerSideFormValidator>(formValidatorType: { new(): T ;}, formGroup: FormGroup, objectToValidate: any): void {

        let formValidator = new formValidatorType();
        let formValidationResult: FormValidationResult = formValidator.validate(objectToValidate);

        if(!formValidationResult.hasErrors())
        {
            return;
        }

        let formErrors = formValidationResult.getErrors();
        for(let i = 0; i < formErrors.length; i++)
        {
            let formError = formErrors[i];
            let formControl: FormControl = null;

            for (let key in formGroup.controls) {
                if (formGroup.controls.hasOwnProperty(key)) {
                    if(key == formError.getFieldName())
                    {
                        formControl = <FormControl>formGroup.controls[key];
                        break;
                    }
                }
            }

            if(formControl == null)
            {
                if(!formGroup.controls[""])
                {
                    formGroup.addControl("", new FormControl());
                }

                formControl = <FormControl>formGroup.controls[""];
            }

            formControl.setErrors({remote: formError.getErrorMessages()});
        }
    }
}

export interface IServerSideFormValidator {
    validate(object: any): FormValidationResult;
}
export class AspMvcFormServerSideFormValidator implements IServerSideFormValidator
{
    public validate(object: any): FormValidationResult {
        let validationResult = new FormValidationResult();

        if(object && object != null)
        {
            if (object.error_description !== undefined) {
                validationResult.addErrorByFieldName("", object.error_description);
            }

            if (object.ModelState) {
                for (let key in object.ModelState) {

                    let errors = object.ModelState[key];
                    for (let subKey in errors) {
                        validationResult.addErrorByFieldName(key, errors[subKey]);
                    }
                }
            }

            if (object.Message !== undefined) {
                validationResult.addErrorByFieldName("", object.Message);
            }
        }

        return validationResult;
    }
}

export interface IFormValidationResult {
}
export class FormValidationResult implements IFormValidationResult
{
    private formErrors: Array<FormError> = [];

    public getErrors(): Array<FormError>{
        return this.formErrors;
    }

    public hasErrors(): boolean{
        return (this.getErrors().length > 0);
    }

    public hasErrorForFieldName(fieldName: string): boolean{
        return (this.getErrorForFieldName(fieldName) !== null);
    }

    public getErrorForFieldName(fieldName: string): FormError{
        let formError: FormError = null;

        for(let i = 0; i < this.formErrors.length; i++)
        {
            if(this.formErrors[i].getFieldName() == fieldName)
            {
                formError = this.formErrors[i];
            }
        }

        return formError;
    }

    public addErrorByFieldName(fieldName: string, errorMessage: string): void {
        let formError: FormError = this.getErrorForFieldName(fieldName);

        if(formError == null)
        {
            formError = new FormError(fieldName);
            this.formErrors.push(formError);
        }

        formError.addErrorMessage(errorMessage);
    }

    constructor() {
    }
}

export interface IFormError {
}
export class FormError implements IFormError
{
    private fieldName:string;
    private errorMessages:Array<string> = [];

    public getErrorMessages(): Array<string> {
        return this.errorMessages;
    }

    public getFieldName(): string{
        return this.fieldName;
    }

    public addErrorMessage(errorMessage: string): void {
        this.errorMessages.push(errorMessage);
    }

    private setFieldName(fieldName: string): void{
        if(!fieldName || fieldName == null)
        {
            fieldName = '';
        }

        this.fieldName = fieldName;
    }

    constructor(fieldName:string) {
        this.setFieldName(fieldName);
    }
}