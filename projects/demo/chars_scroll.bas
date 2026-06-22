print chr$(27);"4";

bload "chardef.bin",p($40000),r
bload "charmap.bin",p($44000),r

bank 128

rem custom charset at $040000
wpoke $d068,$0000
poke $d06a,$04

s=0

do
  rem screen 0 = $044000, screen 1 = $044400
  wpoke $d060,$4000+s*$0400
  poke $d062,$04

  getkey k$

  if k$="d" and s<1 then s=s+1
  if k$="a" and s>0 then s=s-1

loop until k$="q"

end