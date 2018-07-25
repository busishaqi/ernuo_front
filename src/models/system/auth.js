import {
  auth,
  authStatus,
  updateAuth,
  addAuth
} from "../../services/system/auth";

export default {
  namespace: "auth",

  state: {
    authList: []
  },

  effects: {
    *getAuthList(_, { call, put }) {
      const response = yield call(auth);
      yield put({ type: "saveAuthList", payload: response });
    },
    *changeAuthStatus({ params }, { call, put }) {
      const response = yield call(authStatus, params);
      yield put({ type: "saveAuthStatus", payload: response });
    },
    *updateAuth({ params, payload }, { call, put }) {
      const response = yield call(updateAuth, params, payload);
      yield put({ type: "saveAuthList", payload: response });
    },
    *addAuth({ payload }, { call, put }) {
      const response = yield call(addAuth, payload);
      yield put({ type: "saveAuthList", payload: response });
    }
  },

  reducers: {
    saveAuthList(state, { payload }) {
      return {
        ...state,
        authList: payload
      };
    },

    saveAuthStatus(state, { payload }) {
      let tempAuthList = [];
      state.authList.map(function(item) {
        if (item.id == payload.authID) {
          item.status = payload.authStatus;
        }
        if (item.hasOwnProperty("children")) {
          let tempLevel2 = [];
          item.children.map(function(itemLevel2) {
            if (itemLevel2.id == payload.authID) {
              itemLevel2.status = payload.authStatus;
            }
            if (itemLevel2.hasOwnProperty("children")) {
              let tempLevel3 = [];
              itemLevel2.children.map(function(itemLevel3) {
                if (itemLevel3.id == payload.authID) {
                  itemLevel3.status = payload.authStatus;
                }
                tempLevel3.push(itemLevel3);
                itemLevel2.children = tempLevel3;
              });
            }
            tempLevel2.push(itemLevel2);
            item.children = tempLevel2;
          });
        }
        tempAuthList.push(item);
      });
      return {
        ...state,
        authList: tempAuthList
      };
    }
  }
};
