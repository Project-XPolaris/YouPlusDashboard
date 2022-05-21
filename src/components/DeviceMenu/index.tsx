import React from "react";
import styles from "@/components/RightContent/index.less";
import {Menu, Modal} from "antd";
import {ControlOutlined, PoweroffOutlined, ReloadOutlined} from "@ant-design/icons";
import HeaderDropdown from "@/components/HeaderDropdown";
import type {GlobalHeaderRightProps} from "@/components/RightContent/AvatarDropdown";
import type {MenuInfo} from "rc-menu/es/interface";
import {devicePowerOff, deviceReboot} from "@/services/ant-design-pro/info";
import {history} from "umi";

const { confirm } = Modal;

const DeviceMenu: React.FC<GlobalHeaderRightProps> = ({}) => {
  const onMenuClick = (info: MenuInfo) => {
    if (info.key === "poweroff") {
      confirm({
        type: "warning",
        title: "Shutdown device?",
        content: "Are you sure you want to shutdown device?",
        okText: "Shutdown",
        cancelText: "No",
        onOk() {
          devicePowerOff()
          history.push("/user/login");
        }
      })
    }
    if (info.key === "reboot") {
      confirm({
        type: "warning",
        title: "Reboot device?",
        content: "Are you sure you want to reboot device?",
        okText: "Reboot",
        cancelText: "No",
        onOk() {
          deviceReboot()
          history.push("/user/login");
        }
      })
    }
  }
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="poweroff">
        <PoweroffOutlined/>
        Power off
      </Menu.Item>
      <Menu.Item key="reboot">
        <ReloadOutlined/>
        Reboot
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span
        className={styles.action}
      >
        <ControlOutlined/>
      </span>
    </HeaderDropdown>
  );
};
export default DeviceMenu;
