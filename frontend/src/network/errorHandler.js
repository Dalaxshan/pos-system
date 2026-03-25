import { AxiosError } from 'axios';
import { commonMessages } from 'src/utils/constants';

// Function to handle all error messages
export const errorHandler = (error) => {
  let message = commonMessages.somethingWentWrong;
  // Check the instance of the error
  if (error instanceof AxiosError) {
    // Check if response error
    if (error.response) {
      // Return Unauthorized if status is 401
      if (error.response.status === 401) {
        message = commonMessages.unauthorized;
        return { message };
      }

      message = error.response.data.message || error.response.statusText;
      // Check if request error
    } else if (error.request) {
      if (error.code === 'ECONNABORTED') {
        message = commonMessages.timeout;
      } else {
        message = commonMessages.serverResponseLate;
      }
    }
  } else {
    message = error.message;
  }
  return { message };
};
