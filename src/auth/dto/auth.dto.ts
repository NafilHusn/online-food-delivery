import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { NotEmptyString, OptionalString } from '../../../utils/string.helper';
import { Role } from '@prisma/client';
import { UpdateUserDto } from '../../users/dto/user.dto';

export class LoginDto {
  @ApiProperty({ default: 'admin@gmail.com' })
  @IsEmail()
  email: string;

  @NotEmptyString({ default: 'admin123' })
  password: string;

  @OptionalString()
  firebaseToken?: string;
}

export class ProfileDTO {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  email?: string | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  phone?: string | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  name?: string | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  roles?: Role[] | null;
  @ApiProperty({ type: 'string', nullable: true, required: false })
  profilePicture?: string | null;
}

export class UpdateProfileParamsDTO extends OmitType(UpdateUserDto, [
  'id',
  'lastLoginAt',
] as const) {}

export class LoginResponseTypeDTO {
  @ApiProperty()
  readonly token: string;
  @ApiProperty()
  driverId?: string;
  @ApiProperty({ type: ProfileDTO })
  readonly userData: ProfileDTO & { timestamp: Date };
}

export class JWTPayload {
  sessionId: string;
  userId: string;
  timestamp: string;
}
