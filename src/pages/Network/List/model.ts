import {useState} from "react";
import {fetchNetworkList} from "@/services/ant-design-pro/info";

const useNetworkListModel = () => {
  const [networks, setNetworks] = useState<API.Network[]>([])
  const refresh = async () => {
    const response = await fetchNetworkList()
    if (response.networks) {
      setNetworks(response.networks)
    }
  }
  return {
    networks,
    refresh
  }
}
export default useNetworkListModel
