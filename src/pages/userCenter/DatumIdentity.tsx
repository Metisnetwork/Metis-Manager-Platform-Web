import { FC, useContext, useEffect, useState } from 'react'
import { Form, Button, Spin, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import '@pages/nodeMgt/scss/index.scss'
import { nodeApi } from '@api/index'
import MyTag from '@com/MyTag'
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { BaseInfoContext } from '@/layout/index'

const DatumIdentity: FC<any> = (props: any) => {
  const [form] = Form.useForm()
  const { t, i18n } = useTranslation()
  const baseInfo = useContext(BaseInfoContext)
  const [hasService, setHasService] = useState<boolean>(false) // 是否已经连接
  const [modal2Visible, setModal2Visible] = useState<boolean>(false); // 提示
  const [loading, setLoading] = useState(false)
  const onFinish = () => { }
  const onFinishFailed = () => { }

  useEffect(() => {
    if (baseInfo?.status === 1) {
      setHasService(true)
    } else {
      setHasService(false)
    }
    form.setFieldsValue({
      carrierIp: baseInfo?.carrierIp,
      carrierPort: baseInfo?.carrierPort,
    })

  }, [baseInfo?.status])

  const joinNetwork = () => {
    setLoading(true)
    nodeApi.applyJoinNetwork().then(res => {
      if (res.status === 0) {
        message.success(`${t('tip.joinNetworkSuccess')}`)
      }
      setLoading(false)
      baseInfo.fetchData()
    })
  }

  const exitTips = () => {
    console.log(baseInfo.isAuthority);
    if (!baseInfo.isAuthority) return
    Modal.warning({
      centered: true,
      title: t('common.tips'),
      okText: t('overview.close'),
      icon: <ExclamationCircleOutlined />,
      content: t('orgManage.organizationMember')
    })
  }

  const missNetwork = () => {
    if (baseInfo?.dynamicFields?.runningTask) {
      message.error(`${t('node.nodeConfigurationStatusTips')}`)
      return
    }
    setLoading(true)
    nodeApi.withDrawNetwork().then(res => {
      if (res.status === 0) {
        message.success(`${t('node.logoutSuccess')}`)
        setLoading(false)
      }
      baseInfo.fetchData()
      setLoading(false)
      setModal2Visible(false)
    })
  }

  return (
    <>
      <div className="layout-box p-20">
        {baseInfo?.dynamicFields?.runningTask ?
          <div className="tip-box" style={{ height: 'auto' }}>{t('node.nodeConfigurationStatusTips')}</div> : ''
        }
        <div className="form-box">
          <Form
            size="large"
            name="basic"
            form={form}
            labelAlign="left"
            wrapperCol={{ span: 10 }}
            labelCol={{ style: { width: i18n.language === 'en' ? 180 : 160, whiteSpace: 'pre-wrap' } }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item colon label={t('common.orgName')} name="name" className="form-item">
              <p className="title">{baseInfo?.name}</p>
            </Form.Item>
            <Form.Item colon label={t('common.orgIdentify')} name="identityId" className="form-item">
              <p className="title">{baseInfo?.identityId}</p>
            </Form.Item>
            {/* <Form.Item colon label={t('UserCenter.builtWalletAddress')}
              className="form-item">
              <p className="title" style={{ paddingLeft: '11px' }}>{baseInfo?.carrierWallet}</p>
            </Form.Item> */}
            {hasService ? ( // 是否已经连接
              <>
                <Form.Item colon label={t('common.status')} className="form-item">
                  <MyTag margin content={`${t('node.connectSuccess')}`} bgColor="#B7EB8F" color="#45B854" />
                </Form.Item>
                <Form.Item colon={false} label={`${t('overview.connectNum')}：`} className="form-item">
                  <span className="title">{baseInfo?.connNodeCount}</span>
                </Form.Item>
                <Form.Item colon label={t('overview.bootAddress')} className="form-item">
                  <span className="address-info">{baseInfo?.localBootstrapNode}</span>
                </Form.Item>
                <Form.Item colon label={t('overview.nodeAddress')} className="form-item">
                  <span className="address-info">{baseInfo?.localMultiAddr}</span>
                </Form.Item>
                <Form.Item className="form-item">
                  <Button
                    type="primary"
                    style={{ marginLeft: i18n.language === 'en' ? 180 : 160 }}
                    loading={loading}
                    onClick={() => (!!baseInfo.isAuthority ? exitTips() : setModal2Visible(true))}
                  >
                    {t('node.writeOffNetwork')}
                  </Button>
                </Form.Item>
              </>
            ) : (
              <>
                {baseInfo?.carrierConnStatus == 'enabled' ?
                  <Form.Item colon={false} label={" "} className="form-item">
                    <MyTag margin content={`${t('node.connectSuccess')}`} bgColor="#B7EB8F" color="#45B854" />
                  </Form.Item> :
                  <Form.Item colon={false} className="form-item" label={" "}>
                    <MyTag margin content={`${t('node.connenctFailed')}`} bgColor="#FFA39E" color="#F45564" />
                  </Form.Item>
                }
                <Form.Item className="form-item">
                  <Button
                    type="primary"
                    loading={loading}
                    style={{ marginLeft: i18n.language === 'en' ? 180 : 160 }}
                    onClick={joinNetwork}
                  >
                    {t('overview.submit')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </div>
      <Modal
        centered
        visible={modal2Visible}
        okText={t('UserCenter.ModalSubmit')}
        cancelText={t('UserCenter.ModalCancel')}
        onOk={() => missNetwork()}
        onCancel={() => setModal2Visible(false)}
      >
        <p><ExclamationCircleOutlined />{t('UserCenter.ModalTips')}</p>
      </Modal>

    </>
  )
}

export default connect(
  (state: any) => ({ state }),
  (dispatch: any) => ({
    setBaseInfoStatus: (data: boolean) => {
      dispatch({
        type: 'SET_BASEINFO_STATUS',
        data,
      })
    },
  }),
)(DatumIdentity)
