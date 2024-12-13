export interface IPermissions {
  query: (name: string, descriptor?: PermissionDescriptor) => Promise<PermissionStatus|null>;
  request: (name: string) => Promise<any>;
}

export class Permissions implements IPermissions {

  constructor() {}

  async query(name: string, descriptor?: PermissionDescriptor): Promise<PermissionStatus|null> {
    try {
      const status = await navigator.permissions.query(Object.assign({name}, descriptor));
      return status;
    } catch (e) {
    }
    return null;
  }

  async request(name: string) {
    if (name === 'geolocation') {
      return navigator.geolocation.getCurrentPosition(() => {});
    } else if (name === 'notifications') {
      return Notification.requestPermission();
    } else if (name === 'camera') {
      return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } else if (name === 'microphone') {
      return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    }
    return false;
  }
}