import { User } from "types/user.type";
import { IsObject } from "class-validator";

export class GetArchiveRequestDto {
  @IsObject()
  user: User;
}
