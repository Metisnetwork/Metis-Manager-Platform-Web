/* eslint-disable @typescript-eslint/no-unused-expressions */
import { FC, useState, createRef, useEffect } from 'react'
import { Descriptions, Space, Form, Input, Radio, Button, message, Select } from 'antd'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyRadioBtn } from './MyRadioBtn'
import MyFiledsTable from '../../../../components/MyFiledsTable'
import { resourceApi } from '../../../../api/index'
import MyModal from '../../../../components/MyModal'
import MyTag from '../../../../components/MyTag'
import { INDUSTRYLIST } from '../../../../config/constant'

export const NewDataAddtion: FC<any> = (props: any) => {
  const { t, i18n } = useTranslation()
  const { Option } = Select
  const { location } = props
  const { type, id, fileName } = location.state
  const [uploadFile, setUploadFile] = useState<any>({})
  const [newDataName, newDataNameSet] = useState<string>('')
  const [sourceName, sourceNameSet] = useState<string>('')
  const [sourceFileID, sourceFileIDSet] = useState<string>('')
  const [sourceFilePath, sourceFilePathSet] = useState<string>('')
  const [industry, industrySet] = useState<number>()
  const [remarks, remarksSet] = useState<string>('')
  const [metaDataPKId, metaDataPKIdSet] = useState<string>('')


  const [total, setTotal] = useState<number>()
  const [originalData, setOriginalData] = useState([])
  const [tableData, setTableData] = useState<[]>()
  const [curPage, setCurPage] = useState<number>(1)
  const history = useHistory()
  const inputRef = createRef<any>()
  const [upLoading, upLoadingSet] = useState(false)
  const [isModalVisible, isModalVisibleSet] = useState<boolean>(false)
  const [resultFileData, resultFileDataSet] = useState<any>({})
  const [form] = Form.useForm()
  const [isFileNameRight, isFileNameRightSet] = useState<boolean>(false)
  const [showFilenameAvailable, showFilenameAvailableSet] = useState<boolean>(false)

  const pagenation = {
    pagesize: 10,
  }

  const checkResourceName = name => {
    resourceApi.checkResourceName({ resourceName: name, metaDataId: resultFileData.metaDataId }).then(res => {
      if (res.status === 0) {
        showFilenameAvailableSet(true)
        isFileNameRightSet(res.data.status === 'Y')
      }
    })
  }

  const goBackFn = () => {
    isModalVisibleSet(true)
  }
  const handleCancel = () => {
    isModalVisibleSet(false)
  }
  const handleOk = () => {
    history.go(-1)
  }
  const submitFn = () => {
    form
      .validateFields()
      .then(values => {
        console.log(values);

        const queryObj = {
          addType: 2,
          industry,
          fileId: '',
          localMetaDataColumnList: originalData,
          // id: resultFileData.id,
          remarks: form.getFieldValue('remarks'),
          resourceName: form.getFieldValue('newDataName'), // 新资源名称

        }
        resourceApi.addLocalMetaData(queryObj).then(res => {
          if (res.status === 0) {
            message.success(`${t('tip.addMetaDataSuccess')}`)
            history.push('/myData')
          } else {
            message.error(res.msg)
          }
        })
      })
      .catch(error => { })
  }
  // TODO type
  const getShowSource = data => {
    return data.slice((curPage - 1) * pagenation.pagesize, curPage * pagenation.pagesize)
  }

  const handleRemarkChange = (e) => {
    remarksSet(e.target.value)
  }

  useEffect(() => {
    curPage && setTableData(getShowSource(originalData))
  }, [curPage])

  useEffect(() => {
    if (Object.keys(resultFileData).length > 0) {
      form.setFieldsValue({
        sourceName: resultFileData.resourceName,
        remarks: resultFileData.remarks,
      })
    }
  }, [resultFileData])

  const setPage = (page: number) => {
    setCurPage(page)
  }

  useEffect(() => {
    // 初始化查询当前id 数据
    resourceApi.queryMetaDataDetail(id).then(res => {
      console.log(res);
      const { data } = res
      if (res.status === 0) {
        industrySet(data.industry)
        form.setFieldsValue({ industry: data.industry })
        sourceNameSet(data.fileName)
        sourceFileIDSet(data.fileId)
        sourceFilePathSet(data.filePath)
        remarksSet(data.remarks)
        setOriginalData(data.localMetaDataColumnList)
        setTableData(getShowSource(data.localMetaDataColumnList))
        metaDataPKIdSet(data.metaDataPkId)
      }
    })
  }, [])


  return (
    <div className="layout-box">
      <div className="add-data-box">
        <Form
          name="basic"
          labelAlign="left"
          form={form}
          labelCol={{ span: i18n.language === 'en' ? 4 : 3 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        >
          <div className="sub-info-box">
            <Form.Item label={t('myData.originalDataName')} className="sub-ori-name">
              <p>{fileName}</p>
            </Form.Item>
            <Form.Item label={t('myData.newDataName')}>
              <div className="form-group">
                <Form.Item noStyle name="newDataName" rules={[{ required: true, message: `${t('tip.plzInputName')}` }]}>
                  <Input size="large" onBlur={e => checkResourceName(e.target.value)} className="limit-box width457" />
                </Form.Item>
                {showFilenameAvailable &&
                  (isFileNameRight ? (
                    <MyTag content={`${t('tip.availableFilename')}`} bgColor="#B7EB8F" color="#45B854" />
                  ) : (
                    <MyTag content={`${t('tip.unavailableFilename')}`} bgColor="#FFA39E" color="#F45564" />
                  ))}
              </div>
            </Form.Item>
          </div>
          <div className="sub-info-box">
            <div className="sub-title-box">{t('center.basicInfo')}</div>
            <div className="pl12">
              <Form.Item label={t('myData.sourceName')} name="sourceName">
                {/* <Input onBlur={e => checkResourceName(e.target.value)} className="limit-box" /> */}
                <p>{sourceName}</p>
                {/* <div className="tips">{t('myData.nameTips')}</div> */}
              </Form.Item>
              <Form.Item label={t('myData.sourceFileID')} name="sourceFileID">
                <p>{sourceFileID}</p>
              </Form.Item>
              <Form.Item label={t('myData.sourceFilePath')} name="sourceFilePath">
                <p>{sourceFilePath}</p>
              </Form.Item>
              <Form.Item label={t('myData.industryOfData')}>
                <Form.Item name="industry" noStyle initialValue={industry} rules={[{ required: true, message: `${t('tip.plzSelectIndustry')}` }]}>
                  <Select defaultValue={industry} key={industry} size="large" className="limit-box width457">
                    {INDUSTRYLIST.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {t(`myData.${item.text}`)}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Form.Item>
              <Form.Item label={t('center.dataDesc')}>
                <Form.Item name="remarks" noStyle rules={[{ required: true, message: `${t('tip.plzInputDesc')}` }]}>
                  <Input.TextArea value={remarks} onChange={handleRemarkChange} className="limit-box width457" />
                </Form.Item>
              </Form.Item>
            </div>
          </div>
          <div className="sub-info-box">
            <div className="sub-title-box">{t('center.fieldInfo')}</div>
            <MyFiledsTable
              originalData={originalData}
              tableData={tableData}
              total={total}
              setPage={setPage}
              loading={upLoading}
              curPage={curPage}
              row-key={re => re.columnIdx}
              mode="add"
            />
          </div>
        </Form>
        <div className="sub-info-box mb40">
          <Space size={40} className="btn-group">
            <Button size="large" className="btn" onClick={goBackFn}>
              {t('common.return')}
            </Button>
            <Button size="large" className="btn" type="primary" htmlType="submit" onClick={submitFn}>
              {t('common.submit')}
            </Button>
          </Space>
        </div>
      </div>

      <MyModal width={600} title={t('common.tips')} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>{`${t('tip.leaveCofirm')}`}</p>
      </MyModal>
    </div>
  )
}
