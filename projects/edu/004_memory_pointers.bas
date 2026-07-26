rem lesson 004: memory pointers and raw screen access
rem vic-iv registers describe where screen, colour, and glyph data live

scnclr
font c
bank 128 : rem make memory-mapped io registers visible

rem assemble 24-bit pointers from little-endian hardware registers
sr=wpeek($d060)+peek($d062)*65536 : rem absolute screen ram base
cp=wpeek($d064) : rem offset from colour ram base $ff80000
gp=wpeek($d068)+peek($d06a)*65536 : rem absolute glyph data base
ls=wpeek($d058) : rem bytes advanced between consecutive text rows

print "lesson 004: memory pointers"
print
print "screen ram:      $";hex$(sr)
print "colour offset:   $";hex$(cp)
print "glyph data:      $";hex$(gp)
print "bytes per row:";ls
print "visible screen:";rwindow(2);"x";rwindow(3)

rem choose a visible cell below the report
x=10
y=rwindow(3)-5
of=y*ls+x
sa=sr+of : rem absolute address of this cell's screen code byte
co=cp+of : rem offset of this cell within dedicated colour ram

t@&(x,y)=26
c@&(x,y)=8

rem read the screen code back through its calculated flat address
rs&=peek(sa)

cursor 0,10
print "cell:";x;",";y
print "screen address: $";hex$(sa)
print "t@& value:";t@&(x,y);" raw peek:";rs&

rem the first 2kb of colour ram has a flat compatibility alias
if co<2048 then begin
  ca=$1f800+co : rem flat compatibility alias for the colour byte
  z=$ff80000+co : rem absolute physical colour ram address
  rc&=peek(ca)
  rz&=peek(z)
  print "colour alias:    $";hex$(ca)
  print "physical colour: $";hex$(z)
  print "c@&:";c@&(x,y);" alias:";rc&;" physical:";rz&
bend

print
print "press a key to finish"
getkey a$

scnclr
end
