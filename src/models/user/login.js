import { routerRedux } from "dva/router";
import { login, logout } from "../../services/user/user";

import { setAuthority, getAuthority } from "../../utils/authority";
import { reloadAuthorized } from "../../utils/Authorized";

export default {
  namespace: "login",

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      //普通登录接口
      const response = yield call(login, payload);
      // Login successfully
      if (response == undefined || response.status != "ok") {
        return false;
      }
      yield put({
        type: "changeLoginStatus",
        payload: { token: response.token, status: true }
      });
      reloadAuthorized();
      yield put(routerRedux.push("/"));
    },
    *logout(_, { call, put, select }) {
      const locationState = yield select(
        state => state.routing.location.pathname
      );
      const targetState = "/user/login";
      const token = getAuthority();
      if (locationState != targetState && "" != token) {
        yield call(logout);
      } //如果不存在token不需要再次请求登出接口
      try {
        //  get location pathname
        const urlParams = new URL(window.location.href);
        // const pathname = yield select(state => state.routing.location.pathname);
        if (locationState == targetState) {
          window.history.replaceState(null, "login", urlParams.href);
        } else {
          // add the parameters in the url
          urlParams.searchParams.set("redirect", locationState);
          window.history.replaceState(null, "login", urlParams.href);
        }
      } finally {
        yield put({
          type: "changeLoginStatus",
          payload: {
            status: false,
            token: ""
          }
        });
        reloadAuthorized();
        // const locationState = yield select(state => state.routing.location.pathname);
        // const targetState = '/user/login';
        if (locationState !== targetState) {
          yield put(routerRedux.push("/user/login"));
        }
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.token);
      return {
        ...state,
        status: payload.status,
        type: "account"
      };
    }
  }
};
