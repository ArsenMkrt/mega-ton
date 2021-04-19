const ConverterApi = {
    formatBalance(dec) {
        const parts = this.getNanoWholeAndReminder(dec);
        return `${parts.whole}.${parts.reminder}`;
    },

    formatBalanceHex(hex) {
        const dec = this.toDec(hex);
        return this.formatBalance(dec);
    },

    getNanoWholeAndReminder(dec) {
        const balance = BigInt(dec);
        const whole = balance / BigInt('1000000000');
        const reminder = dec.substring(dec.length - 9).padStart(9, '0');

        return { whole: whole.toLocaleString(), reminder: reminder };
    },

    toNano(ammount){
        const splitted = ammount.split('.');
        const intPart = BigInt(splitted[0]) * BigInt('1000000000');
        const decPart = BigInt(splitted.length > 1 ? `${splitted[1].padEnd(9, '0')}` : '0');
        return (intPart + decPart).toString();
    },

    toDec(hex) {
        return BigInt(hex).toString();
    },
    
    hexEncode(text) {
        var hex, i;
        var result = "";
        for (i = 0; i < text.length; i++) {
            hex = text.charCodeAt(i).toString(16);
            result += ("000" + hex).slice(-4);
        }

        return result
    },

    hexDecode(msg) {
        var j;
        var hexes = msg.match(/.{1,4}/g) || [];
        var back = "";
        for(j = 0; j<hexes.length; j++) {
            back += String.fromCharCode(parseInt(hexes[j], 16));
        }
    
        return back;
    }
}

export default ConverterApi;