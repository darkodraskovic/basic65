print chr$(27);"4";

bload "chardef.bin",p($40000),r
bload "charmap.bin",p($41000),r
bload "spritedef.bin",p($42000),r

bank 128

wpoke $d068,$0000
poke $d06a,$04

wpoke $d060,$1000
poke $d062,$04

wpoke $d06c,$3000
poke $d06e,$84

wpoke $43000,$1080

px=160
py=120
spd=.25

sprite 0,1,4,,0,0,0
movspr 0,px,py

do
  dx=0:dy=0

  rem column 1: w,a,s
  poke $d614,1
  k=peek($d613)

  if (k and 2)=0 then dy=-spd
  if (k and 4)=0 then dx=-spd
  if (k and 32)=0 then dy=spd

  rem column 2: d
  poke $d614,2
  k=peek($d613)

  if (k and 4)=0 then dx=spd

  px=px+dx
  py=py+dy

  movspr 0,px,py
loop