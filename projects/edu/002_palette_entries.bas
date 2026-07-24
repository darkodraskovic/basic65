rem lesson 002: palette entries
rem colour ram stores an index; the palette stores its rgb colour

scnclr
font c
palette restore

print "lesson 002: palette entries"
print
print "colour index 2";tab(27);"colour index 5"

rem both blocks use the same glyph but different colour indexes
for r=0 to 3
  for c=0 to 15
    t@&(c+4,r+4)=1
    c@&(c+4,r+4)=2

    t@&(c+28,r+4)=1
    c@&(c+28,r+4)=5
  next c
next r

cursor 0,10
print "press a key to animate palette entry 2"
getkey a$

rem changing one palette entry recolours every cell that refers to it
for p=0 to 15
  palette color 2,p,0,15-p
  sleep .08
next p

for p=15 to 0 step -1
  palette color 2,p,15-p,0
  sleep .08
next p

cursor 0,12
print "the screen codes and colour indexes never changed"
print "press a key to restore the system palette"
getkey a$

palette restore

cursor 0,15
print "palette restored; press a key to finish"
getkey a$

scnclr
end
