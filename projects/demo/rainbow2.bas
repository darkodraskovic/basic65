print chr$(27);"4";
scnclr
bank 128

h=12
y&=0
inc=4

do
  for i=0 to 21
    p&=y&+i*h
    vsync p&
    background i+1
  next i

  y&=y&+inc

  get a$
loop until a$<>""

background 0
scnclr
end