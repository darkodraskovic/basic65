rem lesson 004: memory pointers and raw screen access
rem vic-iv registers describe where screen, colour, and glyph data live

scnclr
font c
bank 128

rem assemble 24-bit pointers from little-endian hardware registers
sc=wpeek($d060)+peek($d062)*65536
cp=wpeek($d064)
gp=wpeek($d068)+peek($d06a)*65536
ls=wpeek($d058)

print "lesson 004: memory pointers"
print
print "screen ram:      $";hex$(sc)
print "colour offset:   $";hex$(cp)
print "glyph data:      $";hex$(gp)
print "bytes per row:";ls
print "visible screen:";rwindow(2);"x";rwindow(3)

rem choose a visible cell below the report
x=10
y=rwindow(3)-5
of=y*ls+x
sa=sc+of
co=cp+of

rem preserve the cell before changing it
ot&=t@&(x,y)
oc&=c@&(x,y)

t@&(x,y)=1
c@&(x,y)=2

rem read the screen code back through its calculated flat address
rs&=peek(sa)

cursor 0,10
print "cell:";x;",";y
print "screen address: $";hex$(sa)
print "t@& value:";t@&(x,y);" raw peek:";rs&

rem the first 2kb of colour ram has a flat compatibility alias
if co<2048 then begin
  ca=$1f800+co
  rc&=peek(ca)
  print "colour alias:   $";hex$(ca)
  print "c@& value:";c@&(x,y);" raw peek:";rc&
bend

print
print "press a key to restore the cell"
getkey a$

t@&(x,y)=ot&
c@&(x,y)=oc&

scnclr
end
