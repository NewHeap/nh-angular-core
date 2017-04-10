"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ServerSideFormValidator = (function () {
    function ServerSideFormValidator() {
    }
    ServerSideFormValidator.setErrorsOnFormGroup = function (formGroup, formValidationResult) {
        if (!formValidationResult.hasErrors()) {
            return;
        }
        for (var key in formGroup.controls) {
            if (formGroup.controls.hasOwnProperty(key)) {
                var control = formGroup.controls[key];
                var formError = formValidationResult.getErrorForFieldName(key);
                if (formError != null) {
                    control.setErrors({ remote: formError.getErrorMessages() });
                }
            }
        }
    };
    return ServerSideFormValidator;
}());
exports.ServerSideFormValidator = ServerSideFormValidator;
var AspMvcFormServerSideFormValidator = (function (_super) {
    __extends(AspMvcFormServerSideFormValidator, _super);
    function AspMvcFormServerSideFormValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AspMvcFormServerSideFormValidator.prototype.validate = function (object) {
        var validationResult = new FormValidationResult();
        if (object && object != null) {
            if (object.error_description !== undefined) {
                validationResult.addErrorByFieldName("", object.error_description);
            }
            if (object.ModelState) {
                for (var key in object.ModelState) {
                    var errors = object.ModelState[key];
                    for (var subKey in errors) {
                        validationResult.addErrorByFieldName(key, errors[subKey]);
                    }
                }
            }
            if (object.Message !== undefined) {
                validationResult.addErrorByFieldName("", object.Message);
            }
        }
        return validationResult;
    };
    return AspMvcFormServerSideFormValidator;
}(ServerSideFormValidator));
AspMvcFormServerSideFormValidator = __decorate([
    core_1.Injectable()
], AspMvcFormServerSideFormValidator);
exports.AspMvcFormServerSideFormValidator = AspMvcFormServerSideFormValidator;
var FormValidationResult = (function () {
    function FormValidationResult() {
        this.formErrors = [];
    }
    FormValidationResult.prototype.getFormErrors = function () {
        return this.formErrors;
    };
    FormValidationResult.prototype.hasErrors = function () {
        return (this.getFormErrors().length > 0);
    };
    FormValidationResult.prototype.hasErrorForFieldName = function (fieldName) {
        return (this.getErrorForFieldName(fieldName) !== null);
    };
    FormValidationResult.prototype.getErrorForFieldName = function (fieldName) {
        var formError = null;
        for (var i = 0; i < this.formErrors.length; i++) {
            if (this.formErrors[i].getFieldName() == fieldName) {
                formError = this.formErrors[i];
            }
        }
        return formError;
    };
    FormValidationResult.prototype.addErrorByFieldName = function (fieldName, errorMessage) {
        var formError = this.getErrorForFieldName(fieldName);
        if (formError == null) {
            formError = new FormError(fieldName);
        }
        formError.addErrorMessage(errorMessage);
    };
    return FormValidationResult;
}());
exports.FormValidationResult = FormValidationResult;
var FormError = (function () {
    function FormError(fieldName) {
        this.errorMessages = [];
        this.setFieldName(fieldName);
    }
    FormError.prototype.getErrorMessages = function () {
        return this.errorMessages;
    };
    FormError.prototype.getFieldName = function () {
        return this.fieldName;
    };
    FormError.prototype.addErrorMessage = function (errorMessage) {
        this.errorMessages.push(errorMessage);
    };
    FormError.prototype.setFieldName = function (fieldName) {
        if (!fieldName || fieldName == null) {
            fieldName = '';
        }
        this.fieldName = fieldName;
    };
    return FormError;
}());
exports.FormError = FormError;
//# sourceMappingURL=server.side.form.validator.js.map