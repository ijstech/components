import { Control, customElements, ControlElement, I18n } from '@ijstech/base';
import { application } from '@ijstech/application';
import { Icon } from '@ijstech/icon';
import {Label} from '@ijstech/label';
import {VStack} from '@ijstech/layout';
import { hashFile, hashFiles } from '@ijstech/ipfs';
import { Image as IImage } from '@ijstech/image';
import './style/upload.css';
import * as Styles from '@ijstech/style';
import { GroupType } from '@ijstech/types';
const Theme = Styles.Theme.ThemeVars;

type beforeDropCallback = (target: Upload) => void;
type changedCallback = (target: Upload, files: UploadRawFile[]) => void;
type removedCallback = (target: Upload, file?: File) => void;
type uploadingCallback = (target: Upload, file: File) => Promise<boolean>;
type addedCallback = (target: Upload, file: File) => Promise<boolean>;

interface FileSystemEntry {
  fullPath: string;
  isFile: boolean;
  isDirectory: boolean;
  name: string;
}

interface FileSystemDirectoryReader {
  readEntries(
    successCallback: (entries: FileSystemEntry[]) => void,
    errorCallback?: (error: FileError) => void
  ): void;
}

interface FileError extends Error {}

let fileId = 1;
export const genFileId = () => Date.now() + fileId++;
export interface UploadRawFile extends File {
  uid?: number;
  path?: string;
  cid?: {
    cid: string;
    size: number;
  };
}
export interface UploadElement extends ControlElement {
  fileList?: File[];
  multiple?: boolean;
  accept?: string;
  draggable?: boolean;
  caption?: string;
  showFileList?: boolean;
  onBeforeDrop?: beforeDropCallback;
  onChanged?: changedCallback;
  onRemoved?: removedCallback;
  onAdded?: addedCallback;
  onUploading?: uploadingCallback;
}

interface UploadDragElement extends ControlElement {
  fileList?: File[];
  caption?: string;
  disabled?: boolean;
  onBeforeDrop?: any;
  onDrop?: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-upload']: UploadElement;
      ['i-upload-drag']: UploadDragElement;
    }
  }
}
@customElements('i-upload-drag')
class UploadDrag extends Control {
  private _wrapperElm: HTMLElement;
  private _labelElm: HTMLElement;
  private _caption: string;
  private _disabled: boolean;
  public onBeforeDrop: (source: Control) => void;
  public onDrop: (source: Control, files: UploadRawFile[]) => void;
  private counter: number = 0;

  constructor(parent?: Control, options?: any) {
    super(parent, options);
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    if (this._labelElm && this._caption?.startsWith('$'))
      this._labelElm.textContent = i18n.get(this._caption) || '';
  }

