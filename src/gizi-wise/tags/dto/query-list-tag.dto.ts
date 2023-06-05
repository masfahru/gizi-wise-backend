import { QueryListDto } from '@common/dto/query-list.dto';
import { IsOptionalWithEmptyString } from '@common/validators/is-optional-with-empty-string.validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QueryListTagDto extends QueryListDto {
  @ApiPropertyOptional({
    type: 'string',
  })
  @IsOptionalWithEmptyString()
  @IsString()
  name?: string;
}
