export class IdUtils {
    public static generateUUID(length?: number): string {
        const uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        if (length) {
            return uuid.substring(0, length);
        }
        return uuid;
    }
}