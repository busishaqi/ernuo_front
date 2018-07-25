import request from "../../utils/request";



  export async function importProductList(payload) {
    return request("v1/importProductList", {
      method: "POST",
      body: payload
    });
  }
//获取权限列表
export async function importProduct( payload) {
  return request("/v1/importProduct",{
    method: "POST",
    body:payload
  });
}

//产品出库操作
export async function exportProduct( payload) {
    return request("/v1/exportProduct",{
      method: "POST",
      body:payload
    });
  }

  //出库列表
  export async function exportProductList(payload) {
    return request("v1/exportProductList", {
      method: "POST",
      body: payload
    });
  }

   //获取销售的销售量以及佣金
   export async function saleProductList(payload) {
    return request("v1/saleProductList", {
      method: "POST",
      body: payload
    });
  }
  



