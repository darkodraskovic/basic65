rem lesson 001: custom character glyphs
rem chardef changes the pixel pattern behind a screen code

scnclr
font c

print "lesson 001: custom glyphs"
print
print "these cells all contain screen code 1:"

for r=0 to 5
  for c=0 to 15
    t@&(c+4,r+5)=1
    c@&(c+4,r+5)=mod(c+r,16)
  next c
next r

cursor 0,13
print "press a key to redefine glyph 1"
getkey a$

rem eight bytes describe the eight pixel rows of one glyph
chardef 1, %00011000, %00111100, %01111110, %11011011, %11111111, %00100100, %01011010, %10100101

cursor 0,15
print "one glyph changed every cell at once"
print "press a key to restore the built-in font"
getkey a$

rem loading a font discards volatile chardef changes
font c
scnclr
end
