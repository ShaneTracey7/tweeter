import { Injectable} from "@angular/core";
//import { CryptoJS } from './crypto-library.js';

//JS FIX IV ENCRYPTION CBC


@Injectable()
export class CryptService {

password = 'I love Medium'; // gonna be password
key ='AAAAAAAAAAAAAAAA'//key used in Python

encryptPassword(password: string)
{
   /* let key = CryptoJS.enc.Utf8.parse(this.key);
    let iv = CryptoJS.enc.Utf8.parse('BBBBBBBBBBBBBBBB')
    let encrypted = CryptoJS.AES.encrypt(password, key, { iv: iv, mode: CryptoJS.mode.CBC});
    console.log('encrypted', encrypted.toString());
    alert(encrypted)*/
}

}
