import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsObject, isNumber } from 'class-validator';

export class IndividualDetails {
  @ApiProperty()
  @IsString()
  branchId: string;

  @IsString()
  bvn: string;

  @IsString()
  dateOfBirth: string;

  @IsString()
  email: string;

  @IsObject()
  extraData: object;

  @IsString()
  firstName: string;

  @IsString()
  gender: string;

  globalRoles: [];

  @IsString()
  lastName: string

  @IsString()
  middleName: string;

  @IsString()
  nin: string;

  @IsString()
  orgId: string;

  @IsBoolean()
  partner: true;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  portrait: string;

  @IsString()
  productId: string;

  productRoles: [];

  @IsString()
  productUserCategoryBaseId: string;

  @IsBoolean()
  socialSignUp: boolean;

  @IsString()
  title: string;

  @IsString()
  username: string;
}

export class OrganizationDetails {
  @IsString()
  address: string;

  @IsString()
  adminOrgRole: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumber()
  dateOfRegistration: number;

  @IsString()
  email: string;

  @IsObject()
  extraData: object;

  @IsString()
  industry: string;

  @IsString()
  logo: string;

  @IsString()
  name: string;

  @IsBoolean()
  partner: boolean;

  @IsString()
  phoneNumber: string;

  @IsString()
  postalCode: string;

  @IsString()
  productId: string;

  @IsString()
  productUserCategoryBaseId: string;

  @IsString()
  rcNumber: string;

  @IsBoolean()
  rcNumberVerified: boolean;

  @IsString()
  state: string;

  @IsString()
  website: string;

  @IsString()
  activation_status: string;

  @IsString()
  date_activated: string;

  @IsString()
  zip: string;

  @IsString()
  yearfounded: string;
}

export class UserDto {
  @ApiProperty()
  individualDetails: IndividualDetails;
  
  @ApiProperty()
  organizationDetails: OrganizationDetails;

  @ApiProperty()
  @IsString()
  organizationBaseId: string;

  @ApiProperty()
  @IsString()
  userBaseId: string;

  @ApiProperty()
  @IsString()
  userCategory: string;

  @ApiProperty()
  @IsString()
  userType: string;

  @ApiProperty()
  @IsBoolean()
  superadmin: boolean;
}
