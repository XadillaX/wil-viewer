import { Button, InputNumber, message, Modal, Tag } from 'antd';
import { useState } from 'react';
import common from '../../common';

function JumpButton({ count, selectedIdx }: { count: number, selectedIdx: number }) {
  const [ showJumpModal, setShowJumpModal ] = useState(false);
  const [ currentValue, setCurrentValue ] = useState(selectedIdx);

  const handleOk = () => {
    if (currentValue < 0) setCurrentValue(-1);
    if (currentValue > count - 1) {
      message.error(`最大可输入 ${count - 1}。`);
      return;
    }

    common.selectedIdx = currentValue;
    setShowJumpModal(false);
  };

  return (
    <>
      <Button
        disabled={!count}
        style={{ width: '100%' }}
        onClick={() => {
          setShowJumpModal(true);
        }}
      >
        跳转
      </Button>
      <Modal
        visible={showJumpModal}
        title="跳转"
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={() => {
          setShowJumpModal(false);
        }}
      >
        <InputNumber
          min={0}
          max={count - 1}
          placeholder="请输入编号"
          value={selectedIdx === -1 ? '' : selectedIdx}
          onPressEnter={handleOk}
          onChange={value => {
            if (value === '' || value < 0) {
              setCurrentValue(-1);
            } else {
              setCurrentValue(value);
            }
          }}
        /> <br /><br />
        <Tag>共 {count} 张图片（{0} - {count - 1}）</Tag>
      </Modal>
    </>
  );
}

export default JumpButton;
