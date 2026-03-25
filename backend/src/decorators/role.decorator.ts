import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const AllowedRoles = (...roles: Role[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
