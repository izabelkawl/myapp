import Validator from "validator";
import isEmpty from "is-empty";

const validateAnnouncementInput = (data) => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.content = !isEmpty(data.content) ? data.content : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = " *Podaj tytuł ogłoszenia";
  }
  if (Validator.isEmpty(data.content)) {
    errors.content = " *Podaj treść ogłoszenia";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateAnnouncementInput;
