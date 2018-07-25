import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { getAuthority } from "./authority";

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  // if (response.status >= 200 && response.status < 300) {
  //   return response;
  // }

  if (response.status === 200) {
    return response;
  }

  //根据后端接口修改前端处理 有返回errorMessage使用errorMessage提示错误，不存在使用默认错误
  response.json().then(data => {
    const errorDescription = 'errorMessage' in data ? data.errorMessage : codeMessage[response.status] || response.statusText;
    const errortitle = 'errorTitle' in data ? data.errorTitle : '请求失败';
    notification.error({
      // message: `请求错误 ${response.status}: ${response.url}`,
      message: errortitle,
      description: errorDescription,
    });
  });

  const errorText = codeMessage[response.status] || response.statusText;
  const error = new Error(errorText);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {

  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  newOptions.headers = {
    Authorization:getAuthority(),
    ...newOptions.headers,
  };
  // 自己封装的get请求拼接参数，仅适用后台是lumen的pathinfo方式 url/3/2/3
  // 拼接过程省略了参数名称，所以对参数顺序有要求，需要按照后端路由注册的顺序传入参数
  if ('params' in newOptions && newOptions.params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(newOptions.params).forEach(key => paramsArray.push(newOptions.params[key]))
    if (url.search(/\?/) === -1) {
      url += '/' + paramsArray.join('/')
    } else {
      url += '/' + paramsArray.join('/')
    }
  }

  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        // dispatch({
        //   type: 'login/logout',
        // });
        dispatch(routerRedux.push('/user/login'));

        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });

  // return fetch(url, newOptions)
  //   .then(checkStatus)
  //   .then(response => {
  //     if (newOptions.method === 'DELETE' || response.status === 204) {
  //       return response.text();
  //     }
  //     return response.json();
  //   })
  //   .catch(e => {
  //     const { dispatch } = store;
  //     const status = e.name;
  //     if (status === 401) {
  //       dispatch({
  //         type: 'login/logout',
  //       });
  //       return;
  //     }
  //     if (status === 403) {
  //       dispatch(routerRedux.push('/exception/403'));
  //       return;
  //     }
  //     if (status <= 504 && status >= 500) {
  //       dispatch(routerRedux.push('/exception/500'));
  //       return;
  //     }
  //     if (status >= 404 && status < 422) {
  //       dispatch(routerRedux.push('/exception/404'));
  //     }
  //   });
}
