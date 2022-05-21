import type {VdevNode} from "@/hooks/vdev";
import {Card} from "antd";

const VdevTreeNodeItem = ({node}: {node: VdevNode}) => {
  return (
    <Card>
      {
        node.title
      }
    </Card>
  )

}
export default VdevTreeNodeItem
