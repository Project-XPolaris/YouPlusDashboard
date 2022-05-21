import {useState} from "react";

export type VdevNode = {
  title: string
  key: string
  type: string
  path: string
  as: string
  children: VdevNode[]
  parent: VdevNode | undefined
}
export type VdevTreeNode = {
  type: string
  path: string
  devices: VdevTreeNode[]
  spares: VdevTreeNode[]
  l2: VdevTreeNode[]
}
const useVdevTree = () => {
  const [data, setData] = useState<VdevNode>({
    key: '0',
    title: 'root',
    type: 'root',
    as: 'root',
    children: [],
    parent: undefined,
    path: 'root'
  })
  const addNode = (parentNode: VdevNode, node: VdevNode) => {
    const newData = {...data}
    parentNode.children.push(node)
    setData({...newData})
  }
  const addDisks = (parentNode: VdevNode, devType: string, disks: string[]) => {
    disks.forEach((disk: string) => {
      addNode(parentNode, {
        key: `${parentNode.key}-${parentNode.children.length}`,
        title: `${devType} - ${disk}`,
        type: 'disk',
        as: devType,
        children: [],
        parent: parentNode,
        path: `/dev/${disk}`
      })
    })
  }
  const addDisksDevice = (parentNode: VdevNode, disks: string[]) => {
    addDisks(parentNode, 'device', disks)
  }
  const addDisksSpares = (parentNode: VdevNode, disks: string[]) => {
    addDisks(parentNode, 'spare', disks)
  }
  const addDiskL2Cache = (parentNode: VdevNode, disks: string[]) => {
    addDisks(parentNode, 'l2Cache', disks)
  }
  const addVdevDevice = (parentNode: VdevNode, type: string, as: string) => {
    addNode(parentNode, {
      key: `${parentNode.key}-${parentNode.children.length}`,
      title: `${as} - ${type}`,
      type: type,
      as: as,
      children: [],
      parent: parentNode,
      path: ""
    })
  }
  const removeNode = (node: VdevNode) => {
    const newData = {...data}
    if (node.parent) {
      const parentNode = node.parent
      const index = parentNode.children.findIndex((child: VdevNode) => child.key === node.key)
      if (index > -1) {
        parentNode.children.splice(index, 1)
      }
    }
    setData({...newData})
  }
  const convert = (): VdevTreeNode => {
    const buildMapping: Record<string, VdevTreeNode>  = {}
    const walk  = (node: VdevNode) => {
      if (node.type === 'root') {
        buildMapping[node.key] = {
          type: 'root',
          path: '',
          devices: [],
          spares: [],
          l2: []
        }
        for (const child of node.children) {
          walk(child)
        }
        return;
      }
      if (!node.parent) {
        return
      }
      const newBuildNode: VdevTreeNode = {
        type: '',
        path: "",
        devices: [],
        spares: [],
        l2: []
      }
      const parentBuild = buildMapping[node.parent.key]
      if (node.type === 'mirror') {
        newBuildNode.type = 'mirror'
      }
      if (node.type === 'raidz'){
        newBuildNode.type = 'raidz'
      }
      if (node.type === 'disk'){
        newBuildNode.type = 'disk'
        newBuildNode.path = node.path
      }
      switch (node.as) {
        case 'device':
          parentBuild.devices.push(newBuildNode)
          break
        case 'spare':
          parentBuild.spares.push(newBuildNode)
          break
        case 'l2Cache':
          parentBuild.l2.push(newBuildNode)
          break
      }
      buildMapping[node.key] = newBuildNode
      for (const child of node.children) {
        walk(child)
      }
    }
    walk(data)
    return buildMapping[data.key]
  }

  return {
    data, addNode, addDisksDevice, addVdevDevice, addDiskL2Cache, addDisksSpares, removeNode,convert
  }
}
export default useVdevTree
