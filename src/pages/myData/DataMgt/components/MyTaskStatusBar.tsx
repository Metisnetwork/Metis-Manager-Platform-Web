
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MyTag from '../../../../components/MyTag'

const MyTaskStatusBar: FC<any> = (props: any) => {
  const { status, role, width } = props
  const { t } = useTranslation()
  const [color, colorSet] = useState<string>('')
  const [bgColor, bgColorSet] = useState<string>('')
  const [content, contentSet] = useState<string>('')
  const [border, borderSet] = useState<string>('')
  useEffect(() => {
    if (status === 'succeeded' || status === 'success') {
      colorSet('#52C41A')
      bgColorSet('#EBFDDA')
      contentSet(t('task.success'))
      borderSet('#B7EB8F')
    } else if (status === 'failed') {
      colorSet('#F5222D')
      bgColorSet('#F9DDDB')
      contentSet(t('task.failed'))
      borderSet('#FFA39E')
    } else if (status === 'pending') {
      colorSet('#1A6FC4')
      bgColorSet('#DAE6FD')
      contentSet(t('task.pending'))
      borderSet('#8FBDEB')
    } else if (status === 'computing') {
      colorSet('#781AC4')
      bgColorSet('#F3DAFD')
      contentSet(t('task.computing'))
      borderSet('#D08FEB')
    }
  }, [status])

  useEffect(() => {
    if (role === 'owner' || role === 0) {
      colorSet('#52C41A')
      bgColorSet('#EBFDDA')
      contentSet(t('computeNodeMgt.sponsor'))
      borderSet('#B7EB8F')
    } else if (role === 'dataSupplier' || role === 1) {
      colorSet('#F5222D')
      bgColorSet('#F9DDDB')
      contentSet(t('computeNodeMgt.dataSupplier'))
      borderSet('#FFA39E')
    } else if (role === 'algoSupplier' || role === 3) {
      colorSet('#1A6FC4')
      bgColorSet('#DAE6FD')
      contentSet(t('computeNodeMgt.algoSupplier'))
      borderSet('#8FBDEB')
    } else if (role === 'receiver' || role === 4) {
      colorSet('#781AC4')
      bgColorSet('#F3DAFD')
      contentSet(t('computeNodeMgt.receiver'))
      borderSet('#D08FEB')
    } else if (role === 'powerSupplier' || role === 2) {
      colorSet('#FAAD14')
      bgColorSet('#FDFCDA')
      contentSet(t('computeNodeMgt.powerSupplier'))
      borderSet('#FFDA06')
    }
  }, [role])

  return <MyTag content={content} radius='2' color={color} bgColor={bgColor} width={width} border={border}></MyTag>

}

export default MyTaskStatusBar