import { User } from "types/user.type";
import { IsObject } from "class-validator";

export class ProjectRequestDto {
  @IsObject()
  user: User;
}
