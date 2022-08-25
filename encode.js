
const tran_DtoP = [25, 8, 3,14,10, 0,22,16, 4, 9, 2,15,19,17,11, 5, 1,23,12, 6,20,24,13,21,18, 7];
const tran_PtoD = [ 5,16,10, 2, 8,15,19,25, 1, 9, 4,14,18,22, 3,11, 7,13,24,12,20,23, 6,17,21, 0];

function encode(msg,username){
    let encode_Message = '';
    if (username === 'doctor'){
        for(let i=0;i<msg.length;i++){
            let ch = msg[i];
            let n = ch.charCodeAt();//way
            if (64 < n && n <91) {
                n = tran_DtoP[n-65] + 65;
            }
            else if(96<n && n<123){
                n = tran_DtoP[n-97] + 97;
            }
            else if(n !== 32){
                n = n+2;
            }
            encode_Message += String.fromCharCode(n);
        }
    }
    else if (username === '公用電腦'){
        for(let i=0;i<msg.length;i++){
            let ch = msg[i];
            let n = ch.charCodeAt();//way
            if (64 < n && n <91) {
                n = tran_PtoD[n-65] + 65;
            }
            else if(96<n && n<123){
                n = tran_PtoD[(n-97)] + 97;
            }
            encode_Message += String.fromCharCode(n);
        }
    }
    else encode_Message = msg;
    return encode_Message
}

exports.encode = encode;