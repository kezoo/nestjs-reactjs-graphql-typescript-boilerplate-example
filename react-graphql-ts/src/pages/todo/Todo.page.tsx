import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Input, Switch, Table, message } from "antd"
import { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react"
import { getApiConf } from '../../config/api.config'
import { DataForGraphqlQueryHandleResult, SortOptions } from "../../interface/app.interface"
import { deepClone, isBoolean, isString } from "../../utils/base.helper"
import { sendRestRequest } from '../../utils/httpRequest/httpRequest'
import { sendGraphqlQuery } from '../../utils/httpRequest/httpRequestWithGraphql'
import { ReturnForRequest } from '../../utils/httpRequest/restLib/restLib.interface'
import './Todo.css'
import { ObjectAnyProp, ReqTodoListParams, TodoItem, TodoPageRef, TodoPageState, TodoQueryBuilderParams } from "./Todo.interface"
import { TodoQueryBuilder } from "./Todo.querybuilder"


export default function TodoPage () {

  const stateDef: TodoPageState = {
    input: '',
    listWidth: 0,
    upState: 0,
    sort: {sortByKey: 'updatedAt', sortDirection: 'DESC'},
    page: {limit: 10, offset: 0, pageNo: 1},
    totalTodos: 0,
    doRequestWithRest: true
  }
  const [state, setState] = useState(stateDef)
  const [listState, setListState] = useState([] as TodoItem[])
  const todoPageRef: TodoPageRef = {
    current: {
      itemsRefs: {}
    }
  }
  const [messageApi, contextHolder] = message.useMessage()
  const upState = ({
    pageSize, pageNo, doReqList, sort,
  }: {
    pageSize?: number
    pageNo?: number
    doReqList?: boolean
    sort?: SortOptions | null
  }) => {
    const upStateObj = {...state}
    let shouldResetList = false

    if (pageSize) {
      upStateObj.page.limit = pageSize
      shouldResetList = true
    }

    if (pageNo) {
      upStateObj.page.pageNo = pageNo
      shouldResetList = true
    }

    if (typeof sort !== 'undefined') {
      upStateObj.sort = sort
      shouldResetList = true
    }
    // console.log(`upStateObj `, upStateObj, sort)
    setState({...upStateObj, upState: state.upState + 1})

    if (doReqList) {
      setTimeout(() => {
        reqTodoList({
          doReset: shouldResetList,
          sort: upStateObj.sort,
        })
      }, 100)
    }
  }
  const reqTodoList = (p?: ReqTodoListParams) => {
    const {doReset, sort} = p || {}
    const sortingItems = []
    const tSort = typeof sort === 'undefined' ? state.sort : sort
    if (tSort) {
      sortingItems.push(tSort, {
        sortByKey: 'id',
        sortDirection: tSort.sortDirection
      })
    }
    const pageOptions = {
      limit: state.page.limit,
      pageNo: state.page.pageNo,
      sortingItems,
    }
    console.log(`============ pageOptions `, pageOptions, sort, tSort)
    const handleListRes = (res: DataForGraphqlQueryHandleResult | ReturnForRequest) => {
      const {nodes, pageInfo} = (res.data?.todoListWithPagination || res).data || {}
      const upState = {...state}

      if (pageInfo) {
        if (pageInfo.countTotal && state.totalTodos !== pageInfo.countTotal) {
          upState.totalTodos = pageInfo.countTotal
        }
      }

      setState(upState)
      // console.log(`TODO listWithPage `, res, nodes, pageInfo)
      const todos: TodoItem[] = nodes || []

      if (doReset) {
        listState.length = 0;
      }
      listState.push(...todos)
      setTimeout(() => {
        setListState([...listState])
      })
    }
    state.doRequestWithRest ?
      sendRestRequest({
        params: {
          payload: {
            method: 'get',
            apiUrl: getApiConf({}).mainApiHost + '/todos',
            urlParams: {
              limit: pageOptions.limit,
              pageNo: pageOptions.pageNo,
              sortingItemsStr: JSON.stringify(pageOptions.sortingItems),
            },
            handleData(res) {
              console.log(`GET TODOS rest way: `, res)
              handleListRes(res)
            }
          }
        }
      }) :
      sendGraphqlQuery({
        queryString: TodoQueryBuilder('listWithPage', {
          pageOptions,
        }).queryString,
        handleRes: (res) => {
          handleListRes(res)
        }
      })
  }
  useEffect(() => {
    reqTodoList()
  }, [])
  const onUpTodo = (oParams: {
    id?: string
    doUpEditable?: boolean
    doBlur?: boolean
    upCompleted?: boolean
    upTitle?: string
    titleChanged?: string
    doRemove?: boolean
  }) => {
    const {id, doBlur, doUpEditable, upCompleted, upTitle, titleChanged, doRemove} = oParams
    const nList: TodoItem[] = deepClone(listState)
    const findItem = nList.find(vItem => vItem.id === id)

    if (findItem) {
      if (doUpEditable) {
        if (doBlur && findItem.editable) {
          findItem.editable = false
        }
        if (!doBlur && !findItem.editable) {
          findItem.editable = true

          const tRef = todoPageRef.current.itemsRefs[id || '']
          setTimeout(() => {
            tRef && tRef.focus()
          })
        }
      }
      if (isBoolean(upCompleted)) {
        findItem.completed = upCompleted
      }
      if (upTitle) {
        findItem.title = upTitle
        findItem.titleChanged = ''
      }
      if (isString(titleChanged)) {
        findItem.titleChanged = titleChanged
      }
      if (doRemove) {
        const findIdx = nList.findIndex(nItem => nItem.id === id)
        if (findIdx >= 0) {
          nList.splice(findIdx, 1)
        }
      }
      setListState([...nList])
    }
  }
  const onChangeEditableField = (oParams: {item: TodoItem, doBlur?: boolean, titleChanged?: string, doOnFocus?: boolean}) => {
    const {item: vItem, doBlur, titleChanged, doOnFocus} = oParams
    const oItem = deepClone(vItem)

    if (doOnFocus) {
    }

    const toUp = {
      id: oItem.id, doUpEditable: true, doBlur,
    }
    const oTitle = vItem.title

    if (isString(titleChanged)) {
      const isTitleEmpty = titleChanged?.trim() === ''
      if (isTitleEmpty) {
        messageApi.open({type: 'warning', content: 'Title cannot be empty'})
      }
      Object.assign(toUp, {
        titleChanged: doBlur ? '' : (isTitleEmpty ? '' : titleChanged),
      })
    }

    onUpTodo({...toUp})

    if (doBlur && titleChanged && titleChanged !== oTitle) {
      upTodo({
        id: oItem.id, upTitle: oItem.titleChanged,
      })
    }
  }
  const upTodo = (oParams: TodoQueryBuilderParams) => sendGraphqlQuery({
    queryType: 'mutation',
    queryString: TodoQueryBuilder('upTodo', oParams).queryString,
    handleRes: (res) => {
      // console.log(`upTodo RES `, res)
      onUpTodo({...oParams})
    }
  })
  const tableColumns: ColumnsType<TodoItem> = [
    {
      title: '#',
      dataIndex: 'seq',
      key: 'key',
      render: (value, item, index) => (
        <div className="TodoPage-item-seq">{index+1}</div>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      width: 200,
      render: (value, item, index) => (
        <div className="TodoPage-item-title">
          <Input
            value={item.titleChanged || value}
            disabled={item.completed === true}
            ref={ref => ref && item.id && (todoPageRef.current.itemsRefs[item.id] = ref)}
            onBlur={() => onChangeEditableField({item, doBlur: true, titleChanged: item.titleChanged})}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeEditableField({item, titleChanged: e.target.value})}

          />
        </div>
      )
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
    },
    {
      title: 'Updated at',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      defaultSortOrder: 'descend',
      sorter: true,
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      sorter: true,
      render: (value, item) => <Switch
        checkedChildren={
          <CheckOutlined />
        }
        unCheckedChildren={
          <CloseOutlined />
        }
        checked={item.completed}
        onChange={(checked) => {
          upTodo({
            id: item.id, upCompleted: checked,
          })
        }}
      />
    },
    {
      title: 'Op',
      dataIndex: 'op',
      key: 'op',
      render: (value, item) => (
        <div
          className="TodoPage-item-op"
        >
          <DeleteOutlined
            // wrapperCls={['cursorPointer']}
            onClick={() => {
              sendGraphqlQuery({
                queryType: 'mutation',
                queryString: TodoQueryBuilder('removeTodo', {id: item.id}).queryString,
                handleRes (res) {
                  onUpTodo({id: item.id, doRemove: true})
                  messageApi.open({type: 'success', content: 'Deleted successfully'})
                }
              })
            }}
            size={18}
          />
        </div>
      )
    },
  ]
  // return (<div />)
  return (
    <div
      className='TodoPage-root'
      style={{
        flexDirection: 'column',
      }}
    >
      {contextHolder}
      <div
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          margin: '1rem'
        }}
        className="flex-all"
      >
        <Input
          value={state.input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({...state, input: e.target.value})}
        />
        <Button
          type='primary'
          onClick={() => {
            const isEmpty = state.input.trim() === ''
            if (isEmpty) {
              return messageApi.open({type: 'warning', content: 'Title cannot be empty'})
            }
            sendGraphqlQuery({
              queryType: 'mutation',
              queryString: TodoQueryBuilder('addTodo', {upTitle: state.input}).queryString,
              handleRes: (res) => {
                // console.log(`addTodo RES `, res)
                setState({...state, input: ''})
                if (res.data.addTodo && res.data.addTodo.data) {
                  setListState([res.data.addTodo.data, ...listState])
                  messageApi.open({type: 'success', content: 'Added successfully'})
                }
              }
            })
          }}
        >
          Add todo
        </Button>
      </div>

      <div
        className='TodoPage-list'
        ref={ref => {
          const rW = ref?.clientWidth || 0
          if (!state.listWidth && rW !== state.listWidth) {
            setState({...state, listWidth: rW})
          }
        }}
      >
        <Table
          columns={tableColumns}
          dataSource={listState}
          rowKey='id'
          showSorterTooltip={false}
          scroll={{
            x: state.listWidth,
          }}
          pagination={{
            defaultPageSize: state.page.limit,
            pageSizeOptions: [5, 10, 20],
            showSizeChanger: true,
            total: state.totalTodos,

          }}
          onChange={(pagination, filters, sorter, extra) => {
            const tSorter = sorter as ObjectAnyProp
            let tOrder = null
            if (tSorter.order === 'descend') {
              tOrder = 'DESC'
            }
            if (tSorter.order === 'ascend') {
              tOrder = 'ASC'
            }
            // console.log('params', pagination, filters, tSorter, extra);

            const upKeys: ObjectAnyProp = {}

            if (pagination.pageSize && pagination.pageSize !== state.page.limit) {
              Object.assign(upKeys, {
                pageSize: pagination.pageSize
              })
            }

            if (pagination.current && pagination.pageSize !== state.page.pageNo) {
              Object.assign(upKeys, {
                pageNo: pagination.current
              })
            }

            if (!tSorter.order && state.sort) {
              Object.assign(upKeys, {
                sort: null
              })
            }

            if (tOrder && (tSorter.field !== state.sort?.sortByKey || tOrder !== state.sort?.sortDirection)) {
              Object.assign(upKeys, {
                sort: {
                  sortByKey: tSorter.field,
                  sortDirection: tOrder,
                }
              })
            }
            // console.log(`^^^^^^^^^^^ `, tSorter, tOrder, upKeys)
            if (Object.keys(upKeys).length) {
              upState({...upKeys, doReqList: true,})
            }
          }}

        />
      </div>
    </div>
  )
}
