
  import {
    importProduct,
    importProductList,
    exportProduct,
    exportProductList,
    saleProductList
  } from "../../services/product/product";
  
  export default {
    namespace: "product",
  
    state: {
      data:[],
      importList:[],
      exportData:[],
      exportList:[],
      sale_list:[],
      
    },
  
    effects: {
      *importProduct({ payload }, { call, put }) {
        const response = yield call(importProduct, payload);
        yield put({ type: "addProduct", payload: response });
      },
      *importProductList({ payload }, { call, put }) {
        const response = yield call(importProductList, payload);
        yield put({ type: "importList", payload: response });
      },
      *exportProduct({ payload }, { call, put }) {
        const response = yield call(exportProduct, payload);
        yield put({ type: "deleteProduct", payload: response });
      },
      *exportProductList({ payload }, { call, put }) {
        const response = yield call(exportProductList, payload);
        yield put({ type: "exporttList", payload: response });
      },
      //获取销售的每日销售的销售的情况
      *SaleList({ payload }, { call, put }) {
        const response = yield call(saleProductList, payload);
        yield put({ type: "saleList", payload: response });
      },

    },
    
    
    reducers: {
        addProduct(state, { payload }) {
        return {
          ...state,
          data: payload
        };
      },
      importList(state, { payload }) {
        return {
          ...state,
          importList: payload
        };
      },

      deleteProduct(state, { payload }) {
        return {
          ...state,
          exportData: payload
        };
      },
      exporttList(state, { payload }) {
        return {
          ...state,
          exportList: payload
        };
      },
    //获取销售的每日销售的列表，以及销售的佣金的计算
    saleList(state, { payload }) {
      return {
        ...state,
        sale_list: payload
      };
    },
    

    }

  };
  