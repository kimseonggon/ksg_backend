import { A, D, G, pipe } from '@mobily/ts-belt'
import { isDate } from 'moment'

export const groupBy: <T, K>(array: T[], fn: (value: T) => K) => Map<K, T[]>
  = (array, fn) =>
    array.reduce(
      (m, v) => {
        const value = fn(v)
        const vs = m.get(value)
        if (vs) {
          vs.push(v)
          return m.set(value, vs)
        } else {
          return m.set(value, [v])
        }
      },
      new Map()
    )

export const keyBy: <K extends string | number, T extends Record<K, any>>(array: T[], fn: (value: T) => K) => Record<K, T>
  = (array, fn) =>
    array.reduce(
      (o, v) => {
        const value = fn(v)
        o[value] = v

        return o
      },
      {} as Record<string | number, any>
    )

export function isValidDate(v: unknown): v is Date {
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v)
    return !isNaN(d.getTime())
  }

  return false
}

export type ArrayInnerType<T> = T extends (infer U)[] ? U : T
export type Nullable<T> = T | null
export type NullableRecord<T> = {
  [P in keyof T]: Nullable<T[P]>
}


export class Result<T, U> {
  success: T
  error: U
}

export type ArrayRecord<T> = {
  [P in keyof T]: Array<T[P]>
}


export class ChangeValue<T> {
  before: T
  after: T
}

export type ChangeRecord<T> = {
  [K in (keyof T)]?: T[K] extends (infer U)[] ? ChangeValue<Array<U>>
  : (T[K] extends ObjectLiteral ? ChangeRecord<T[K]> : ChangeValue<T[K]> | null)
}

export interface ObjectLiteral { // 해당 인터페이스는 typeorm에서 제공하는 interface임으로 임으로 추가
  [key: string]: any
}

/**
 * 전체 페이지 구하기
 * 
 * @param totalRows 
 * @param perPage 
 * @returns 
 */
export const getTotalPages = (totalRows: number, perPage: number) => {
  const totalPages = Math.ceil(totalRows / perPage)
  return totalPages
}

export const flat = (arr: any[]) => {
  return arr.reduce((acc, val) => acc.concat(val), [])
}

// validator
export function isNull(v: unknown): boolean {
  return v === null
}

export function isNil(v: any): boolean {
  return v === null || v === undefined
}

export function isEmpty(param: any) {
  return Object.keys(param).length === 0
}

export function isJson(v: any) {
  try {
    JSON.parse(v)
  } catch (e) {
    return false
  }
  return true
}

/** 객체 깊은 복사 */
export const deepCopy = (v: any): any => {
  if (typeof v !== 'object' || v === null) {
    return v
  }

  // 배열
  if (Array.isArray(v)) {
    const newArray = v.map((item) => deepCopy(item))
    return [...newArray]
  }
  // 날짜
  if (v instanceof Date) {
    return new Date(v.getTime())
  }
  // 정규식
  if (v instanceof RegExp) {
    const flags = v.flags
    return new RegExp(v.source, flags)
  }
  // 맵
  if (v instanceof Map) {
    return new Map(v)
  }
  // set
  if (v instanceof Set) {
    return new Set(v)
  }

  if (v instanceof Object) {
    return Object.fromEntries(
      Object.entries(v).map(([key, value]) => [key, deepCopy(value)]),
    )
  }

  throw new Error('Object가 아닌 값을 복사할 수 없음')

}

export const asyncReduce: <T, U>(vs: Array<T>, reducer: (v: U, currentValue: T) => Promise<U>, initialValue: U) => Promise<U>
  = (vs, reducer, initialValue) =>
    vs.reduce(
      async (pv, currentValue) => {
        const v = await pv.then()
        const result = await reducer(v, currentValue)

        return Promise.resolve(result)
      },
      Promise.resolve(initialValue)
    )

export const asyncForEach: <T>(vs: Array<T>, eacher: (v: T) => Promise<unknown>) => Promise<unknown>
  = (vs, eacher) =>
    vs.reduce(
      async (p, v) => {
        await p.then()
        await eacher(v)
      },
      Promise.resolve()
    )

