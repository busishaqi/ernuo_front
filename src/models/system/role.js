import {
  getRoleList,
  changeRoleStatus,
  addRole
} from "../../services/system/role";

export default {
  namespace: "role",
  state: {
    roleList: []
  },
  effects: {
    *getRoleList(_, { call, put }) {
      const response = yield call(getRoleList);
      yield put({ type: "saveRoleList", payload: response });
    },
    *changeRoleStatus({ params, payload }, { call, put }) {
      const response = yield call(changeRoleStatus, params, payload);
      yield put({ type: "saveRoleList", payload: response });
    },
    *addRole({ payload }, { call, put }) {
      const response = yield call(addRole, payload);
      yield put({ type: "saveRoleList", payload: response });
    }
  },
  reducers: {
    saveRoleList(state, { payload }) {
      return {
        ...state,
        roleList: payload
      };
    }
  }
};
