/* eslint-disable no-nested-ternary */
import React, { FC, useContext, useEffect, useState } from 'react'
import { Form, Button, Spin, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import '@pages/nodeMgt/scss/index.scss'
import { BaseInfoContext } from '@/layout/index'
import { nodeApi } from '@api/index'
import MyTag from '@com/MyTag'
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'

const MetisIdentity: FC<any> = (props: any) => {
  const [form] = Form.useForm()
  const { t, i18n } = useTranslation()
  const baseInfo = useContext(BaseInfoContext)
  const [editStatus, editStatusSet] = useState<boolean>(false) // 是否编辑状态
  const [hasService, setHasService] = useState<boolean>(false) // 是否已经连接
  const [modal2Visible, setModal2Visible] = useState<boolean>(false), // 提示
    [loading, setLoading] = useState(false)
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
    form
      .validateFields()
      .then(values => {
        console.log(values)
        const { errorFields } = values
        if (errorFields) return
        const { carrierIp, carrierPort } = form.getFieldsValue()
        setLoading(true)
        nodeApi.applyJoinNetwork().then(res => {
          if (res.status === 0) {
            // TODO:  临时解决办法 使用5秒后拉取最新状态的方式解决延迟的问题
            message.success(`${t('tip.joinNetworkSuccess')}`)
          } else {
            message.error(`${t('tip.joinNetworkFailed')}`)
          }
          setLoading(false)
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  const missNetwork = () => {
    setLoading(true)
    nodeApi.withDrawNetwork().then(res => {
      if (res.status === 0) {
        message.success(`${t('node.logoutSuccess')}`)
        setLoading(false)
      } else {
        message.error(`${t('node.logoutFailed')}`)
      }
      setLoading(false)
      setModal2Visible(false)
    })
  }

  return (
    <>
      <div className="layout-box">
        <div className="tip-box">{t('node.noRepeatSeedName')}</div>
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
            {hasService ? ( // 是否已经连接
              <>
                <Form.Item colon label={t('common.status')} className="form-item">
                  <MyTag margin content={`${t('node.connectSuccess')}`} bgColor="#B7EB8F" color="#45B854" />
                </Form.Item>
                <Form.Item colon={false} label={`${t('overview.connectNum')}：`} className="form-item">
                  {editStatus ? <span className="title">N/A</span> : <span className="title">{baseInfo?.connNodeCount}</span>}
                </Form.Item>
                <Form.Item colon label={t('overview.bootAddress')} className="form-item">
                  {editStatus ? <span className="title">N/A</span> : <span className="address-info">{baseInfo?.localBootstrapNode}</span>}
                </Form.Item>
                <Form.Item colon label={t('overview.nodeAddress')} className="form-item">
                  {editStatus ? <span className="title">N/A</span> : <span className="address-info">{baseInfo?.localMultiAddr}</span>}
                </Form.Item>
                <Form.Item className="form-item">
                  <Button
                    type="primary"
                    style={{ marginLeft: i18n.language === 'en' ? 180 : 160 }}
                    icon={<LoadingOutlined />} loading={loading}
                    onClick={() => setModal2Visible(true)}
                  >
                    {t('node.writeOffNetwork')}
                  </Button>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item className="form-item">
                  <MyTag margin content={`${t('node.connenctFailed')}`} bgColor="#FFA39E" color="#F45564" />
                </Form.Item>
                <Form.Item className="form-item">
                  <Button
                    type="primary"
                    icon={<LoadingOutlined />} loading={loading}
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
)(MetisIdentity)
