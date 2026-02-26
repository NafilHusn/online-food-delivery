import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import {
  IJWTPayload,
  ILoginDto,
  ILoginResponseTypeDTO,
  IProfileDTO,
  IUpdateProfileParamsDTO,
} from '../interfaces/auth.dto.interface';
import { NotEmptyString, OptionalString } from '../../../utils/string.helper';
import { Role } from '@prisma/client';

export class LoginDto implements ILoginDto {
  @ApiProperty({ default: 'admin@gmail.com' })
  @IsEmail()
  email: string;

  @NotEmptyString({ default: 'admin123' })
  password: string;

  @OptionalString()
  firebaseToken?: string;
}

export class ProfileDTO implements IProfileDTO {
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

export class UpdateProfileParamsDTO
  implements Partial<ProfileDTO>, IUpdateProfileParamsDTO
{
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @OptionalString()
  name?: string;

  @OptionalString()
  phone?: string;
}

export class LoginResponseTypeDTO implements ILoginResponseTypeDTO {
  @ApiProperty()
  readonly token: string;
  @ApiProperty()
  driverId?: string;
  @ApiProperty({ type: ProfileDTO })
  readonly userData: ProfileDTO & { timestamp: Date };
}

export class JWTPayload implements IJWTPayload {
  sessionId: string;
  userId: string;
  timestamp: string;
}
