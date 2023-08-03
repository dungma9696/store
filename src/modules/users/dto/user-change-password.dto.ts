import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserChangePasswordDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'users.OLD_PASSWORD_REQUIRED' })
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'users.NEW_PASSWORD_REQUIRED' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]{8,20}$/,
    {
      message: 'users.NEW_PASSWORD_INVALID',
    },
  )
  newPassword: string;
}
