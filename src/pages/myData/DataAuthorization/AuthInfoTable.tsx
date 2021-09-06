import { FC } from 'react'
import { Table } from 'antd'
import { useTranslation } from 'react-i18next'

const AuthInfoTable: FC<any> = (props: any) => {
  const { tableData, curPage, totalNum } = props
  const { t } = useTranslation()
  const onPageChange = (page: number) => {
    props.setPage(page)
  }
  const pagination = {
    defaultPageSize: 10
  }

  const columns = [{
    title: t('common.Num'),
    render: (text, record, index) => `${(curPage - 1) * pagination.defaultPageSize + (index + 1)}`,
  }, {
    title: t('center.fileField'),
    dataIndex: 'columnName',
  }, {
    title: t('center.dataType'),
    dataIndex: 'columnType',
    key: 'columnType',
  }, {
    title: t('center.remarks'),
    dataIndex: 'remarks',
    key: 'remarks',
  }]

  return <>
    <Table
      dataSource={tableData}
      rowKey={re => re.id}
      columns={columns}
      pagination={{ defaultCurrent: 1, total: totalNum, onChange: onPageChange }}
    />
  </>
}

export default AuthInfoTable