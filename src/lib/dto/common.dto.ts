import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

/** 고정크기 페이지 응답값 */
export class FixedPageResult<T> {
  data: T[]
  page?: number
  pageSize?: number
  order?: string
  totalPage?: number
  rowCount?: number
  total?: number
}

export class PaginationDto {
  @ApiPropertyOptional({ description: '페이지 번호', type: Number })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number | undefined

  @ApiPropertyOptional({ description: '페이지 사이즈', type: Number })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pageSize?: number | undefined

}