export const asyncMap = <T, U>(vs: Array<T>, mapper: (v: T) => Promise<U>): Promise<Array<U>> =>
  vs.reduce(
    async (pvs, v) => {
      const vs = await pvs.then()
      vs.push(await mapper(v))

      return Promise.resolve(vs)
    },
    Promise.resolve([]) as Promise<U[]>
  )

export const asyncFilter = <T>(vs: Array<T>, validator: (v: T) => Promise<boolean>): Promise<Array<T>> =>
  vs.reduce(
    async (pvs, v) => {
      const newVs = await pvs.then()
      if (await validator(v)) {
        newVs.push(v)
      }

      return Promise.resolve(newVs)
    },
    Promise.resolve([]) as Promise<T[]>
  )

export const chunk = <T = unknown>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  let index = 0;
  while (index < array.length) {
    chunks.push(array.slice(index, index + size));
    index += size;
  }
  return chunks;
}

export const rotateString = (str: string, count: number, left = true): string => {
  const rotationCount = count % str.length
  const sliceCount = left ? rotationCount : str.length - rotationCount
  return str.slice(sliceCount) + str.slice(0, sliceCount)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// formatter
export const makeAllSettledResponse = <T>(promises: PromiseSettledResult<T>[]) => {
  const success: T[] = []
  const error: any[] = []

  promises.forEach((promise) => {
    if (promise.status === 'fulfilled') {
      success.push(promise.value)
    } else {
      const { status, message, name, response } = promise.reason
      const errorData = {
        status,
        message: message || response?.message,
        name,
        data: response?.data,
      }
      error.push(errorData)
    }
  })

  return { success, error }
}

export const errorNormalizer = (err: any) => {
  return {
    message: err.message,
    status: err.status,
    data: err.data || err.response?.data,
  }
}

export const toString = (v: any) => {
  if (isNull(v)) {
    return v
  }
  if (typeof v !== 'string') {
    return String(v)
  }
  return v
}

export const toNumber = (v: any) => {
  if (!isNaN(parseInt(v))) {
    return v
  }
  return undefined
}

export const toBoolean = (v: any) => {
  if (isNull(v)) {
    return v
  }
  if (v === 'F' || v === 'f' || v === 'x' || v === 'X' || v === 'N' || v === 'n' || v === '미사용') {
    return false
  }
  return !!(v)
}


const arrayDiff = <T>(arr1: T[], arr2: T[]): readonly T[] => {
  return pipe(
    arr1,
    A.mapWithIndex((index, value) => {
      const arr2Value = arr2[index]
      if (Array.isArray(value) && Array.isArray(arr2Value)) {
        return arrayDiff(value, arr2Value).length > 0 ? arr2Value : null
      } else if (G.isObject(value) && G.isObject(arr2Value)) {
        const result = compare({ before: value, after: arr2Value })
        return Object.keys(result).length > 0 ? arr2Value : null
      }

      return value !== arr2Value ? arr2Value : null
    }),
    A.filter(G.isNotNullable),
  )
}

export const compare = <T extends ObjectLiteral>({ before, after }: { before?: T, after?: T }): ChangeRecord<T> =>
  pipe(
    A.concat(Object.keys(before || {}), Object.keys(after || {})) as (keyof T)[],
    A.uniq,
    A.reduce(
      {} as ChangeRecord<T>,
      (changeRecord, key) => {
        const beforeValue = before?.[key]
        const afterValue = after?.[key]
        const diffDict = { before: beforeValue, after: afterValue }
        if (Array.isArray(beforeValue) && Array.isArray(afterValue)) {
          if (beforeValue.length !== afterValue.length) {
            return D.set(changeRecord, key as string | number, diffDict)
          }

          return arrayDiff(beforeValue, afterValue).length > 0 || arrayDiff(afterValue, beforeValue).length > 0
            ? D.set(changeRecord, key as string | number, diffDict)
            : changeRecord
        } else if (isDate(beforeValue) && isDate(afterValue) && (beforeValue.getTime() !== afterValue.getTime())) {
          return D.set(changeRecord, key as string | number, diffDict)
        } else if (G.isObject(beforeValue) && G.isObject(afterValue)) {
          const result = compare(diffDict)
          return Object.keys(result).length === 0 ? changeRecord : D.merge(changeRecord, result)
        } else if (beforeValue !== afterValue) {
          return D.set(changeRecord, key as string | number, diffDict)
        }

        return changeRecord
      }
    )
  )