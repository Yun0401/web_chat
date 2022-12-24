
// const tran_DtoP = [25, 8, 3,14,10, 0,22,16, 4, 9, 2,15,19,17,11, 5, 1,23,12, 6,20,24,13,21,18, 7];
// const tran_PtoD = [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,];

function encode(msg,username){
    let encode_Message = '';
    if (username === '王祐誠'){
        for(let i=0;i<msg.length;i++){
            let ch = msg[i];
            let n = ch.charCodeAt();//way 65 97
            if (n >= 99) {
                n = n - 2;
            }
            else if(n>=97){
                n = n - 2 + 26;
            }
            else if (n >= 67){
                n = n-2;
            }
            else if(n !== 32){
                n = n -2 + 26;
            }
            encode_Message += String.fromCharCode(n);
        }
    }
    // else if (username === '公用電腦'){
    //     for(let i=0;i<msg.length;i++){
    //         let ch = msg[i];
    //         let n = ch.charCodeAt();//way
    //         if (64 < n && n <91) {
    //             n = tran_PtoD[n-65] + 65;
    //         }
    //         else if(96<n && n<123){
    //             n = tran_PtoD[(n-97)] + 97;
    //         }
    //         encode_Message += String.fromCharCode(n);
    //     }
    // }
    else encode_Message = msg;
    return encode_Message
}

exports.encode = encode;