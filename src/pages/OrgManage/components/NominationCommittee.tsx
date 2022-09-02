import { FC, useRef, useState, useEffect, useMemo } from 'react'
import { Form, Input, Select, Button, message, Upload, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { orgManage } from '@api/index'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce';
import { dropByCacheKey, getCachingKeys } from 'react-router-cache-route'
import { connect } from 'react-redux'
const NominationCommittee: FC<any> = (props: any) => {
  const { t, i18n } = useTranslation()
  const [form] = Form.useForm()
  const [list, setList] = useState<any>([])
  const loading = useRef(false)
  const { identityId, type } = props.location.state
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState<any>('')
  const [uploading, setUploading] = useState(false)
  const [fetching, setFetching] = useState(false);

  const query = (init?) => {
    loading.current = true
    orgManage[type == 'out' ? 'getAuthorityList' : 'getNominateMember']({ keyword: init && init.keyword }).then(res => {
      const { status, data } = res
      if (status == 0) {
        const currentIdentityId = props?.org?.orgInfo?.identityId || ''
        setList(data.filter(v => !v?.isAdmin && v.identityId !== currentIdentityId).map((v: any) => ({
          ...v,
          label: type == 'out' ? v?.dynamicFields?.identityName : v?.nodeName,
          value: v.identityId
        })))
      }
      if (type == 'out' && init == 'init') {
        form.setFieldsValue({ identityId })
      }
      loading.current = false
      setFetching(false);
    })
  }

  useEffect(() => {
    query('init')
  }, [])
  useEffect(() => {
    if (loading.current) return
    setTimeout(() => {
      query()
    }, 300)
  }, [text])


  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      setList([])
      setFetching(true);
      query({ keyword: value })
    };
    return debounce(loadOptions, 500);
  }, [query, 500]);


  const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const handleChange = (info: any) => {
    const formData = new FormData()
    formData.append('file', info.file)
    setUploading(true)
    orgManage.getAuthorityUpload(formData).then(res => {
      const { data, status } = res
      if (status == 0) {
        getBase64(info.file, url => {
          setImageUrl(url);
        });
        form.setFieldsValue({ approvalMaterialURL: data })
      } else {
        setImageUrl('');
      }
      setUploading(false);
    })
  };

  const beforeUpload = (file: any) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(`${t('credential.sizeLimit')}10M`);
    }
    return false;
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined className="plus-icon" />}
      <div className="plus-tips">{t('credential.uploadTips')}</div>
    </div>
  );

  const submit = () => {
    form.validateFields().then(confirm)
  }


  const confirm = (values) => {
    orgManage[type == 'out' ? 'kickOut' : 'nominate']({
      identityId: values.identityId,
      ip: values.organizationIp || undefined,
      material: values.approvalMaterialURL,
      materialDesc: values.materialDesc,
      port: values.organizationPort || undefined,
      remark: values.remark,
    }).then(res => {
      const { status } = res
      if (status == 0) {
        message.success(t('task.success'))
        clearCache()
        history.go(-1)
      }
    })
  }

  const clearCache = () => {
    const keepAliveList = getCachingKeys()
    keepAliveList.forEach(v => {
      dropByCacheKey(v)
    })
  }


  return <div className="layout-box p-20 nomination-committee">
    <div className="title">
      {type == 'out' ? t('orgManage.nominationtoWithdrawalFromCommittee') : t('orgManage.nominationtoCommittee')}
    </div>
    <Form
      name="basic"
      size="large"
      colon={false}
      wrapperCol={{ span: 10 }}
      labelCol={{ style: { width: i18n.language === 'en' ? 180 : 160, whiteSpace: 'pre-wrap' } }}
      labelAlign="left"
      form={form}
    >
      <Form.Item
        label={t('orgManage.selectOrganization')}
        name="identityId"
        initialValue={identityId}
        rules={[{ required: true, message: `${t('center.pleaseSelect')}` }]}
      >
        <Select placeholder={t('center.pleaseSelect')} onSearch={debounceFetcher} showSearch
          notFoundContent={fetching ? <Spin size="small" /> : null}
          options={list}
          filterOption={false}
        >
        </Select>

      </Form.Item>
      {
        type == 'add' ? <>
          <Form.Item
            label={t('orgManage.organizationIp')}
            name="organizationIp"
            rules={[
              {
                required: true,
                validator: (rule, value, callback): any => {
                  if (!value) return callback(`${t('credential.pleaseEnter')}${t('orgManage.organizationIp')}`)
                  return callback()
                },
              },
            ]}
          >
            <Input
              onChange={e => form.setFieldsValue({ organizationIp: e.target?.value.replace(/\s*/g, "") } || '')}
              maxLength={20} ></Input>
          </Form.Item>
          <Form.Item
            label={t('orgManage.organizationPort')}
            name="organizationPort"
            rules={[
              {
                required: true,
                validator: (rule, value, callback): any => {
                  if (!value) return callback(`${t('credential.pleaseEnter')}${t('orgManage.organizationPort')}`)
                  return callback()
                },
              },
            ]}
          >
            <Input
              onChange={e => form.setFieldsValue({ organizationPort: e.target?.value.replace(/\s*/g, "") } || '')}
              maxLength={10} ></Input>
          </Form.Item>
        </> : ""
      }
      <Form.Item
        label={t('orgManage.postscriptNomination')}
        name="remark"
        rules={[
          {
            required: true,
            validator: (rule, value, callback): any => {
              if (!value) return callback(`${t('credential.pleaseEnter')}${t('orgManage.postscriptApplication')}`)
              return callback()
            },
          },
        ]}
      >
        <Input.TextArea
          onChange={e => form.setFieldsValue({ remark: e.target?.value.replace(/\s*/g, "") } || '')}
          maxLength={200} showCount></Input.TextArea>
      </Form.Item>
      <Form.Item
        label={t('orgManage.uploadApprovalDataImage')}
        name="InformationPicture"
      >
        <Upload
          accept="image/*"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', maxHeight: '100%' }} /> : uploadButton}
        </Upload>
      </Form.Item>
      <Form.Item
        label={t('orgManage.approvalMaterialURL')}
        name="approvalMaterialURL"
      >
        <Input disabled={true} placeholder={t('orgManage.approvalMaterialURL')} />
      </Form.Item>
      <Form.Item
        label={t('orgManage.approvalDataDescription')}
        name="materialDesc"
      >
        <Input.TextArea
          onChange={e => form.setFieldsValue({ materialDesc: e.target?.value.replace(/\s*/g, "") } || '')}
          maxLength={200} showCount></Input.TextArea>
      </Form.Item>
      <Form.Item
        label={` `}
      >
        <Button className="com-btn" onClick={submit} style={{ marginRight: '20px' }} type="primary">{t('common.submit')}</Button>
        <Button className="com-btn" onClick={() => history.go(-1)}>{t('common.return')}</Button>
      </Form.Item>
    </Form>
  </div>
}


export default connect(state => state)(NominationCommittee)