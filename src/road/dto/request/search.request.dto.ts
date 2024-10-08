import { User } from "types/user.type";
import { IsObject } from "class-validator";

export class SearchRequestDto {
  @IsObject()
  user: User;
}