  get caption(): string {
    let value = this._caption || '';
    if (value?.startsWith('$')) {
      const translated =
        this.parent?.parentModule?.i18n?.get(value) ||
        application.i18n?.get(value) ||
        ''
      return translated;
    }
    return value;
  }
  set caption(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._caption = value;
    this._labelElm.style.display = !value ? 'none' : '';
    if (!this._labelElm) return;
    this._labelElm.textContent = this.caption;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  handleOnDragEnter(source: any, event?: Event) {
    source.preventDefault();
    if (this.disabled) return;
    this.counter++;
    this.parentElement?.classList.add('i-upload-dragger_active');
  }

  handleOnDragOver(source: any, event?: Event) {
    source.preventDefault();
  }

  handleOnDragLeave(source: any, event?: Event) {
    if (this.disabled) return;
    this.counter--;
    if (this.counter === 0) {
      this.parentElement?.classList.remove('i-upload-dragger_active');
    }
  }

  private async getAllFileEntries(dataTransferItemList: DataTransferItemList) {
    let fileEntries = [];
    // Use BFS to traverse entire directory/file structure
    let queue = [];
    // Unfortunately dataTransferItemList is not iterable i.e. no forEach
    for (let i = 0; i < dataTransferItemList.length; i++) {
      // Note webkitGetAsEntry a non-standard feature and may change
      // Usage is necessary for handling directories
      queue.push(dataTransferItemList[i].webkitGetAsEntry());
    }
    while (queue.length > 0) {
      let entry = queue.shift();
      if (entry?.isFile) {
        fileEntries.push(entry);
      } else if (entry?.isDirectory) {
        let reader: any = (entry as any).createReader();
        queue.push(...(await this.readAllDirectoryEntries(reader)));
      }
    }

    return Promise.all(
      fileEntries.map((entry) => this.readEntryContentAsync(entry))
    );
  }

  // Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
  private async readAllDirectoryEntries(
    directoryReader: FileSystemDirectoryReader
  ) {
    let entries = [];
    let readEntries: any = await this.readEntriesPromise(directoryReader);
    while (readEntries.length > 0) {
      entries.push(...readEntries);
      readEntries = await this.readEntriesPromise(directoryReader);
    }
    return entries;
  }

  // Wrap readEntries in a promise to make working with readEntries easier
  private async readEntriesPromise(directoryReader: FileSystemDirectoryReader) {
    try {
      return await new Promise((resolve, reject) => {
        directoryReader.readEntries(resolve, reject);
      });
    } catch (err) {
      console.log(err);
    }
  }

  private async readEntryContentAsync(entry: FileSystemEntry | any) {
    return new Promise<UploadRawFile[]>((resolve, reject) => {
      let reading = 0;
      const contents: UploadRawFile[] = [];

      reading++;
      entry.file(async (file: any) => {
        reading--;
        const rawFile = file as UploadRawFile;
        rawFile.path = entry.fullPath;
        rawFile.cid = await hashFile(file);
        contents.push(rawFile);

        if (reading === 0) {
          resolve(contents);
        }
      });
    });
  }

  async handleOnDrop(source: any, event?: Event) {
    source.preventDefault();
    if (this.disabled) return;
    if (typeof this.onBeforeDrop === 'function') this.onBeforeDrop(this);

    this.counter = 0;
    this.parentElement?.classList.remove('i-upload-dragger_active');

    const accept = this.parentElement?.getAttribute('accept');
    if (!accept) {
      if (this.onDrop) {
        const files = await this.getAllFileEntries(source.dataTransfer.items);
        const flattenFiles = files.reduce((acc, val) => acc.concat(val), []);
        console.log('beforeOnDrop: ', flattenFiles);
        this.onDrop(this, flattenFiles); //this.onDrop(this, source.dataTransfer.files);
      }
      return;
    }

    const valids = [].slice.call(source.dataTransfer.files).filter((file) => {
      const { type, name }: { type: string; name: string } = file;
      const extension =
        name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : '';
      const baseType = type.replace(/\/.*$/, '');
      return accept
        .split(',')
        .map((type) => type.trim())
        .filter((type) => type)
        .some((acceptedType) => {
          if (/\..+$/.test(acceptedType)) {
            return extension === acceptedType;
          }
          if (/\/\*$/.test(acceptedType)) {
            return baseType === acceptedType.replace(/\/\*$/, '');
          }
          if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
            return type === acceptedType;
          }
          return false;
        });
    });
    if (this.onDrop) this.onDrop(this, valids);
  }

  protected init() {
    if (!this._wrapperElm) {
      super.init();

      this.onBeforeDrop =
        this.getAttribute('onBeforeDrop', true) || this.onBeforeDrop;
      this.onDrop = this.getAttribute('onDrop', true) || this.onDrop;
      this._wrapperElm = this.createElement('div', this);
      this._wrapperElm.classList.add('i-upload-drag_area');

      this._labelElm = this.createElement('span', this._wrapperElm);
      this._labelElm.style.color = Theme.text.primary;
      this.caption = this.getAttribute('caption', true);

      this.disabled = this.getAttribute('disabled', true);

      this.addEventListener('dragenter', this.handleOnDragEnter.bind(this));
      this.addEventListener('dragover', this.handleOnDragOver.bind(this));
      this.addEventListener('dragleave', this.handleOnDragLeave.bind(this));
      this.addEventListener('drop', this.handleOnDrop.bind(this));
    }
  }

