// tiny stack VM, ISA v1 — faithful implementation, written from the spec only.
import{mkdirSync,readFileSync,readdirSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
 const P=readFileSync(join(I,id,'program.bin')),N=readFileSync(join(I,id,'input.bin'));
 const S=new Int32Array(257),C=new Int32Array(64),M=new Int32Array(256),B=Buffer.alloc(65536);
 let sp=0,cp=0,pc=0,st=0,ip=0,ol=0,ex=0,t=0,a=0,b=0,r=0,q='';
 const ck=(p,n)=>sp<p?2:sp-p+n>256?3:0;
 vm:for(;;){
  if(st>=1e6){ex=10;break}
  if(pc<0||pc>=P.length){ex=9;break}
  const o=P[pc];
  switch(o){
   case 0:break vm;
   case 1:if(pc+2>P.length){ex=9;break vm}if(t=ck(0,1)){ex=t;break vm}a=P[pc+1];S[sp++]=a<128?a:a-256;pc+=2;break;
   case 2:if(pc+5>P.length){ex=9;break vm}if(t=ck(0,1)){ex=t;break vm}S[sp++]=P[pc+1]|P[pc+2]<<8|P[pc+3]<<16|P[pc+4]<<24;pc+=5;break;
   case 3:if(t=ck(1,0)){ex=t;break vm}sp--;pc++;break;
   case 4:if(t=ck(1,2)){ex=t;break vm}S[sp]=S[sp-1];sp++;pc++;break;
   case 5:if(t=ck(2,2)){ex=t;break vm}a=S[sp-1];S[sp-1]=S[sp-2];S[sp-2]=a;pc++;break;
   case 6:if(t=ck(2,3)){ex=t;break vm}S[sp]=S[sp-2];sp++;pc++;break;
   case 7:if(t=ck(3,3)){ex=t;break vm}a=S[sp-3];S[sp-3]=S[sp-2];S[sp-2]=S[sp-1];S[sp-1]=a;pc++;break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:
    if(t=ck(2,1)){ex=t;break vm}
    b=S[--sp];a=S[sp-1];
    if(o==16)r=a+b|0;
    else if(o==17)r=a-b|0;
    else if(o==18)r=Math.imul(a,b);
    else if(o==19){if(!b){ex=4;break vm}r=(a/b)|0}
    else if(o==20){if(!b){ex=4;break vm}r=(a%b)|0}
    else if(o==21){if(!b){ex=4;break vm}r=(a>>>0)/(b>>>0)|0}
    else if(o==22){if(!b){ex=4;break vm}r=(a>>>0)%(b>>>0)|0}
    else if(o==24)r=a&b;
    else if(o==25)r=a|b;
    else if(o==26)r=a^b;
    else if(o==28)r=a<<b;
    else if(o==29)r=a>>b;
    else if(o==30)r=a>>>b;
    else if(o==32)r=a==b?1:0;
    else if(o==33)r=a<b?1:0;
    else r=(a>>>0)<(b>>>0)?1:0;
    S[sp-1]=r;pc++;break;
   case 23:case 27:
    if(t=ck(1,1)){ex=t;break vm}
    S[sp-1]=o==23?-S[sp-1]|0:~S[sp-1];pc++;break;
   case 48:if(pc+3>P.length){ex=9;break vm}a=P[pc+1]|P[pc+2]<<8;if(a>=32768)a-=65536;pc=pc+3+a;break;
   case 49:case 50:
    if(pc+3>P.length){ex=9;break vm}if(t=ck(1,0)){ex=t;break vm}
    a=S[--sp];b=P[pc+1]|P[pc+2]<<8;if(b>=32768)b-=65536;
    pc=(o==49?a==0:a!=0)?pc+3+b:pc+3;break;
   case 51:if(pc+3>P.length){ex=9;break vm}if(cp>=64){ex=7;break vm}C[cp++]=pc+3;pc=P[pc+1]|P[pc+2]<<8;break;
   case 52:if(cp<1){ex=8;break vm}pc=C[--cp];break;
   case 64:if(t=ck(1,1)){ex=t;break vm}a=S[sp-1];if(a<0||a>255){ex=6;break vm}S[sp-1]=M[a];pc++;break;
   case 65:if(t=ck(2,0)){ex=t;break vm}a=S[--sp];b=S[--sp];if(a<0||a>255){ex=6;break vm}M[a]=b;pc++;break;
   case 80:if(t=ck(1,0)){ex=t;break vm}a=S[--sp];q=String(a);if(ol+q.length>65536){ex=11;break vm}B.write(q,ol);ol+=q.length;pc++;break;
   case 81:if(t=ck(1,0)){ex=t;break vm}a=S[--sp];if(ol>=65536){ex=11;break vm}B[ol++]=a&255;pc++;break;
   case 82:if(t=ck(0,1)){ex=t;break vm}S[sp++]=ip<N.length?N[ip++]:-1;pc++;break;
   case 83:if(t=ck(1,0)){ex=t;break vm}ex=S[--sp]&255;break vm;
   default:ex=5;break vm;
  }
  st++;
 }
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),B.subarray(0,ol));
 writeFileSync(join(O,id,'exit.txt'),ex+'\n');
}
