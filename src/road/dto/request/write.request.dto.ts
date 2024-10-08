import { IsArray, IsObject, IsString } from "class-validator";
import { User } from "../../../types/user.type";
import { CATEGORY } from "../../../types/category.type";

export class WriteRequestDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  auth_category: CATEGORY;

  @IsArray()
  members: string[];

  @IsArray()
  skills: string[];

  @IsString()
  introduction: string;

  @IsString()
  video_link: string;

  @IsString()
  description: string;

  @IsObject()
  user: User;
}
