import { TEST_BASE_ACTION } from "./base.action.constant"

export const initialBaseState = {
}

export default function baseReducer(state = initialBaseState, action: any) {
  switch (action.type) {

    case TEST_BASE_ACTION:
      console.log('TEST_BASE_ACTION reducer ', action)
      return {
        ...state,
      }
  }

  return state;
}
