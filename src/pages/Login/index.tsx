import { Button } from 'antd'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import MyWave from '@com/MyWave'
import { loginApi } from '@api/index'
import { connect } from 'react-redux'
import './index.scss'

import square1 from '@assets/images/1.img1.png'
import square2 from '@assets/images/1.img2.png'
import square3 from '@assets/images/1.img3.png'
import cnSvg from '@assets/images/2.icon_cn.svg'
import enSvg from '@assets/images/2.icon_en.svg'
import samurai1 from '@assets/images/login/samurai-1.svg'
import samurai2 from '@assets/images/login/samurai-2.svg'
import metamask from '@assets/images/login/metamask-fox.svg'


const mapDispatchToProps = (dispatch: any) => ({
  InfoCompleteness: (data) => {
    dispatch({
      type: 'INFO_COMPLETENESS',
      data
    })
  }
})




const Login = (props: any) => {
  const { t, i18n } = useTranslation()
  const history = useHistory(),
    [isAgree, setIsAgree] = useState(false)
  const { hash } = history.location
  const fromPathAry = hash.replace(/#/, '')?.split('/')
  let redirectPath
  if (fromPathAry.length > 2) {
    redirectPath = `/${fromPathAry[1]}/${fromPathAry[2]}`
  } else {
    redirectPath = hash.replace(/#/, '')
  }



  const headLoginParams = (data) => {
    const { orgInfoCompletionLevel, connectNetworkStatus } = data.data || {}
    if (data.status !== 0) {
      return
    } else if (!connectNetworkStatus) {
      props.InfoCompleteness({
        orgInfoCompletionLevel,//, //组织信息完善情况0 带申请  1 待完善 2 完成
        connectNetworkStatus,// //0 未入网  1已入网 99 已退网
      })
      history.push({
        pathname: '/didApplication',
      })
    } else if (redirectPath) {
      history.push(redirectPath)
    } else {
      history.push('/')
    }
  }


  const loginFn = async () => {
    const { wallet } = props.state.wallet || {}
    try {
      // 1 获取地址
      const address = await wallet.connectWallet()

      //2  获取 nonceId  //不知道这是啥
      const data = await loginApi.queryNonce(address[0])
      console.log(data.nonceId);

      //3  获取签名  sign
      const sign = await wallet.signForWallet('login', address[0], 'cec3c0e9e6d44c2f89f9db3fe1dcc4bf')//data.nonce)
      if (!sign) return

      //4 登录
      headLoginParams(await loginApi.loginFn({
        address: address[0],
        sign: sign,
        signMessage: wallet._getAbiForLogin(data.nonceId)
      }))
    } catch (error) {
      console.log(error)
    }
  }

  const oldLogin = async () => {
    headLoginParams(await loginApi.loginFn({
      userName: 'admin',
      passwd: 'admin',
      code: 123
    }))
  }

  const queryToken = () => {
    //TODO
    if (isAgree) {
      // loginFn()
      oldLogin()
    }
  }




  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')
  }

  return (
    <div className="login-box">
      <MyWave />
      <div className="login-form-box">
        <img src={square1} alt="" className="login-square-img1" />
        <img src={square2} alt="" className="login-square-img2" />
        <img src={square3} alt="" className="login-square-img3" />
        <p className="login-ball1" />
        <p className="login-ball2" />
        <p className="login-ball3" />
        <div className="text-box">
          <p className="p1">{t('login.RosettaNet')}</p>
          <p className="p2">{t('login.loginSlogan')}</p>
          <p className="p3">{t('login.loginRemarks')}</p>
        </div>
        <div className="form-box">
          <div className="switch-lang pointer" onClick={changeLanguage}>
            {i18n.language === 'en' ? <img src={cnSvg} alt="" /> : <img src={enSvg} alt="" />}
          </div>
          <div className="connector-title">Metamask {t('login.extension')}</div>
          {props.state.wallet.wallet ?
            <>
              <div onClick={queryToken} className={isAgree ? "connector-block connector-btn-active" : "connector-block connector-btn"}>
                <img src={metamask} alt="samurai" className="icon" />
                <span className="text">Metamask</span>
              </div>
              <div className="connector-info">
                <span className={isAgree ? 'active radio' : "radio"} onClick={() => setIsAgree(!isAgree)}></span>
                {
                  i18n.language === 'en' ?
                    <span>
                      <span> I have read and agreed to the </span>
                      <i>Term of Use</i> and <i> Privacy Policy</i>
                    </span> :
                    <span>
                      <span>阅读并同意</span>
                      <i>用户协议</i>和<i>隐私声明</i>
                    </span>
                }

              </div>
            </>
            :
            <div className="samurai-box">
              <div className="samurai-line">
                <img src={samurai1} alt="" className="samurai-icon" />
                <p>{t('wallet.tip1')}</p>
              </div>
              <div className="samurai-line">
                <img src={samurai2} alt="" className="samurai-icon" />
                <p>{t('wallet.tip2')}</p>
              </div>
              <Button type="primary" className="install-btn" onClick={() => window.open(`https://devdocs.platon.network/docs/${i18n.language !== 'en' ? 'zh-CN' : 'en'}/MetaMask`)}>{t('login.install')}</Button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default connect((state: any) => ({ state }), mapDispatchToProps)(Login) 
