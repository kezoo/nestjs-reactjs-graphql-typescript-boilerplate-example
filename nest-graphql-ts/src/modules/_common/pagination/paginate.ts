// paginate.ts

import { Logger } from '@nestjs/common'
import { Knex } from 'knex'
import { APP_CONS } from '../../../constants/general.constant'
import { ObjectAnyProp } from '../../../interfaces/App.interface'
import { validJson } from '../../../utils'
import { SORT_NAME } from './Paginated'
import { PageInfo } from './page-info.dto'
import { PaginationArgs, PaginationExtraArgs, PaginationSorting } from './pagination.args'

export async function paginate<T>(
  paginationArgs: PaginationArgs<T>,
  extraArgs: PaginationExtraArgs<T>,
): Promise<any> {
  const logger = new Logger('Pagination');
  const {
    sortOrderBy: sOrderBy,
    sortingItems = [],
    sortingItemsStr,
    before, after,
    pageNo, limit,
    avoidCursorBased,
  } = paginationArgs || {}
  const {
    // cursorColumn = 'id',
    mainTableName,
    mainIdName = 'id',
    pageSize = 10,
    addDateProps = [],
    filterQuery,
    transformPageList,
  } = extraArgs || {}

  if (validJson(sortingItemsStr)) {
    sortingItems.length = 0
    sortingItems.push(...JSON.parse(sortingItemsStr))
  }
  console.log(`sortingItems `, sortingItems)
  // const dateProps = Array.from(new Set(['createdAt', 'created_at', 'updatedAt', 'updated_at', ...addDateProps]))
  const sortOrderBy = handleSortOrderValue(sOrderBy)
  const isCursorBased = !avoidCursorBased && !pageNo && sortingItems.length > 0
  const actualPageNo = Number(pageNo) >= 1 && Number(pageNo) || 1
  const pageNoToUse = actualPageNo - 1
  const nLimit = limit ?? pageSize;
  const offset = pageNoToUse * nLimit
  const knexQuery = APP_CONS.knexDb(mainTableName)
  // console.log(`pageNo ${pageNo} actualPageNo ${actualPageNo} pageNoToUse ${pageNoToUse} nLimit ${nLimit} isCursorBased ${isCursorBased} offset ${offset} `,)
  const queryResultBuilder = knexQuery.clone()
  let beforeObject: ObjectAnyProp | null
  let afterObject: ObjectAnyProp | null

  if (isCursorBased) {
    if (before) {
      beforeObject = validJson(before) ? JSON.parse(before) : null
      beforeObject && queryCursorBased({
        uQuery: queryResultBuilder,
        sortingItems,
        columnData: beforeObject,
        skipBeforeOrAfterQuery: true,
        doQueryBefore: true,
        queryBy: 'beforeObject'
      })
    }

    if (after) {
      afterObject = validJson(after) ? JSON.parse(after) : null
      afterObject && queryCursorBased({
        uQuery: queryResultBuilder,
        sortingItems,
        columnData: afterObject,
        isAfter: true,
        doQueryAfter: true,
        skipBeforeOrAfterQuery: true,
        queryBy: 'afterObject'
      })
    }
  }

  filterQuery && filterQuery({
    qBuilder: queryResultBuilder,
  })

  handleSortOrder({
    sortingItems,
    q: queryResultBuilder,
    doAddOrder: true,
    sortOrderBy,
  })

  if (!isCursorBased) {
    queryResultBuilder.offset(offset)
  }

  const result = await queryResultBuilder.limit(nLimit);
  const gotResults = result.length > 0

  transformPageList && transformPageList(result)

  const startCursor: T = gotResults ? result[0]: null
  const endCursor: T = gotResults ? result.slice().pop() : null

  const totalCount = sortOutKnexCount(await knexQuery.clone().count())
  logger.verbose(`totalCount `, totalCount)
  logger.verbose(`Paginate
    nLimit ${nLimit}
    \n startCursorValue ${startCursor && JSON.stringify(startCursor)}
    \n endCursorValue ${endCursor && JSON.stringify(endCursor)}
  `)

  let countBefore = 0;
  let countAfter = 0;

  function queryCursorBased ({
    uQuery, columnData, isAfter, sortingItems,
    skipBeforeOrAfterQuery, queryBy = '',
    doQueryBefore: doQueryBeforeO, doQueryAfter: doQueryAfterO,
  }: {
    uQuery: Knex.QueryBuilder,
    columnData: ObjectAnyProp,
    isAfter?: boolean
    sortingItems: PaginationSorting[]
    skipBeforeOrAfterQuery?: boolean
    queryBy?: string
  } & ExtraComparatorParams) {

    const idKey = `${mainTableName}.${mainIdName}`
    const idValue = columnData[mainIdName] ?? null
    // console.log(`queryCursorBasedFn SOURCE ${queryBy}?`)
    // console.log(`queryCursorBasedFn filterId - idKey ${idKey} - idValue ${idValue}`)

    const toQuery = ({
      colData, useComparator, doReverse, consoleLabel = '',
      doQueryBefore: doQueryBeforeI, doQueryAfter: doQueryAfterI,
    }: {
      colData: ObjectAnyProp,
      useComparator?: string,
      doReverse?: boolean
      consoleLabel?: string
    } & ExtraComparatorParams) => {
      const useAfter = doReverse ?? isAfter
      const doQueryBefore = doQueryBeforeI ?? doQueryBeforeO
      const doQueryAfter = doQueryAfterI ?? doQueryAfterO

      uQuery
        .where(function (uBuilder) {
          const buildComplexOrderQueryCondition = ({
            kBuilder, kSortingItems,
          }: {
            kBuilder: Knex.QueryBuilder,
            kSortingItems: PaginationSorting[]
          }) => {
            const restSortingItems = kSortingItems.slice(1)
            const firstSortingItem = kSortingItems[0]
            const firstSortingKey = firstSortingItem.sortByKey
            const firstSortingKeyWith = `${mainTableName}.${firstSortingKey}`
            const firstSortingValue = colData[firstSortingKey] ?? null
            const comparatorAs = useComparator || getComparator({s: firstSortingItem.sortDirection || sortOrderBy, reversed: useAfter, doQueryBefore, doQueryAfter})

            logger.debug(`${consoleLabel} useAfter ${useAfter} ${firstSortingKeyWith} ${comparatorAs} ${firstSortingValue}`
            )

            // console.log(`${consoleLabel || 'none'} executes uBuilder ---------------${JSON.stringify(kSortingItems)}`)

            const gotMoreItems = restSortingItems.length > 0

            kBuilder.where(
              firstSortingKeyWith,
              comparatorAs + (gotMoreItems ? '' : '='),
              firstSortingValue
            )

            if (gotMoreItems) {
              kBuilder.orWhere(function (inner) {
                const innerQueryL = [firstSortingKeyWith, '=', firstSortingValue]
                inner
                  .where(innerQueryL[0], innerQueryL[1], innerQueryL[2])
                  .andWhere(function (nQ) {
                    const {isDateKey, noMoreDateTypeComparing} = restSortingItems[0]
                    // console.log(`${consoleLabel || 'none'} isDateKey: ${isDateKey} ${innerQueryL.join(' ')}`)
                    if (isDateKey && !noMoreDateTypeComparing) {
                      buildComplexOrderQueryCondition({
                        kBuilder: nQ,
                        kSortingItems: restSortingItems,
                      })
                    }
                    else {
                      handleSortOrder({
                        q: nQ,
                        sortingItems: restSortingItems,
                        isMore: useAfter,
                        columnData: colData,
                        useComparator: comparatorAs,
                        sortOrderBy,
                      })
                    }
                  })
              })
            }
          }

          buildComplexOrderQueryCondition({
            kBuilder: uBuilder,
            kSortingItems: sortingItems,
          })
        })
    }

    if (!skipBeforeOrAfterQuery) {
      if (isAfter && beforeObject) {
        toQuery({
          colData: beforeObject,
          doQueryBefore: true,
          consoleLabel: "[BEFORE_OBJECT] "
        })
      }
      if (!isAfter && afterObject) {
        toQuery({
          colData: afterObject,
          doQueryAfter: true,
          consoleLabel: "[AFTER_OBJECT] "
        })
      }
      /* if (afterObject) {
        toQuery({
          colData: afterObject,
          doReverse: true,
        })
      } */
    }

    uQuery.whereNot(idKey, idValue)
    toQuery({colData: columnData})
  }

  if (isCursorBased) {
    const runCursorQuery = async ({isAfter} : {isAfter?: boolean}) => {
      const uQuery = knexQuery.clone()
      const columnData = (isAfter ? endCursor : startCursor) as ObjectAnyProp

      if (!columnData) {
        return console.warn(`Pagination runCursorQuery, can't find cursorData isAfter ${isAfter}`)
      }
      queryCursorBased({uQuery, columnData, isAfter, sortingItems, queryBy: `runCursorQuery${isAfter && 'isAfter'}`})

      filterQuery && filterQuery({qBuilder: uQuery})

      /* console.log(`Paginate query isAfter ${isAfter}
        \n columnData ${JSON.stringify(columnData)}
        \n
      `, (await uQuery).map(mItem => ({
        id: mItem.id,
        title: mItem.title,
      }))) */

      const vCount = sortOutKnexCount(await uQuery.count())

      isAfter ? (countAfter = vCount) : (countBefore = vCount)
    }
    await runCursorQuery({})
    await runCursorQuery({isAfter: true})
  }

  logger.debug(`CountBefore:${countBefore}`);
  logger.debug(`CountAfter:${countAfter}`);

  const edges = result.map((value) => {
    return {
      node: value,
      cursor: (value as ObjectAnyProp)[mainIdName],
    };
  });

  const pageInfo = new PageInfo();
  pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : null;
  pageInfo.endCursor = edges.length > 0 ? edges.slice(-1)[0].cursor : null;
  pageInfo.hasNextPage = countAfter > 0;
  pageInfo.hasPreviousPage = countBefore > 0;
  pageInfo.countBefore = countBefore;
  pageInfo.countNext = countAfter;
  pageInfo.countCurrent = edges.length;
  pageInfo.countTotal = totalCount
  return { edges, nodes: result, pageInfo };
}

