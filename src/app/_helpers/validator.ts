import { FormControl } from '@angular/forms';

export const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
export const PHONE_NUMBER_REGEX = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
export const URL_REGEX =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
export const NoSpace = (control: FormControl) => {
  const isWhitespace = (control.value || ('' as string)).indexOf(' ') >= 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
};

