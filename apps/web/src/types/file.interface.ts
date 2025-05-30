export interface IFile {
  id: string
  name: string
  size: number
  contentType: string
  key: string
  url: string
  bucket: string
  region: string
  createdAt: Date
  updatedAt: Date
}

export interface ICreateFile {
  name: string
  fileList: FileList
}

export interface IUpdateFile {
  id: string
  name: string
}
