import {Col, Drawer, Row} from "antd";
import useTaskModel from "@/hooks/task";
import {useRequest} from "ahooks";
import {UnorderedListOutlined} from "@ant-design/icons";
import type {ReactElement} from "react";
import {useEffect, useState} from "react";
import InstallAppTaskCard from "@/components/InstallAppTaskCard";
import {useEmotionCss} from "@ant-design/use-emotion-css";

const TaskDrawer = () => {
  const model = useTaskModel();
  const [visibleTask, setVisibleTask] = useState(false);

  const ctrl = useRequest(model.refresh, {
    pollingInterval: 1000,
  });
  useEffect(() => {
    if (visibleTask) {
      ctrl.run();
    } else {
      ctrl.cancel()
    }
  },[visibleTask])
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const renderCards = () => {
    const cards: ReactElement[] = [];
    model.tasks.forEach((task) => {
      switch (task.type) {
        case "InstallApp":
          cards.push(
            <Col span={24}>
              <InstallAppTaskCard task={task}/>
            </Col>
          );
          break;
      }
    })
    return cards
  }
  return (
    <>
      <span
        className={actionClassName}
        onClick={() => {
          setVisibleTask(true);
        }}
      >
        <UnorderedListOutlined/>
      </span>
      <Drawer visible={visibleTask} title={"Tasks"} onClose={() => setVisibleTask(false)}>
        <Row gutter={[0,8]}>
          {renderCards()}
        </Row>
      </Drawer>
    </>
  )
}
export default TaskDrawer;
