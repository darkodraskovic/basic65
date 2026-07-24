rem lesson 003: text windows
rem a window limits print, cursor movement, clearing, and scrolling

scnclr
font c

w=rwindow(2)
h=rwindow(3)

l=4
t=3
r=w-5
b=h-4

print "lesson 003: text windows"

rem draw a frame directly on the full hardware text screen
for x=l to r
  t@&(x,t)=42
  c@&(x,t)=7
  t@&(x,b)=42
  c@&(x,b)=7
next x

for y=t+1 to b-1
  t@&(l,y)=42
  c@&(l,y)=7
  t@&(r,y)=42
  c@&(r,y)=7
next y

rem restrict normal text operations to the inside of the frame
window l+1,t+1,r-1,b-1,1
cursor l+1,t+1

print "window:";rwindow(0);"x";rwindow(1)
print "screen:";rwindow(2);"x";rwindow(3)
print
print "printing beyond the bottom scrolls"
print "only the active window:"

for n=1 to rwindow(1)+2
  print "window line";n
  sleep .08
next n

print "press a key"
getkey a$

rem restore the full-screen text window
window 0,0,w-1,h-1
scnclr
end
