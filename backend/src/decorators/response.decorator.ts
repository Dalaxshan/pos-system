import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const ResponseMessage = (message: string): CustomDecorator<string> =>
  SetMetadata('responseMessage', message);
