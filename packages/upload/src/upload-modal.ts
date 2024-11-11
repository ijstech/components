import {
  Control,
  customElements,
  ControlElement,
  LibPath
} from '@ijstech/base';
import { application, IUploadItem } from '@ijstech/application';
import { Button } from '@ijstech/button';
import { Image } from '@ijstech/image';
import { hashFiles, ICidInfo } from '@ijstech/ipfs';
import { Label } from '@ijstech/label';
import { Modal } from '@ijstech/modal';
import { Progress } from '@ijstech/progress';
import { Icon } from '@ijstech/icon';
import { HStack, Panel, VStack } from '@ijstech/layout';

import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

import { UploadRawFile, Upload } from './upload';
// import Assets from "../assets";
// import { EVENT, FILE_STATUS, NODE_SERVER_END_POINT } from "../const/index";

import './style/upload-modal.css';

export enum FILE_STATUS {
  LISTED, // ALL
  SUCCESS,
  FAILED,
  UPLOADING,
}

const ITEMS_PER_PAGE = 5;

type BeforeUploadedCallback = (target: UploadModal, data: ICidInfo) => void;
type UploadedCallback = (target: UploadModal, file: File, cid: string) => void;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-upload-modal']: UploadModalElement;
    }
  }
}

export interface UploadModalElement extends ControlElement {
  rootCid?: string;
  parentDir?: Partial<ICidInfo>;
  onBeforeUploaded: BeforeUploadedCallback;
  onUploaded?: UploadedCallback;
}
export interface IIPFSItem {
  cid: string;
  name: string;
  size: number;
  type: 'dir' | 'file';
  links?: IIPFSItem[];
}
export interface IUploadResult {
  success: boolean;
  error?: string;
  data?: IIPFSItem;
}
@customElements('i-upload-modal')
export class UploadModal extends Control {
  private _uploadModalElm: Modal;
  private _closeBtnElm: Button;
  private _uploadBoxElm: Panel;
  private _fileUploader: Upload;
  private _fileIcon: Image;
  private _dragLabelElm: Label;

  private _statusFilterElm: HStack;
  private _filterBarElm: HStack;
  private _filterActionsElm: Panel;
  private _fileListElm: VStack;
  private _uploadBtnElm: Button;
  private _notePnlElm: Panel;
  private _paginationElm: HStack;

  private _rootCid: string;
  private _parentDir: Partial<ICidInfo>;
  public onBeforeUploaded: BeforeUploadedCallback;
  public onUploaded: UploadedCallback;

  private isForcedCancelled = false;
  private currentRequest: XMLHttpRequest;
  private currentPage = 1;
  private currentFilterStatus: FILE_STATUS = FILE_STATUS.LISTED;
  private files: File[] = [];
  private fileListData: {
    file: UploadRawFile;
    status: FILE_STATUS;
    percentage: number | string;
    url?: string;
  }[] = [];

  constructor(parent?: Control, options?: any) {
    super(parent, options);
  }

  get rootCid(): string {
    return this._rootCid;
  }
  set rootCid(value: string) {
    console.log('set rootCid: ', value);
    this._rootCid = value;
  }

  get parentDir(): Partial<ICidInfo> {
    return this._parentDir;
  }
  set parentDir(value: Partial<ICidInfo>) {
    console.log('set parentDir: ', value);
    this._parentDir = value;
  }

  async show(): Promise<void> {
    await this.init();
    if (!this.parentElement) document.body.appendChild(this);
    this.updateBtnCaption();
    this._uploadModalElm.visible = true;
    this._uploadModalElm.refresh();
  }

  private updateUI() {

  }

  hide() {
    this._uploadModalElm.visible = false;
    this.reset();
  }

  private onBeforeDrop(target: Upload) {
    console.log('onBeforeDrop: ', target);
    this._fileUploader.enabled = false;
    this._fileIcon.url = `${LibPath}assets/img/loading-icon.svg`;
    this._dragLabelElm.caption = 'Processing your files...';
  }

