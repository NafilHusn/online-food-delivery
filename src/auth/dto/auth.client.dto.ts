import { ApiProperty } from '@nestjs/swagger';
import { ILoginDto } from '../interfaces/auth.dto.interface';
import { IsEmail } from 'class-validator';
import { NotEmptyString, OptionalString } from '../../../utils/string.helper';

export class ClientLoginDto implements ILoginDto {
  @ApiProperty({ default: 'client@vbaccounts.com' })
  @IsEmail()
  email: string;

  @NotEmptyString({ default: 'client123' })
  password: string;

  @OptionalString()
  firebaseToken?: string;
}
