import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToListDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentId: string;

  @ApiProperty({ enum: ['TVShow', 'Movie'] })
  @IsNotEmpty()
  @IsString()
  contentType: string;
}
