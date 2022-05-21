import {useState} from "react";
import {readDir} from "@/services/ant-design-pro/expolore";

const useFileExplore = ({ initPath = "/" }: { initPath?: string }) => {
  const [fileList, setFileList] = useState<API.PathItem[]>([]);
  const [path, setPath] = useState<string>(initPath);
  const read = async (targetPath: string | undefined = path) => {
    try {
      const list = await readDir(targetPath);
      setFileList(list);
      setPath(targetPath);
    } catch (e) {
      console.log(e);
    }
  }
  const goBack = async () => {
    const paths = path.split("/");
    paths.pop();
    setPath(paths.join("/"));
    await read(paths.join("/"));
  }
  return {
    read,fileList,path,goBack,setPath
  }
}
export default useFileExplore;
