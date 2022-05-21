import {Avatar, Button, Input, List, Modal} from "antd";
import styles from "./index.less";
import useFileExplore from "@/hooks/explore";
import {useEffect} from "react";
import {FolderFilled} from "@ant-design/icons";

type SelectFolderDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (path: string) => void;
}
const SelectFolderDialog = ({ visible,onCancel,onOk }: SelectFolderDialogProps) => {
  const explore = useFileExplore({});
  useEffect(() => {
    explore.read("/");
  }, []);
  const listItem = explore.fileList.filter(it => it.type === 'Directory');
  return (
    <Modal
      title={"Select Folder"}
      visible={visible}
      onOk={() => onOk(explore.path)}
      onCancel={onCancel}
    >
      <div className={styles.header}>
        <Button onClick={explore.goBack}>
          Back
        </Button>
        <Input
          placeholder={"filePath"}
          className={styles.headerInput}
          value={explore.path}
          onChange={(e) => explore.setPath(e.target.value)}
        />
        <Button onClick={() => explore.read(undefined)}>
          Go
        </Button>
      </div>
      <List<API.PathItem>
        className={styles.list}
        dataSource={listItem}
        bordered
        renderItem={(file) => {
          return (
            <List.Item key={file.path}>
              <List.Item.Meta
                avatar={<Avatar icon={<FolderFilled />} />}
                title={<a onClick={() => explore.read(file.path)}>{file.name}</a>}
                description="Directory"
              />
            </List.Item>
          )
        }}
      />
    </Modal>
  )
}
export default SelectFolderDialog;
