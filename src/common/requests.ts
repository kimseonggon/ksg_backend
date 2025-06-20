import { PaginationDto } from "src/lib/dto/common.dto"

export type Limit = {
  offset: number
  limit: number
  page: number
  pageSize: number
}

const toLimit: (dto: PaginationDto, defaultPage?: number, defaultPageSize?: number) => Limit = (
  dto,
  defaultPage = 1,
  defaultPageSize = 20,
) => {
  const pageSize = (dto.pageSize || defaultPageSize) > 0 ? dto.pageSize || defaultPageSize : 0
  const page = Math.max(dto.page || defaultPage, 1)

  const offset = (page - 1) * pageSize
  const limit = pageSize

  return { offset, limit, pageSize, page }
}

export { toLimit }