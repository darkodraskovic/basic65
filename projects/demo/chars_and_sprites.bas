print chr$(27);"4";

bload "chardef.bin",p($40000),r
bload "charmap.bin",p($41000),r
bload "spritedef.bin",p($42000),r

bank 128

rem custom charset at $040000
wpoke $d068,$0000
poke $d06a,$04

rem screen codes at $041000
wpoke $d060,$1000
poke $d062,$04

rem sprite pointer table at $043000
wpoke $d06c,$3000
poke $d06e,$84

for i=0 to 7
   wpoke $43000+i*2,$1080+i
next i

for i=0 to 7
   movspr i,40+i*32,120
   sprite i,1,i+2,,0,0,0
next i

getkey k$
end
