import {Col, Drawer, Row} from "antd";
import useTaskModel from "@/hooks/task";
import {useRequest} from "ahooks";
import styles from "@/components/RightContent/index.less";
import {UnorderedListOutlined} from "@ant-design/icons";
import type {ReactElement} from "react";
import {useEffect, useState} from "react";
import InstallAppTaskCard from "@/components/InstallAppTaskCard";

export type TaskDrawerProps = {};
const TaskDrawer = ({}: TaskDrawerProps) => {
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
        className={styles.action}
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
