import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { NotEmptyString, OptionalString } from '../../../utils/string.helper';

export class ClientLoginDto {
  @ApiProperty({ default: 'client@vbaccounts.com' })
  @IsEmail()
  email: string;

  @NotEmptyString({ default: 'client123' })
  password: string;

  @OptionalString()
  firebaseToken?: string;
}
