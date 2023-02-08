import React from "react";
import {MenuProps, Modal} from "antd";
import {ControlOutlined, PoweroffOutlined, ReloadOutlined} from "@ant-design/icons";
import HeaderDropdown from "@/components/HeaderDropdown";
import type {GlobalHeaderRightProps} from "@/components/RightContent/AvatarDropdown";
import {devicePowerOff, deviceReboot} from "@/services/ant-design-pro/info";
import {history} from "@umijs/max";
import {useEmotionCss} from "@ant-design/use-emotion-css";

const {confirm} = Modal;

const DeviceMenu: React.FC<GlobalHeaderRightProps> = ({}) => {
  const actionClassName = useEmotionCss(({token}) => {
    return {
      display: 'flex',
      float: 'right',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: '0 12px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const menu: MenuProps['items'] = [
    {
      key: 'poweroff',
      label: (
        <a onClick={() => {
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
        }>
          Power off
        </a>
      ),
      icon: <PoweroffOutlined/>,
    },
    {
      key: 'reboot',
      label: (
        <a onClick={() => {
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
        }}>
          Reboot
        </a>
      ),
      icon: <ReloadOutlined/>,
    }
  ]
  return (
    <HeaderDropdown menu={{items:menu}}>
      <span
        className={actionClassName}
      >
        <ControlOutlined/>
      </span>
    </HeaderDropdown>
  );
};
export default DeviceMenu;
