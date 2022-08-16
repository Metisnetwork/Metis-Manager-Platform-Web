import axios from "../../utils/request"

const loginApi = {
  // 登录
  loginFn(data): Promise<any> {
    return axios({
      method: "POST",
      url: `/api/v1/user/login`,
      data
    })
  },
  queryNonce(): Promise<any> {
    return axios({
      method: "GET",
      url: `/api/v1/user/getLoginNonce`,
    })
  },

  // 申请身份标识
  // applyOrgIdentity(data): Promise<any> {
  //   return axios({
  //     method: "POST",
  //     url: `/api/v1/user/applyOrgIdentity`,
  //     data
  //   })
  // },

  // 设置机构名称
  setOrgName(data): Promise<any> {
    return axios({
      method: "POST",
      url: `/api/v1/user/setOrgName`,
      data
    })
  },

    // 设置did
    setDid(data): Promise<any> {
      return axios({
        method: "POST",
        url: `/api/v1/user/setDid`,
        data
      })
    },

  // 退出登录状态
  logoutFn(): Promise<any> {
    return axios({
      method: "POST",
      url: `/api/v1/user/logout`,
    })
  },

  // 获取验证码
  getVerCode(): Promise<any> {
    return axios({
      method: "GET",
      // url: `/api/v1/system/user/verificationCode`,
      url: `/api/v1/user/verificationCode`,
    })
  },

  // 查询当前组织信息
  queryBaseInfo(): Promise<any> {
    return axios({
      method: "GET",
      // url: `/api/v1/system/queryBaseInfo`,
      url: `/api/v1/user/findLocalOrgInfo`,
    })
  },


  // 更新组织信息
  updateLocalOrg(params): Promise<any> {
    return axios({
      method: "POST",
      // url: `/api/v1/system/queryBaseInfo`,
      url: `/api/v1/user/setDesc`,
      data: params
    })
  },

  // 更新管理员
  updateAdmin(params): Promise<any> {
    return axios({
      method: "POST",
      url: `/api/v1/user/updateAdmin`,
      data: params
    })
  },

  queryConfig() {
    return axios({
      method: "GET",
      url: `/api/v1/system/getMetaMaskConfig`,
    })
  }
}


export default loginApi;