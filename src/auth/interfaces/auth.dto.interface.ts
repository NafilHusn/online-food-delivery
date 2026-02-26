export interface ILoginDto {
  email: string;
  password: string;
}

export interface IProfileDTO {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
}

export interface IUpdateProfileParamsDTO extends Partial<IProfileDTO> {
  email?: string;
  name?: string;
  phone?: string;
}

export interface ILoginResponseTypeDTO {
  token: string;
  userData: IProfileDTO & { timestamp: Date };
}

export interface IJWTPayload {
  sessionId: string;
  userId: string;
  timestamp: string;
}
