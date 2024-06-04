export interface FileCardProps {
  title: string;
  description: string;
  link: string;
}

export type FileInfo = {
  CID: string;
  CIDv1: string;
  contentType: string;
  createTime: string;
  fileStatus: number;
  fileUuid: string;
  link: string;
  name: string;
  path: string;
  size: number;
  updateTime: string;
};
