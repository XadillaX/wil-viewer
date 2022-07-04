import { Descriptions } from 'antd';
import { PreviewOperator } from '../state/PreviewOperator';

function PreviewInfo() {
  const previewOperator = PreviewOperator.useContainer();

  if (previewOperator.selectedIdx === -1) {
    return (<></>);
  }

  const num = previewOperator.selectedPreview.idx;
  const size = previewOperator.selectedPreview.content ?
    (`${previewOperator.selectedPreview.content.width} x ${previewOperator.selectedPreview.content.height}`) :
    ('...');
  const offset = previewOperator.selectedPreview.content ?
    (`[ ${previewOperator.selectedPreview.content.info.px}, ${previewOperator.selectedPreview.content.info.py} ]`) :
    ('...');

  return (
    <Descriptions
      title={<span style={{ userSelect: 'none', color: '#fff' }}>图片信息</span>}
      bordered
      size="small"
      column={1}
      style={{ margin: '10px' }}
      contentStyle={{ color: '#fff' }}
      labelStyle={{ width: '100px', userSelect: 'none' }}
    >
      <Descriptions.Item label="图片编号">{num}</Descriptions.Item>
      <Descriptions.Item label="尺寸">{size}</Descriptions.Item>
      <Descriptions.Item label="坐标偏移">{offset}</Descriptions.Item>
    </Descriptions>
  );
}

export default PreviewInfo;
