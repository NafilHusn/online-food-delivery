import { Global, Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordService } from 'utils/passwords.service';
import { UserQueryBuilder } from './query-builder/user.query-builder';
import { UserController } from './controller/user.controller';
import { UserValidator } from './validators/user.validator';

@Global()
@Module({
  exports: [UserService],
  controllers: [UserController],
  providers: [
    UserService,
    UserQueryBuilder,
    UserRepository,
    PasswordService,
    UserValidator,
  ],
})
export class UsersModule {}
