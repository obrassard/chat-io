export class StringUtilities {
    public static pad3(number:any) {

        if (number < 10) {
            return '00' + number;
        }
        if (number < 100) {
            return '0' + number;
        }
        return number;
    }
}