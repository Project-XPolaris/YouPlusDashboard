import {Avatar, Button, Col, Descriptions, Drawer, Dropdown, Input, List, Menu, Row, Space, Tabs, Tree} from "antd";
import {useState} from "react";
import styles from './index.less'
import type {VdevNode, VdevTreeNode} from "@/hooks/vdev";
import useVdevTree from "@/hooks/vdev";
import type {SelectDiskFormValues} from "@/components/SelectDiskDialog";
import SelectDiskDialog from "@/components/SelectDiskDialog";
import Title from "antd/lib/typography/Title";
import type {MenuInfo} from "rc-menu/es/interface";


type CreatePoolFormProps = {
  visible: boolean,
  onClose: () => void,
  onSubmit: ({name,conf}: {name: string,conf: VdevTreeNode}) => void,
}
const CreatePoolForm = ({visible,onClose,onSubmit}: CreatePoolFormProps) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [currentNode, setCurrentNode] = useState<VdevNode | undefined>(undefined)
  const [selectDiskDialogVisible, setSelectDiskDialogVisible] = useState<boolean>(false)
  const [addDiskType, setAddDiskType] = useState<string>('')
  const [poolName, setPoolName] = useState<string>('')
  const vdevTree = useVdevTree()
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setCurrentNode(info.node)
  };
  const onAddDevice = (values: SelectDiskFormValues) => {
    if (!currentNode) {
      return
    }
    switch (addDiskType) {
      case 'device':
        vdevTree.addDisksDevice(currentNode, values.disks ?? [])
        break
      case 'spares':
        vdevTree.addDisksSpares(currentNode, values.disks ?? [])
        break
      case 'l2Cache':
        vdevTree.addDiskL2Cache(currentNode, values.disks ?? [])
        break
    }
    setSelectDiskDialogVisible(false)
  }
  const renderAddMenu = (): any[] => {
    if (!currentNode) {
      return []
    }
    if (currentNode.type === 'root' || currentNode.type === 'mirror' || currentNode.type === 'raidz') {
      return [
        {
          type: 'sub',
          label: 'Disk',
          children: [
            {
              key: 'addDiskAsDevice',
              label: 'As Device',
            },
            {
              key: 'addDiskAsSpares',
              label: 'As Spares',
            },
            {
              key: 'addDiskAsL2Cache',
              label: 'As L2Cache',
            }
          ],
        },
        {
          type: 'sub',
          label: 'Vdev',
          children: [
            {
              type: 'group',
              label: 'As Device',

              children: [
                {
                  key: 'addVdevAsDevice/mirror',
                  label: 'In mirror',
                },
                {
                  key: 'addVdevAsDevice/raidz',
                  label: 'In raidz',
                },

              ]
            },
            {
              type: 'group',
              label: 'As Spares',
              children: [
                {
                  key: 'addVdevAsSpares/mirror',
                  label: 'In mirror',
                },
                {
                  key: 'addVdevAsSpares/raidz',
                  label: 'In raidz',
                },

              ]
            },
            {
              type: 'group',
              label: 'As l2',
              children: [
                {
                  key: 'addVdevAsL2Cache/mirror',
                  label: 'In mirror',
                },
                {
                  key: 'addVdevAsL2Cache/raidz',
                  label: 'In raidz',
                },

              ]
            }
          ]
        }
      ]

    }
    return []
  }

  const onAddMenuClick = (e: MenuInfo) => {
    switch (e.key) {
      case 'addDiskAsDevice':
        setSelectDiskDialogVisible(true)
        setAddDiskType('device')
        break
      case 'addDiskAsSpares':
        setSelectDiskDialogVisible(true)
        setAddDiskType('spares')
        break
      case 'addDiskAsL2Cache':
        setSelectDiskDialogVisible(true)
        setAddDiskType('l2Cache')
        break
      case 'addVdevAsDevice/mirror':
        if (currentNode) {
          vdevTree.addVdevDevice(currentNode, "mirror", "device")
        }
        break
      case 'addVdevAsDevice/raidz':
        if (currentNode) {
          vdevTree.addVdevDevice(currentNode, "raidz", "device")
        }
        break
      case 'addVdevAsSpares/mirror':
        if (currentNode) {
          vdevTree.addVdevDevice(currentNode, "mirror", "spares")
        }
        break
      case 'addVdevAsSpares/raidz':
        if (currentNode) {
          vdevTree.addVdevDevice(currentNode, "raidz", "spares")
        }
        break
      case 'addVdevAsL2Cache/mirror':
        if (currentNode) {
          vdevTree.addVdevDevice(currentNode, "mirror", "l2Cache")
        }
        break
      case 'addVdevAsL2Cache/raidz':
        if (currentNode) {
          vdevTree.addVdevDevice(currentNode, "raidz", "l2Cache")
        }
        break
    }
  }
  const onRemove = () => {
    if (!currentNode) {
      return
    }
    vdevTree.removeNode(currentNode)
    setCurrentNode(undefined)
  }
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={"70vw"}
      title={"Create pool"}
      extra={[
        <Button key="1" onClick={() => {
          onSubmit({name: poolName, conf: vdevTree.convert()})
        }}>Create</Button>,
      ]}
    >
      <SelectDiskDialog
        visible={selectDiskDialogVisible}
        onCancel={() => setSelectDiskDialogVisible(false)}
        onOk={onAddDevice}
      />
      <Row gutter={[8,24]}>
        <Col span={24}>
          <Title level={4}>Name</Title>
          <Input placeholder="Pool name" value={poolName} onChange={(e) => setPoolName(e.target.value)} />
        </Col>
        <Col span={24}>
          <Title level={4}>Vdev tree</Title>
          <Row>

            <Col span={12}>
              <Tree
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={onSelect}
                treeData={[vdevTree.data]}
                // titleRender={(node: TreeDataNode) => (<VdevTreeNodeItem node={node as VdevNode}/>)}
              />
            </Col>
            <Col span={12}>
              {
                currentNode && (
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <div className={styles.detailHeader}>
                        <Title level={2}>{currentNode.title}</Title>
                        <div>
                          <Space className={styles.headerAction}>
                            <Button type={"primary"} danger onClick={onRemove}>
                              Delete
                            </Button>
                          </Space>
                          {
                            renderAddMenu().length > 0 && (
                              <Space className={styles.headerAction}>
                                <Dropdown overlay={
                                  <Menu items={renderAddMenu()} onClick={onAddMenuClick}/>
                                }>
                                  <Button type={"primary"}>Add</Button>
                                </Dropdown>
                              </Space>

                            )
                          }
                        </div>
                      </div>
                      <Descriptions>
                        <Descriptions.Item label="Type">{currentNode.type}</Descriptions.Item>
                        <Descriptions.Item label="As">{currentNode.as}</Descriptions.Item>
                      </Descriptions>
                      <div className={styles.detailChildren}>
                        <Tabs>
                          <Tabs.TabPane tab="Device" key="device">
                            <List>
                              {
                                currentNode.children.filter(it => it.as === 'device').map(it => {
                                  return (
                                    <List.Item key={it.key}>
                                      <List.Item.Meta
                                        title={it.title}
                                      />
                                    </List.Item>
                                  )
                                })
                              }
                            </List>
                          </Tabs.TabPane>
                          <Tabs.TabPane tab="Spares" key="spares">
                            <List>
                              {
                                currentNode.children.filter(it => it.as === 'spares').map(it => {
                                  return (
                                    <List.Item key={it.key}>
                                      <List.Item.Meta
                                        title={it.title}
                                      />
                                    </List.Item>
                                  )
                                })
                              }
                            </List>
                          </Tabs.TabPane>
                          <Tabs.TabPane tab="L2Cache" key="l2Cache">
                            <List>
                              {
                                currentNode.children.filter(it => it.as === 'l2Cache').map(it => {
                                  return (
                                    <List.Item key={it.key}>
                                      <List.Item.Meta
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                                        title={it.title}
                                      />
                                    </List.Item>
                                  )
                                })
                              }
                            </List>
                          </Tabs.TabPane>
                        </Tabs>
                      </div>
                    </Col>
                  </Row>
                )
              }
            </Col>
          </Row>
        </Col>
      </Row>

    </Drawer>

  )
}
export default CreatePoolForm