  private onBeforeUpload(target: Upload, file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  private filteredFileListData() {
    return this.currentFilterStatus === FILE_STATUS.LISTED
      ? this.fileListData
      : this.fileListData.filter((i) => i.status === this.currentFilterStatus);
  }

  private numPages() {
    return Math.ceil(this.filteredFileListData().length / ITEMS_PER_PAGE);
  }

  private setCurrentPage(page: number) {
    if (page >= 1 && page <= this.numPages()) this.currentPage = page;
    this.renderFileList();
    this.renderPagination();
  }

  private get isSmallWidth() {
    return !!window.matchMedia('(max-width: 767px)').matches;
  }

  private async renderFilterBar() {
    this._filterBarElm.clearInnerHTML();
    const isListed = this.currentFilterStatus === FILE_STATUS.LISTED;
    const listedBtnElm = new Button(this._filterBarElm, {
      caption: `All (${this.fileListData.length})`,
      boxShadow: 'none',
      background: {color: 'transparent'},
      font: {color: isListed ? Theme.colors.primary.dark : Theme.text.secondary, size: '0.875rem', weight: isListed ? 'bold' : 'normal'},
    });
    listedBtnElm.onClick = () =>
      this.onChangeCurrentFilterStatus(FILE_STATUS.LISTED);

    const isSuccess = this.currentFilterStatus === FILE_STATUS.SUCCESS;
    const successBtnElm = new Button(this._filterBarElm, {
      caption: `Success (${
        this.fileListData.filter((i) => i.status === FILE_STATUS.SUCCESS).length
      })`,
      boxShadow: 'none',
      background: {color: 'transparent'},
      font: {color: isSuccess ? Theme.colors.primary.dark : Theme.text.secondary, size: '0.875rem', weight: isSuccess ? 'bold' : 'normal'},
    });
    successBtnElm.onClick = () =>
      this.onChangeCurrentFilterStatus(FILE_STATUS.SUCCESS);

    const isFailed = this.currentFilterStatus === FILE_STATUS.FAILED;
    const failedBtnElm = new Button(this._filterBarElm, {
      caption: `Fail (${
        this.fileListData.filter((i) => i.status === FILE_STATUS.FAILED).length
      })`,
      boxShadow: 'none',
      background: {color: 'transparent'},
      font: {color: isFailed ? Theme.colors.primary.dark : Theme.text.secondary, size: '0.875rem', weight: isFailed ? 'bold' : 'normal'},
    });
    failedBtnElm.onClick = () =>
      this.onChangeCurrentFilterStatus(FILE_STATUS.FAILED);

    const isUploading = this.currentFilterStatus === FILE_STATUS.UPLOADING;
    const uploadingBtnElm = new Button(this._filterBarElm, {
      caption: `Uploading (${
        this.fileListData.filter((i) => i.status === FILE_STATUS.UPLOADING)
          .length
      })`,
      boxShadow: 'none',
      background: {color: 'transparent'},
      font: {color: isUploading ? Theme.colors.primary.dark : Theme.text.secondary, size: '0.875rem', weight: isUploading ? 'bold' : 'normal'},
    });
    uploadingBtnElm.onClick = () =>
      this.onChangeCurrentFilterStatus(FILE_STATUS.UPLOADING);
    // this.filterBar.append(...filterBtnUI);

    this._filterActionsElm.clearInnerHTML();
    if (this.currentFilterStatus === FILE_STATUS.UPLOADING) {
      const cancelBtnElm = new Button(this._filterActionsElm, {
        caption: 'Cancel',
        boxShadow: 'none',
        background: {color: Theme.colors.primary.light},
        font: {color: Theme.colors.primary.contrastText, size: '0.875rem'},
        padding: {top: '0.313rem', left: '0.675rem', right: '0.675rem', bottom: '0.313rem'}
      });
      cancelBtnElm.onClick = () => this.onCancel();
    } else {
      const clearBtnElm = new Button(this._filterActionsElm, {
        caption: 'Clear',
        boxShadow: 'none',
        background: {color: Theme.colors.primary.light},
        font: {color: Theme.colors.primary.contrastText, size: '0.875rem'},
        padding: {top: '0.313rem', left: '0.675rem', right: '0.675rem', bottom: '0.313rem'}
      });
      clearBtnElm.onClick = () => this.onClear();
    }
  }

  private async renderFileList() {
    // const fileUIData: Panel[] = [];
    this._fileListElm.clearInnerHTML();
    const filteredFileListData = this.filteredFileListData();
    const paginatedFilteredFileListData = this.isSmallWidth ? this.fileListData : [...filteredFileListData].slice(
      (this.currentPage - 1) * ITEMS_PER_PAGE,
      ITEMS_PER_PAGE * this.currentPage
    );

    for (let i = 0; i < paginatedFilteredFileListData.length; i++) {
      const fileData = paginatedFilteredFileListData[i];

      const fileElm = new HStack(this._fileListElm, {
        class: `file file-${i} status-${fileData.status}`,
        overflow: 'hidden',
        gap: '1rem',
        padding: {
          left: '0.75rem',
          right: '0.75rem',
          top: '0.5rem',
          bottom: '0.5rem',
        },
        stack: {shrink: '0', grow: '1'}
      });
      const fileIcon = new Icon(fileElm, {
        border: {radius: '0.5rem', width: '1px', color: Theme.divider, style: 'solid'},
        padding: {
          left: '0.35rem',
          right: '0.35rem',
          top: '0.35rem',
          bottom: '0.35rem',
        },
        name: 'file',
        width: '1.75rem',
        height: '1.75rem',
        fill: Theme.colors.primary.main,
        stack: {shrink: '0'}
      })
      const wrapper = new VStack(fileElm, {
        gap: '0.25rem',
        stack: {shrink: '1', grow: '1'},
        maxWidth: '100%',
        overflow: 'hidden'
      });
      const row1 = new HStack(wrapper, {
        gap: '1rem',
        horizontalAlignment: 'space-between',
        verticalAlignment: 'center'
      })
      const fileNameElm = new Label(row1, {
        caption: fileData.file.path || fileData.file.name,
        font: {weight: 600, size: '0.875rem'},
        maxWidth: '100%',
        textOverflow: 'ellipsis'
      });
      const removeBtnElm = new Icon(row1, {
        name: 'times',
        width: '0.875rem', height: '0.875rem',
        fill: Theme.text.primary,
        cursor: 'pointer'
      });
      removeBtnElm.onClick = () => this.onRemoveFile(i);
      const row2 = new HStack(wrapper, {
        gap: '0.5rem',
        verticalAlignment: 'center'
      })
      const sizeElm = new Label(row2, {
        caption: this.formatBytes(fileData.file.size || 0),
        font: {size: '0.75rem'},
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        opacity: 0.75
      });
      const statusElm = this.getStatus(fileData.status, row2);
      const row3 = new HStack(wrapper, {
        gap: '0.75rem',
        verticalAlignment: 'center'
      })
      const progressElm = new Progress(row3, {
        percent: fileData.percentage,
        stack: {grow: '1', shrink: '1', basis: '60%'},
        height: 'auto',
        border: {radius: '0.5rem'},
        strokeWidth: 10
      })
      const percentageElm = new Label(row3, {
        caption: `${fileData.percentage}%`,
        stack: {grow: '1', shrink: '0'},
        font: {size: '0.75rem'}
      });
    }
    // this._fileListElm.append(...fileUIData);
  }

  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  private getStatus(status: number, parent: HStack) {
    const iconEl = new Icon(parent, {
      name: 'times',
      width: '0.875rem', height: '0.875rem',
      padding: {top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem'},
      border: {radius: '50%'},
      background: {color: Theme.text.primary},
      fill: Theme.colors.primary.contrastText,
      visible: false
    })
    const statusElm = new Label(parent, {
      caption: '',
    })
    switch (status) {
      case 1:
        iconEl.name = 'check';
        iconEl.background.color = Theme.colors.success.main;
        iconEl.visible = true;
        statusElm.caption = 'Completed';
        break;
      case 2:
        iconEl.name = 'times';
        iconEl.background.color = Theme.colors.error.main;
        iconEl.visible = true;
        statusElm.caption = 'Failed';
      case 3:
        statusElm.caption = 'Uploading';
    }
    return statusElm;
  }

  private getPagination(currentIndex: number, totalPages: number) {
    let current = currentIndex,
      last = totalPages,
      delta = 2,
      left = current - delta,
      right = current + delta + 1,
      range = [],
      rangeWithDots = [],
      l;

    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  private async renderPagination() {
    const numPages = this.numPages();
    const rangeWithDots = this.getPagination(this.currentPage, numPages);

    if (numPages >= 1) {
      if (this.currentPage > numPages) {
        this.setCurrentPage(numPages);
      } else {
        this._paginationElm.clearInnerHTML();

        const prevBtn = new Button(this._paginationElm, {
          icon: { name: 'chevron-left', fill: Theme.colors.primary.dark, width: '0.75rem', height: '0.675rem' },
          width: '1.5rem',
          height: '1.5rem',
          border: {radius: '50%', width: '1px', style: 'solid', color: Theme.colors.primary.dark},
          font: {size: '0.688rem', weight: 700, color: Theme.colors.primary.dark},
          background: {color: 'transparent'},
          boxShadow: 'none'
        });
        prevBtn.onClick = () => {
          this.setCurrentPage(this.currentPage - 1);
        };

        for (let i = 0; i < rangeWithDots.length; i++) {
          const isActived = this.currentPage === rangeWithDots[i];
          const pageBtn = new Button(this._paginationElm, {
            caption: rangeWithDots[i].toString(),
            width: '1.5rem',
            height: '1.5rem',
            border: {radius: '50%', width: '1px', style: 'solid', color: Theme.colors.primary.dark},
            font: {size: '0.688rem', weight: 700, color: isActived ? Theme.colors.primary.contrastText : Theme.colors.primary.dark},
            background: {color: isActived ? Theme.colors.primary.dark : 'transparent'},
            boxShadow: 'none'
          });
          if (rangeWithDots[i] === '...') {
            pageBtn.border.color = 'transparent';
          } else {
            pageBtn.onClick = () => {
              this.setCurrentPage(rangeWithDots[i] as number);
            };
          }
        }
        const nexBtn = new Button(this._paginationElm, {
          icon: { name: 'chevron-right', fill: Theme.colors.primary.dark, width: '0.75rem', height: '0.675rem' },
          width: '1.5rem',
          height: '1.5rem',
          border: {radius: '50%', width: '1px', style: 'solid', color: Theme.colors.primary.dark},
          font: {size: '0.688rem', weight: 700, color: Theme.colors.primary.dark},
          background: {color: 'transparent'},
          boxShadow: 'none'
        });
        nexBtn.onClick = () => {
          this.setCurrentPage(this.currentPage + 1);
        };
      }
    } else {
      this._paginationElm.clearInnerHTML();
    }
  }

  private onChangeCurrentFilterStatus(status: FILE_STATUS) {
    this.currentFilterStatus = status;

    this.renderFilterBar();
    this.renderPagination();
    this.renderFileList();
  }

  private onClear() {
    switch (this.currentFilterStatus) {
      case FILE_STATUS.LISTED:
        this.fileListData =
          this.fileListData && this.fileListData.length
            ? this.fileListData.filter(
                (fileData) =>
                  ![
                    FILE_STATUS.LISTED,
                    FILE_STATUS.SUCCESS,
                    FILE_STATUS.FAILED,
                  ].includes(fileData.status)
              )
            : this.fileListData;
        break;
      case FILE_STATUS.SUCCESS:
        this.fileListData =
          this.fileListData && this.fileListData.length
            ? this.fileListData.filter(
                (fileData) => ![FILE_STATUS.SUCCESS].includes(fileData.status)
              )
            : this.fileListData;
        break;
      case FILE_STATUS.FAILED:
        this.fileListData =
          this.fileListData && this.fileListData.length
            ? this.fileListData.filter(
                (fileData) => ![FILE_STATUS.FAILED].includes(fileData.status)
              )
            : this.fileListData;
        break;
    }
    this.renderFilterBar();
    this.renderFileList();
    this.renderPagination();
  }

  private onCancel() {
    this.currentRequest.abort();
    this.isForcedCancelled = true;
  }

  private async onChangeFile(source: Control, files: File[]) {
    console.log('onChangeFile: ', files);
    return new Promise(async (resolve, reject) => {
      if (!files.length) reject();

      this._fileUploader.enabled = true;
      this._fileIcon.url = `${LibPath}assets/img/file-icon.png`;
      this.updateBtnCaption();

      for (let i = 0; i < files.length; i++) {
        this.fileListData.push({ file: files[i], status: 0, percentage: 0 });
        this.files.push(files[i]);
      }
      this.renderFileList();
      this.renderFilterBar();
      this.renderPagination();
      this.toggle(true);
      this._fileUploader.clear();
    });
  }

  private updateBtnCaption() {
    this._dragLabelElm.caption = this.isSmallWidth ? 'Select Files' : 'Drag and drop your files here';
  }

  private onRemove(source: Control, file: File) {}

  private onRemoveFile(index: number) {
    this.fileListData.splice(index, 1);
    this.files.splice(index, 1);
    this.renderFileList();
    this.renderFilterBar();
    this.renderPagination();

    if (!this.fileListData.length) {
      this.toggle(false);
    }
  }

  // private async getCID(file: File) {
  //   let fileString: string | ArrayBuffer = "";
  //   const reader = new FileReader();
  //   reader.onload = function (evt) {
  //     if (evt.target.readyState != 2) return;
  //     if (evt.target.error) {
  //       alert("Error while reading file");
  //       return;
  //     }
  //     fileString = evt.target.result;
  //   };
  //   reader.readAsText(file);
  //   const cid = await hashContent(fileString);
  //   return cid;
  // }

  // private async uploadRequest(i: number, file: { file: File }) {
  //   debugger;
  //   const formData = new FormData();
  //   formData.append("file", file.file, file.file.name);

  //   if (this.serverUrl) {
  //     return new Promise((resolve, reject) => {
  //       const _self = this;

  //       this.currentRequest = new XMLHttpRequest();
  //       this.currentRequest.open("POST", this.serverUrl);

  //       this.currentRequest.upload.addEventListener("progress", function (e) {
  //         const percentCompleted = (e.loaded / e.total) * 100;
  //         _self.fileListData[i].percentage = (
  //           Math.round(percentCompleted * 100) / 100
  //         ).toFixed(2);
  //         _self.renderFileList();
  //       });

  //       this.currentRequest.addEventListener("load", function (e) {
  //         const result = JSON.parse(_self.currentRequest.response);
  //         console.log("result: ", result, typeof result);
  //         if (result && result.cid) {
  //           if (_self.onUploaded)
  //             _self.onUploaded(_self, file.file, result.cid);
  //           _self.fileListData[i].status = FILE_STATUS.SUCCESS;
  //           _self.renderFileList();
  //         } else {
  //           console.log("why", result, typeof result);
  //           _self.fileListData[i].status = FILE_STATUS.FAILED;
  //         }
  //         _self.renderFilterBar();
  //         _self.renderFileList();
  //         _self.renderPagination();
  //       });

  //       this.currentRequest.addEventListener("error", function (e) {
  //         _self.fileListData[i].status = FILE_STATUS.FAILED;
  //         _self.renderFilterBar();
  //         _self.renderFileList();
  //         _self.renderPagination();
  //       });

  //       this.currentRequest.addEventListener("abort", function (e) {
  //         _self.fileListData[i].status = FILE_STATUS.FAILED;
  //         _self.renderFilterBar();
  //         _self.renderFileList();
  //         _self.renderPagination();
  //       });

  //       // send POST request to server
  //       this.currentRequest.send(formData);
  //       this.currentRequest.onload = function () {
  //         if (_self.currentRequest.status === 200) {
  //           resolve(_self.currentRequest.responseText);
  //         } else {
  //           reject(_self.currentRequest.status);
  //         }
  //       };
  //     });
  //   }
  // }
  private getDirItems(cidItem: ICidInfo, result?: ICidInfo[]): ICidInfo[] {
    result = result || [];
    if (cidItem.type == 'dir') {
      let items: ICidInfo[] = [];
      if (cidItem.links) {
        for (let i = 0; i < cidItem.links?.length; i++) {
          let item = cidItem.links[i];
          if (item.type == 'dir') this.getDirItems(item, result);
          items.push({
            cid: item.cid,
            name: item.name,
            size: item.size,
            type: item.type,
          });
        }
      }
      result.push({
        cid: cidItem.cid,
        name: cidItem.name,
        size: cidItem.size,
        type: 'dir',
        links: items,
      });
    }
    return result;
  }

  private async onUpload() {
    return new Promise(async (resolve, reject) => {
      if (!this.fileListData.length) reject();
      this._uploadBtnElm.caption = 'Uploading files to IPFS...';
      this._uploadBtnElm.enabled = false;
      this.isForcedCancelled = false;

      const cidItems = await hashFiles(this.files);
      console.dir('### IPFS Upload ###');
      console.log('cidItems: ', cidItems);
      let dirItems = this.getDirItems(cidItems);
      console.log('dirItems: ', dirItems);

      if (this.parentDir && this.rootCid) {
        // uploadTo
        const oldParentDirCID = cidItems.cid;
        dirItems = dirItems.filter(
          (dirItem) => dirItem.cid !== oldParentDirCID
        );
        const items: IUploadItem[] = [];
        for (let i = 0; i < dirItems.length; i++) {
          let item = dirItems[i];
          items.push({ cid: item });
        }
        for (let i = 0; i < this.fileListData.length; i++) {
          const file = this.fileListData[i];
          const cidItem = cidItems.links?.find(
            (cidItem) => cidItem.cid === file.file.cid?.cid
          );
          if (cidItem) items.push({ cid: cidItem, data: file.file });
        }
        try {
          const uploadResult = await application.uploadTo(
            this.parentDir.cid as string,
            items
          );
          console.log('uploadToResult: ', uploadResult);
          if (uploadResult && uploadResult.data) {
            uploadResult.data.name = this.parentDir.name as string;

            // Sync root folder
            if (this.parentDir.cid !== this.rootCid) {
              const syncResult = await application.uploadTo(this.rootCid, [
                { cid: uploadResult.data },
              ]);
              console.log('syncResult: ', syncResult);
              if (syncResult && syncResult.data) {
                if (this.onBeforeUploaded)
                  this.onBeforeUploaded(this, syncResult.data);
              }
            } else {
              if (this.onBeforeUploaded)
                this.onBeforeUploaded(this, uploadResult.data);
            }

            for (let i = 0; i < this.fileListData.length; i++) {
              const file = this.fileListData[i];
              if (this.onUploaded && file.file.cid)
                this.onUploaded(this, file.file, file.file.cid?.cid);
              file.status = FILE_STATUS.SUCCESS;
            }

            this.renderFilterBar();
            this.renderFileList();
          }
          // if (uploadResult && uploadResult.data) {
          //   // Sync root folder
          //   uploadResult.data.name = this.parentDir.name as string;
          //   console.log('uploadToResult before sync: ', this.parentDir);
          //   const syncResult = await application.uploadTo(this.rootCid, [
          //     { cid: uploadResult.data },
          //   ]);
          //   console.log('syncResult: ', syncResult);
          //   if (syncResult && syncResult.data) {
          //     if (this.onBeforeUploaded)
          //       this.onBeforeUploaded(this, syncResult.data);
          //   }
          // }
          // if (this.onUploaded)
          //   this.onUploaded(this, file.file, file.file.cid?.cid);
          // this.fileListData[i].status = FILE_STATUS.SUCCESS;
          // this.renderFilterBar();
          // this.renderFileList();
        } catch (err) {
          console.log('Error! ', err);
          // this.fileListData[i].status = FILE_STATUS.FAILED;
        }
      } else {
        // upload
        if (this.onBeforeUploaded) this.onBeforeUploaded(this, cidItems);
        let uploadUrl = await application.getUploadUrl(cidItems);

        for (let i = 0; i < dirItems.length; i++) {
          let item = dirItems[i];
          if (uploadUrl[item.cid]) {
            await application.upload(uploadUrl[item.cid], JSON.stringify(item));
          }
        }

        for (let i = 0; i < this.fileListData.length; i++) {
          if (this.isForcedCancelled) {
            break;
          } else {
            const file = this.fileListData[i];
            file.url = `/ipfs/${cidItems.cid}${
              file.file.path || file.file.name
            }`;
            if (
              [FILE_STATUS.SUCCESS, FILE_STATUS.UPLOADING].includes(
                file.status
              ) ||
              !file.file.cid?.cid
            ) {
              continue;
            }
            this.fileListData[i].status = FILE_STATUS.UPLOADING;
            this.renderFilterBar();

            if (uploadUrl[file.file.cid?.cid]) {
              try {
                let result = await application.upload(
                  uploadUrl[file.file.cid?.cid],
                  file.file
                );
                console.log('uploaded fileListData result: ', result);
                if (this.onUploaded)
                  this.onUploaded(this, file.file, file.file.cid?.cid);
                this.fileListData[i].status = FILE_STATUS.SUCCESS;
                this.renderFilterBar();
                this.renderFileList();
              } catch (err) {
                console.log('Error! ', err);
                this.fileListData[i].status = FILE_STATUS.FAILED;
              }
            }
          }
        }
        this.renderFilterBar();
        this.renderFileList();
        this.renderPagination();
        this._uploadBtnElm.caption = 'Upload file to IPFS';
        this._uploadBtnElm.enabled = true;
      }
    });
  }

  private reset() {
    this._fileListElm.clearInnerHTML();
    this._paginationElm.clearInnerHTML();
    this._uploadBtnElm.caption = 'Upload file to IPFS';
    this._uploadBtnElm.enabled = true;
    this.fileListData = [];
    this.files = [];
    this.toggle(false);
  }

  private toggle(showFileList: boolean) {
    if (showFileList) {
      this._statusFilterElm.visible = true;
      this._uploadBtnElm.visible = true;
      this._notePnlElm.visible = false;
    } else {
      this._statusFilterElm.visible = false;
      this._uploadBtnElm.visible = false;
      this._notePnlElm.visible = true;
    }
  }

  protected async init() {
    if (!this.initialized) {
      super.init();
      this.rootCid = this.getAttribute('rootCid', true);
      this.parentDir = this.getAttribute('parentDir', true);

      this._uploadModalElm = await Modal.create({
        showBackdrop: true,
        closeOnBackdropClick: false,
        popupPlacement: 'center',
        width: '800px',
        maxWidth: '100%',
        height: 'auto',
        padding: {top: 0, right: 0, bottom: 0, left: 0},
        border: {radius: '0.675rem'},
        boxShadow: '0 1px 5px 0 rgb(0 0 0 / 12%), 0 2px 10px 0 rgb(0 0 0 / 8%), 0 1px 20px 0 rgb(0 0 0 / 8%)',
        maxHeight: '90vh',
        overflow: {y: 'auto'},
        zIndex: 1000,
        mediaQueries: [
          {
            maxWidth: '767px',
            properties: {
              maxHeight: '100%',
              height: '100vh',
              width: '100vw'
            }
          }
        ],
        onClose: () => this.reset(),
      });
      this.appendChild(this._uploadModalElm);

      this._uploadBoxElm = new Panel(this, {
        height: '100%',
        overflow: 'hidden',
        border: {radius: '0.375rem'},
        padding: {
          top: '3.125rem',
          right: '8.5rem',
          bottom: '3.125rem',
          left: '8.125rem',
        },
        mediaQueries: [
          {
            maxWidth: '767px',
            properties: {
              padding: {
                top: '1.5rem',
                right: '1.5rem',
                bottom: '1.5rem',
                left: '1.5rem',
              }
            }
          }
        ]
      });

      // Close Button
      this._closeBtnElm = new Button(this._uploadBoxElm, {
        icon: { name: 'times' },
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        maxHeight: '10%',
        zIndex: 2,
        background: {color: 'transparent'},
        boxShadow: 'none',
        padding: {top: 0, right: 0, bottom: 0, left: 0},
        onClick: () => this.hide(),
      });

      const headingElm = new Label(this._uploadBoxElm, {
        caption: 'Upload more files',
        font: {size: 'clamp(1rem, 1rem + 0.625vw, 1.625rem)', color: Theme.colors.primary.dark, weight: 700},
        lineHeight: 1.5,
        display: 'block',
        class: "text-center"
      });

      const labelElm = new Label(this._uploadBoxElm, {
        caption: 'Choose file to upload to IPFS network',
        margin: {bottom: '0.5rem'},
        display: 'block',
        class: "text-center"
      });

      const fileUploaderDropzone = new VStack(this._uploadBoxElm, {
        maxHeight: 'calc(100% - 4.5rem)',
        margin: {top: '2rem', bottom: '2.5rem'},
        gap: '1.5rem'
      });
      fileUploaderDropzone.classList.add('file-uploader-dropzone');
      const droparea = new VStack(fileUploaderDropzone, {
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        padding: {top: '1.875rem', bottom: '1.875rem'},
        background: {color: 'rgba(255,255,255,.1)'},
        border: {radius: '0.625rem', width: '2px', style: 'dashed', color: Theme.colors.primary.light},
        cursor: 'pointer',
        gap: '1rem',
        position: 'relative'
      });

      this._fileUploader = new Upload(droparea, {
        multiple: true,
        draggable: true,
      });
      this._fileUploader.onBeforeDrop = (source: Upload) =>
        this.onBeforeDrop(source);
      this._fileUploader.onUploading = this.onBeforeUpload;
      this._fileUploader.onChanged = (source: Control, files: File[]) =>
        this.onChangeFile(source, files);
      this._fileUploader.onRemoved = () => this.onRemove;

      this._fileIcon = new Image(droparea, { width: 60, height: 60 });
      this._fileIcon.classList.add('icon');
      this._fileIcon.url = `${LibPath}assets/img/file-icon.png`;
      this._dragLabelElm = new Label(droparea, {
        caption: 'Drag and drop your files here',
      });

      this._statusFilterElm = new HStack(fileUploaderDropzone, {
        horizontalAlignment: 'space-between',
      });
      this._statusFilterElm.classList.add('status-filter');
      this._statusFilterElm.visible = false;
      this._filterBarElm = new HStack(this._statusFilterElm, {
        gap: '0.675rem',
        mediaQueries: [
          {
            maxWidth: '767px',
            properties: { visible: false }
          }
        ]
      });
      this._filterBarElm.classList.add('filter-bar');
      this._filterActionsElm = new Panel(this._statusFilterElm, {
        margin: {left: 'auto'}
      });

      this._fileListElm = new VStack(fileUploaderDropzone, { gap: '0.5rem', margin: { bottom: '0.5rem' }});
      this._fileListElm.classList.add('filelist');
      this._paginationElm = new HStack(fileUploaderDropzone, {
        gap: '0.313rem',
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        mediaQueries: [
          {
            maxWidth: '767px',
            properties: { visible: false }
          }
        ]
      });
      this._paginationElm.classList.add('pagination');
      this._uploadBtnElm = new Button(fileUploaderDropzone, {
        caption: 'Upload files to IPFS',
        class: 'upload-btn',
        boxShadow: 'none',
        background: {color: Theme.colors.primary.main},
        font: {color: Theme.colors.primary.contrastText},
        padding: {top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem'},
        visible: false,
      });
      // 'bafybeihjfcilu5jupyt7yllhbhjj3jx4js3scnlk7kcjk7rpsgxwktimba'
      this._uploadBtnElm.onClick = () => this.onUpload();

      this._notePnlElm = new Panel(this._uploadBoxElm);
      const note1Elm = new VStack(this._notePnlElm, {
        class: 'note',
        lineHeight: '1.4375rem',
        padding: {left: '1.25rem', right: '0.25rem'},
        gap: '1.5rem'
      });
      const head1Elm = new Label(note1Elm, {
        caption: 'Public Data',
        class: 'head',
        font: {weight: 700, size: '0.875rem'}
      });
      const desc1Elm = new Label(note1Elm, {
        caption:
          'All data uploaded to IPFS Explorer is available to anyone who requests it using the correct CID. Do not store any private or sensitive information in an unencrypted form using IPFS Explorer.',
        class: 'desc',
        font: {size: '0.75rem', weight: 400, color: Theme.text.secondary},
        letterSpacing: 0
      });

      const note2Elm = new VStack(this._notePnlElm, {
        class: 'note',
        lineHeight: '1.4375rem',
        padding: {left: '1.25rem', right: '0.25rem'},
      });
      const head2Elm = new Label(note2Elm, {
        caption: 'Permanent Data',
        class: 'head',
        font: {weight: 700, size: '0.875rem'}
      });
      const des2cElm = new Label(note2Elm, {
        caption:
          'Deleting files from the IPFS Explorer site’s Files page will remove them from the file listing for your account, but that doesn’t prevent nodes on the decentralized storage network from retaining copies of the data indefinitely. Do not use IPFS Explorer for data that may need to be permanently deleted in the future.',
        class: 'desc',
        font: {size: '0.75rem', weight: 400, color: Theme.text.secondary},
        letterSpacing: 0
      });
      this._uploadModalElm.item = this._uploadBoxElm;
    }
  }

  static async create(options?: UploadModalElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
