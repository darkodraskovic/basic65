rem lesson 000: mega65 text screen arrays
rem t@&(column,row) holds screen codes
rem c@&(column,row) holds palette colours and text attributes

scnclr

w=rwindow(2)
h=rwindow(3)

print "mega65 text screen:";w;"x";h
print "t@& = screen code, c@& = colour"
print

rem display screen codes across four rows
for r=0 to 3
  for c=0 to w-1
    t@&(c,r+4)=mod(r*w+c,256)
    c@&(c,r+4)=mod(c,16)
  next c
next r

cursor 0,9
print "press a key to change the colours"
getkey a$

rem recolour existing characters without changing them
for r=0 to 3
  for c=0 to w-1
    c@&(c,r+4)=mod(r*4+c,16)
  next c
next r

cursor 0,11
print "screen:";rwindow(2);"columns,";rwindow(3);"rows"
print "press a key to finish"
getkey a$

scnclr
end