function sortOutKnexCount (c?: ObjectAnyProp[]) {
  let count = 0

  if (c && c[0]) {
    const value = Object.values(c[0])[0]
    count = Number.isInteger(Number(value)) ? Number(value) : 0
  }
  return count
}

function handleSortOrderValue (orderStr?: string) {
  const val = orderStr === SORT_NAME.DESC ? SORT_NAME.DESC : SORT_NAME.ASC
  return val
}
interface ExtraComparatorParams {
  doQueryBefore?: boolean,
  doQueryAfter?: boolean,
}
function getComparator ({
  s, reversed, doQueryBefore, doQueryAfter,
}: {
  s: string, reversed?: boolean,
} & ExtraComparatorParams) {
  const isAsc = s === SORT_NAME.ASC
  const lessComparisonSign = isAsc ? '<' : '>'
  const moreComparisonSign = isAsc ? '>' : '<'
  let useComparator = reversed ? moreComparisonSign :  lessComparisonSign

  if (doQueryBefore) {
    useComparator = isAsc ? '<' : '>'
  }
  if (doQueryAfter) {
    useComparator = isAsc ? '>' : '<'
  }
  return useComparator
}

function handleSortOrder<T> (hParams: {
  sortingItems: PaginationSorting[]
  q?: Knex.QueryBuilder
  columnData?: ObjectAnyProp
  isMore?: boolean
  doAddOrder?: boolean
  useComparator?: string
  sortOrderBy: string
}) {
  const {sortingItems, q, columnData, isMore, doAddOrder, useComparator, sortOrderBy} = hParams
  const knexOrderConditions = []
  columnData && console.log(`\n @handleSortOrderFn sorting ${JSON.stringify(sortingItems)} \n columnData ${JSON.stringify(columnData)}
  `)
  for (let sIdx = 0; sIdx < sortingItems.length; sIdx++) {
    const sItem = sortingItems[sIdx]
    const {sortByKey, sortDirection} = sItem
    const useOrder = sortDirection || sortOrderBy
    const sDir = handleSortOrderValue(useOrder)

    if (doAddOrder) {
      knexOrderConditions.push({
        column: sortByKey,
        order: sDir.toLowerCase(),
        nulls: sItem.null,
      })
    }

    const sFirst = sIdx === 0
    const wSign = sFirst ? 'where' : 'orWhere'
    const comparatorAs = useComparator || getComparator({
      s: useOrder,
      reversed: isMore,
    })

    /* columnData && console.log(`# handleSortOrderFn ${isMore ? 'COUNT_AFTER' : 'COUNT_BEFORE'} ${wSign} ${sortByKey} ${comparatorAs} ${columnData && columnData[sortByKey]}`) */

    if (columnData && q) {
      q[wSign](
        sortByKey,
        comparatorAs,
        columnData[sortByKey]
      )
    }
  }

  if (q && knexOrderConditions.length) {
    q.orderBy(knexOrderConditions)
  }
}
