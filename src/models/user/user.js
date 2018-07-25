import { common, queryMenus } from "../../services/user/user";
import { getMenuData } from "../../common/menu";

export default {
  namespace: "user",

  state: {
    currentUser: {},
    menuData: []
  },

  effects: {
    *fetchCommon(_, { call, put }) {
      const response = yield call(common);
      yield put({ type: "saveCommon", payload: response });
    }
  },

  reducers: {
    saveCommon(state, { payload }) {
      return {
        ...state,
        currentUser: payload.user_info,
        menuData: getMenuData(payload.menus)
      };
    }
  }
};
