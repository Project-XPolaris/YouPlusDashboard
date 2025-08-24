import {useEffect, useState} from 'react';
import {fetchSMBRaw} from '@/services/ant-design-pro/sharefolder';
import {Card} from 'antd';
import {PageContainer} from '@ant-design/pro-components';

export default () => {
  const [raw, setRaw] = useState('');
  useEffect(() => {
    (async () => {
      const res = await fetchSMBRaw();
      if (res?.raw !== undefined) {
        setRaw(res.raw);
      }
    })();
  },[])

  return <PageContainer>
    <Card>
      <pre style={{whiteSpace:'pre-wrap'}}>{raw}</pre>
    </Card>
  </PageContainer>
}