  static async create(options?: UploadDragElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}

const DEFAULT_VALUES = {
  draggable: false,
  multiple: false,
  showFileList: false,
  fileList: []
}

@customElements('i-upload', {
  icon: 'file',
  group: GroupType.FIELDS,
  className: 'Upload',
  props: {
    caption: { type: 'string', default: '' },
    accept: { type: 'string', default: '' },
    draggable: { type: 'boolean', default: DEFAULT_VALUES.draggable },
    multiple: { type: 'boolean', default: DEFAULT_VALUES.multiple },
    fileList: { type: 'array', default: DEFAULT_VALUES.fileList },
    showFileList: { type: 'boolean', default: DEFAULT_VALUES.showFileList },
  },
  events: {
    onBeforeDrop: [
      {name: 'target', type: 'Upload', isControl: true}
    ],
    onChanged: [
      {name: 'target', type: 'Upload', isControl: true},
      {name: 'files', type: 'UploadRawFile[]'}
    ],
    onRemoved: [
      {name: 'target', type: 'Upload', isControl: true},
      {name: 'file', type: 'File'}
    ],
    onAdded: [
      {name: 'target', type: 'Upload', isControl: true},
      {name: 'file', type: 'File'}
    ],
    onUploading: [
      {name: 'target', type: 'Upload', isControl: true},
      {name: 'file', type: 'File'}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      caption: {
        type: 'string'
      },
      accept: {
        type: 'string'
      },
      draggable: {
        type: 'boolean',
        default: DEFAULT_VALUES.draggable
      },
      multiple: {
        type: 'boolean',
        default: DEFAULT_VALUES.multiple
      },
      showFileList: {
        type: 'boolean',
        default: DEFAULT_VALUES.showFileList
      }
    }
  }
})
export class Upload extends Control {
  private _wrapperElm: HTMLElement;
  private _wrapperFileElm: HTMLElement;
  private _fileElm: HTMLInputElement;
  private _previewElm: HTMLElement;
  private _previewImgElm: IImage;
  private _previewRemoveElm: HTMLElement;
  private _wrapImgElm: HTMLElement;
  private _fileListElm: HTMLElement;
  private _uploadDragElm: UploadDrag;
  private lblCaption: Label;

  private _caption: string;
  private _accept: string;
  private _draggable: boolean;
  private _multiple: boolean;
  private isPreviewing: boolean;

  public onBeforeDrop: beforeDropCallback;
  public onChanged: changedCallback;
  public onRemoved: removedCallback;
  public onAdded: addedCallback;
  public onUploading: uploadingCallback;
  private _dt: DataTransfer = new DataTransfer();

  // @observable('fileList')
  private _fileList: UploadRawFile[] = [];

  constructor(parent?: Control, options?: any) {
    super(parent, options, {
      multiple: DEFAULT_VALUES.multiple
    });
  }

  get caption(): string {
    return this._caption;
  }
  set caption(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._caption = value;
    if (this.lblCaption)
      this.lblCaption.caption = this.caption || (this.draggable ? 'Drag a file or click to upload' : 'Click to upload')
  }

  get accept(): string {
    return this._accept;
  }
  set accept(value: string) {
    this._accept = value;
    this._fileElm && value && this._fileElm.setAttribute('accept', `${value}`);
  }

  get draggable(): boolean {
    return this._draggable;
  }
  set draggable(value: boolean) {
    this._draggable = value;
    if (value) this.classList.add('el-upload-dragger');
    else this.classList.remove('el-upload-dragger');
  }

  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = value;
    if (this._fileElm && value != null)
      this._fileElm.multiple = value;
  }

  get fileList(): UploadRawFile[] {
    return this._fileList;
  }
  set fileList(value: UploadRawFile[]) {
    this._fileList = value;

    if (value && value.length) {
      value.forEach((f) => {
        this._dt.items.add(f);
      });
      if (this._fileElm) {
        this._fileElm.files = this._dt.files;
        this.updateFileListUI(this._fileElm.files);
      }
    }
  }

  get enabled(): boolean {
    return super.enabled;
  }
  set enabled(value: boolean) {
    super.enabled = value;

    if (this._uploadDragElm)
      this._uploadDragElm.disabled = !value || !this.draggable || this._designMode;

    if (!this._previewRemoveElm) return;
    if (value) this._previewRemoveElm.classList.add('active');
    else this._previewRemoveElm.classList.remove('active');
  }

  private addFile(file: UploadRawFile) {
    this._dt.items.add(file);
    this._fileList.push(file);
    if (typeof this.onAdded === 'function') this.onAdded(this, file);
  }

  private previewFile(files: FileList) {
    if (!files || !files.length) return;
    const imgUrl = URL.createObjectURL(files[files.length - 1]);
    this.preview(imgUrl);
  }

