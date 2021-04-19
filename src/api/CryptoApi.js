import sha512 from 'crypto-js/sha512';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8'
import encBase64 from 'crypto-js/enc-base64'
import { lib, PBKDF2 } from 'crypto-js';

const CryptoApi = {
    calcPBKDF2(password, salt) {
        var key = PBKDF2(password, salt, {
            keySize: 32,
            iterations: 2000
        });
        return key.toString(encBase64);
    },

    encryptAES(message, passCode) {
        return AES.encrypt(message, passCode).toString();
    },

    decryptAES(ciphertext, passCode) {
        var decrypted = AES.decrypt(ciphertext, passCode);
        return decrypted.toString(encUtf8);
    },

    calcSHA512(message){
        var hash = sha512(message);
        return hash.toString();
    },

    generateSalt(length = 16){
        var salt = lib.WordArray.random(length);
        return salt.toString();
    }
}

export default CryptoApi;