print chr$(27);"4";

bload "chardef.bin",p($40000),r
bload "charmap.bin",p($41000),r
bload "spritedef.bin",p($42000),r

bank 128
border 0

rem custom charset at $040000
wpoke $d068,$0000
poke $d06a,$04

rem screen codes at $041000
wpoke $d060,$1000
poke $d062,$04

rem sprite pointer table at $043000
wpoke $d06c,$3000
poke $d06e,$84

rem save base x display position
xb=wpeek($d04c)
dx=1
x=0

do
  vsync 50
  wpoke $d04c,xb+x

  x=x+dx
  if x=63 then dx=-1
  if x=-63 then dx=1

  get a$
loop until a$<>""

wpoke $d04c,xb
end