  private async handleUpload(source: any, event?: Event) {
    const files = source.target.files;
    if (files) {
      const processedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const rawFile = files[i] as UploadRawFile;
        rawFile.path = `/${rawFile.name}`;
        rawFile.cid = await hashFile(rawFile);
        processedFiles.push(rawFile);
      }
      this.proccessFiles(processedFiles);
    }
  }

  private async proccessFiles(files: UploadRawFile[]) {
    if (!files || !files.length) return;
    if (!this.fileList) this._dt = new DataTransfer();

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      file.uid = genFileId();
      if (!!this.onUploading) await this.checkBeforeUpload(file);
      else this.addFile(file);
    }
    this.updateFileListUI(this._dt.files);
    this.previewFile(this._dt.files);

    if (typeof this.onChanged === 'function') this.onChanged(this, this.fileList);
    if (typeof this.onObserverChanged === 'function') this.onObserverChanged(this, this.fileList as any);
  }

  private async checkBeforeUpload(file: UploadRawFile) {
    const before = typeof this.onUploading === 'function' && this.onUploading(this, file);
    if (before && before.then) {
      before.then(
        (value: boolean) => {
          if (value) this.addFile(file);
        },
        () => {
          if (typeof this.onRemoved === 'function') this.onRemoved(this, file);
        }
      );
    } else {
      if (typeof this.onRemoved === 'function') this.onRemoved(this, file);
    }
  }

  private updateFileListUI(files: FileList) {
    if (this._fileListElm) {
      this._fileListElm.innerHTML = '';
      for (let file of files) {
        const itemElm = this.createElement('div', this._fileListElm);
        itemElm.classList.add('i-upload_list-item');
        if (file.type.includes('image/')) {
          this._fileListElm.classList.add('i-upload_list-picture');
          const imgElm = new Image();
          imgElm.src = URL.createObjectURL(file);
          imgElm.classList.add('i-upload_list-img');
          imgElm.onload = function () {
            URL.revokeObjectURL(imgElm.src);
          };
          itemElm.appendChild(imgElm);
        } else {
          this._fileListElm.classList.add('i-upload_list-text');
          const spanElm = this.createElement('span', itemElm);
          spanElm.textContent = file.name;
        }

        const removeIcon = new Icon(undefined, {
          width: 12,
          height: 12,
          fill: Theme.action.active,
          name: 'trash',
        });
        itemElm.appendChild(removeIcon);
        removeIcon.addEventListener('click', () => this.handleRemove(file));
      }
      this._fileListElm.style.display = files.length ? 'flex' : 'none';
    }
  }

  private renderPreview() {
    this._previewElm = this.createElement('div', this._wrapperElm);
    this._previewElm.classList.add('i-upload_preview');
    this._wrapImgElm = this.createElement('div', this._previewElm);
    this._wrapImgElm.classList.add('i-upload_preview-img');
    this._previewRemoveElm = this.createElement('div', this._previewElm);
    if (this.enabled) {
      this._previewRemoveElm.classList.add('active');
    } else {
      this._previewRemoveElm.classList.remove('active');
    }
    this._previewRemoveElm.classList.add('i-upload_preview-remove');
    this._previewRemoveElm.onclick = this.handleRemoveImagePreview.bind(this);
    const span = this.createElement('span', this._previewRemoveElm);
    span.style.fontFamily = Theme.typography.fontFamily;
    span.innerHTML = 'Click to remove';
  }

  private handleRemoveImagePreview (event: Event) {
    if (!this.isPreviewing || !this.enabled) return;
    event.stopPropagation();
    const file = this._dt.files.length ? this._dt.files[0] : undefined;
    this.clear();
    if (typeof this.onRemoved === 'function') this.onRemoved(this, file);
  };

  private handleRemove(file: File) {
    const rawFile = file as UploadRawFile;
    for (let i = 0; i < this._dt.items.length; i++) {
      if (rawFile.uid === (this._dt.files[i] as UploadRawFile).uid) {
        this._dt.items.remove(i);
        this.fileList = this._fileList.filter(
          (f) => (f as UploadRawFile).uid !== rawFile.uid
        );
        if (typeof this.onRemoved === 'function') this.onRemoved(this, file);
        break;
      }
    }

    this._fileElm.files = this._dt.files;
    this.updateFileListUI(this._dt.files);
    if (!this._dt.items.length) this.clear();
  }

  toBase64(file: File) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  preview(uri: string) {
    if (!uri) return;
    this.isPreviewing = true;
    this._wrapImgElm.innerHTML = '';
    this._previewImgElm = new IImage(undefined, {
      width: 'auto',
      height: '100%'
    });
    this._wrapImgElm.appendChild(this._previewImgElm);
    this._previewImgElm.url = uri;

    this._previewElm.style.display = 'block';
    this._wrapperFileElm.style.display = 'none';
    if (this._uploadDragElm) this._uploadDragElm.style.display = 'none';
  }

  clear() {
    this._fileElm.value = '';
    this._wrapperFileElm.style.display = 'block';
    if (this._uploadDragElm)
      this._uploadDragElm.style.display = this.draggable ? 'flex' : 'none';
    if (this._previewElm) this._previewElm.style.display = 'none';
    this._wrapImgElm && (this._wrapImgElm.innerHTML = '');
    if (this._fileListElm) this._fileListElm.style.display = 'none';
    this._dt = new DataTransfer();
    this.isPreviewing = false;
    this._fileList = [];
  }
  async upload() {
    const cidItems = await hashFiles(this._fileList);
    let uploadUrl = await application.getUploadUrl(cidItems);

    for (let i = 0; i < this._fileList.length; i++) {
      const file = this._fileList[i];
      if (file.cid?.cid && uploadUrl[file.cid.cid]) {
        let result = await application.upload(
          uploadUrl[file.cid.cid],
          file
        );
        console.log("upload result: ", result);
      }
    }

    // let cid = await hashFiles(this._fileList);
    // let result = await application.postData(endpoint, cid);
    // console.dir(result);
  }
  addFiles() {}

  addFolder() {}

  protected init() {
    if (!this.initialized) {
      super.init();
      this._wrapperElm = this.createElement('div', this);
      this._wrapperElm.classList.add('i-upload-wrapper');
      this._wrapperFileElm = this.createElement('div', this._wrapperElm);

      this._caption = this.getAttribute('caption', true, '');
      this.draggable = this.getAttribute('draggable', true, DEFAULT_VALUES.draggable);

      this._uploadDragElm = new UploadDrag(this, {
        // caption: this.caption || 'Drag a file or click to upload',
        disabled: !this.enabled || !this.draggable || this._designMode,
        onBeforeDrop: (source: Upload) => {
          if (this.onBeforeDrop) this.onBeforeDrop(source)
        },
        onDrop: (source: Control, value: UploadRawFile[]) => {
          value && this.proccessFiles(value);
        },
      });
      this._wrapperElm.appendChild(this._uploadDragElm);

      this._fileElm = <HTMLInputElement>(
        this.createElement('input', this._wrapperFileElm)
      );
      this._fileElm.type = 'file';
      this.multiple = this.getAttribute('multiple', true, DEFAULT_VALUES.multiple);
      this.accept = this.getAttribute('accept');
      this._fileElm.disabled = !this.enabled;
      this._fileElm.readOnly = this._designMode;

      // const btn = new Button(this, {
      //   caption: 'Choose an image',
      // });
      // btn.className = `i-upload_btn ${!this.enabled && 'disabled'}`;
      // this._wrapperFileElm.appendChild(btn);
      //
      const panel = new VStack(undefined, {
        alignItems: 'center',
      });

      new Icon(panel, {
        name: "arrow-down",
        height: 32,
        width: 32,
        margin: {
          bottom: 20
        },
        fill: Theme.divider
      });

      this.lblCaption = new Label(panel, {
        caption: this.caption || (this.draggable ? 'Drag a file or click to upload' : 'Click to upload'),
        font: {
          size: '18px'
        }
      });
      this._wrapperFileElm.appendChild(panel);

      const fileListAttr = this.getAttribute('showFileList', true, DEFAULT_VALUES.showFileList);
      if (fileListAttr && !this._fileListElm) {
        this._fileListElm = this.createElement('div', this);
        this._fileListElm.classList.add('i-upload_list');
        this._fileListElm.style.display = 'none';
      }

      this.renderPreview();

      const fileList = this.getAttribute('fileList', true);
      fileList && (this.fileList = fileList);

      this._wrapperElm.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!this.enabled || this._designMode) return;
        if (!this.isPreviewing) this._fileElm.click();
      });

      this._fileElm.addEventListener('change', this.handleUpload.bind(this));
    }
  }

  static async create(options?: UploadElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
