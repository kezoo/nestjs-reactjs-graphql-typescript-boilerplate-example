import { useState } from 'react'
import { Outlet, Route, Routes, useNavigate } from "react-router-dom"
import { NAV_REF } from '../constants/nav.constant'
import PageNotFound from '../pages/404Page'
import { ObjectAnyProp } from '../pages/todo/Todo.interface'
import TodoPage from '../pages/todo/Todo.page'
import { ROUTES_PATH } from './route.constant'

export function RouteWrapper() {
  const userStore = {}
  const nav = (NAV_REF.nav = useNavigate())
  const aa: {n?: string} = {}
  console.log(aa?.n)
  return (
    <Routes>
      <Route path="/" element={<PrivateRoutes {...{ userStore }} />}>
        <Route path={ROUTES_PATH.todo.path} element={<TodoPage />} />
        <Route path='test' element={<div >aaaaaaaaaa</div>} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

interface PrivateRoutesParams {
  userStore: ObjectAnyProp
}
function PrivateRoutes(p: PrivateRoutesParams) {
  const [state, setState] = useState({ canViewProtectedRoutes: true })
  if (!state.canViewProtectedRoutes) {
    return null
  }
  return <Outlet />
}
