import axios from "../../utils/request"
/*
示例:代码中使用import api from "@/api/index"
调用 api.startChainFn({
    参数
}).then(res=>{
    do something
})
*/

interface pageObject {
  pageNum: number,
  pageSize: number
}


const resourceApi = {
  queryMydata(data: pageObject): Promise<any> {
    return axios({
      method: "GET",
      url: `/api/v1/resource/mydata/metaDataList?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
    })
  },
  // 查看详情
  queryMetaDataDetail(data: string): Promise<any> {
    return axios({
      method: "GET",
      url: `/api/v1/resource/mydata/metaDataInfo?metaDataId=${data}`
    })
  },
  // 上架 
  metaDataAction(data: any): Promise<any> {
    return axios({
      method: "POST",
      url: `/api/v1/resource/mydata/actionMetaData`,
      data
    })
  },
  // 下载
  downloadFn(data: any): Promise<any> {
    return axios({
      method: "GET",
      url: `/api/v1/resource/mydata/download?metaDataId=${data.id}`,
    })
  }

}


export default resourceApi;