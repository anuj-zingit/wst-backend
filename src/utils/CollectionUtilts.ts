export class CollectionUtils {

    public static parseDefaultEnumMulti<T>(values: Array<string>, enumType: T, defaultEnumValue: T[keyof T]): Array<T[keyof T]> {
        const result: Array<T[keyof T]> = [];
        if (CollectionUtils.isEmpty(values)) {
            return result;
        }
        for (let value of values) {
            const found: T[keyof T] = CollectionUtils.parseDefaultEnum(value, enumType, defaultEnumValue);
            if (!result.find(elem => elem == found)) {
                result.push(found);
            }
        }
        return result;
    }

    public static isEmpty(array: Array<any>): boolean {
        if (typeof array != "undefined"
            && array != null
            && array.length != null
            && array.length > 0) {
            return false;
        }
        return true;
    }

    public static parseDefaultEnum<T>(value: string, enumType: T, defaultEnumValue: T[keyof T]): T[keyof T] {
        const found: T[keyof T] = CollectionUtils.parseEnum(value, enumType);
        if (found == undefined) {
            return defaultEnumValue;
        }
        return found;
    }

    public static parseEnum<T>(value: string, enumType: T): T[keyof T] | undefined {
        if (!value) {
            return undefined;
        }

        for (const property in enumType) {
            const enumMember = enumType[property];
            if (typeof enumMember === 'string') {
                if (enumMember.toLowerCase().trim() === value.toLowerCase().trim()) {
                    const key = property as string as keyof typeof enumType;
                    return enumType[key];
                }
            }
        }
        return undefined;
    }

    public static getBracketsFreeId(name: string) {
        return name.replace(/[{}]/g, "");
    }

    public static async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

}