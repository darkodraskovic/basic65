print chr$(27);"4";
print chr$(142);
scnclr
bank 128

border 0
background 0

tx$="mega65 demo 123"
x0=12
y0=12

rem write text once
for i=1 to len(tx$)
  ch$=mid$(tx$,i,1)
  p=asc(ch$)

  if p=32 then sc=32
  if p>=65 and p<=90 then sc=p-64
  if p>=48 and p<=57 then sc=p

  t@&(x0+i-1,y0)=sc
  c@&(x0+i-1,y0)=i
next i

r=0
dr=1

do
  rem animate palette entries 1..16 with different rgb offsets
  for i=1 to 16
    poke $d100+i,mod(r+i,16)
    poke $d200+i,mod(r+i*2,16)
    poke $d300+i,mod(r+i*3,16)
  next i

  r=r+dr
  if r=15 then dr=-1
  if r=0 then dr=1

  for d=1 to 500
  next d

  get a$
loop until a$<>""

palette restore
scnclr
end