print chr$(27);"4";
scnclr
bank 128

h=40
y&=0

do
  p&=y&
  vsync p&
  background 6

  p&=y&+h
  vsync p&
  background 2

  p&=y&+2*h
  vsync p&
  background 4

  p&=y&+3*h
  vsync p&
  background 0

  y&=y&+1

  get a$
loop until a$<>""

background 0
scnclr
end