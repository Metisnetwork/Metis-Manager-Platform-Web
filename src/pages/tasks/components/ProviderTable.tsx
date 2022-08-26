import { FC, useState, useEffect } from 'react'
import { Table } from 'antd'
import { useTranslation } from 'react-i18next'

const ProviderTable: FC<any> = (props: any) => {
  const { type } = props
  const pagination = {
    current: 1,
    defaultPageSize: 10,
  }
  const { t } = useTranslation()
  const [curPage, curPageSet] = useState<number>(1)
  const onPageChange = (page: number) => {
    curPageSet(page)
  }

  const [columns, columnsSet] = useState<any>([])
  const baseColumns = [
    {
      title: t('common.Num'),
      width: 80,
      render: (text, record, index) => `${(curPage - 1) * pagination.defaultPageSize + (index + 1)}`,
    },
    {
      title: t('task.name'),
      width: 300,
      dataIndex: 'nodeName',
      render: (text, record, index) => {
        return (
          <div>
            <span>{record?.dynamicFields?.orgName || 'N/A'}</span> <span>({record.partyId})</span>
          </div>
        )
      }
    },
    {
      title: t('task.identity'),
      ellipsis: true,
      dataIndex: 'nodeIdentityId',
      render: (text, record, index) => {
        return <span>{record?.identityId || 'N/A'}</span>
      }
    }
  ]

  const dataColumns = [
    {
      // title: t('task.dataNameAndId'),
      title: t('common.info'),
      dataIndex: 'metaDataName',
      render: (text, record) => {
        return (
          <div>
            {/* {text}({record.metaDataId}) */}
            {t('voucher.VoucherName')}: {record.dataTokenName}
          </div>
        )
      },
    },
  ]

  const algoColumns = []

  useEffect(() => {
    if (type === 'sponsor' || type === 'receiver') {
      columnsSet([...baseColumns])
    } else if (type === 'dataSupplier') {
      columnsSet([...baseColumns, ...dataColumns])
    } else if (type === 'algorithmProvider') {
      columnsSet([...baseColumns, ...algoColumns])
    }
  }, [type])

  return (
    <div>
      <Table
        dataSource={props?.tableData}
        columns={columns}
        rowKey={_ => _.partyId || (new Date().getTime())}
        scroll={{ x: '100%' }}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: false,
          onChange: onPageChange,
        }}
        bordered
      />
    </div>
  )
}

export default ProviderTable
