rem lesson 007: bytes, words, and address arithmetic
rem multi-byte values occupy consecutive memory addresses

scnclr
bank 128 : rem flat addresses above $ffff ignore this 16-bit mapping

print "lesson 007: bytes, words, addresses"
print

rem calculate one row inside a simple byte table
tb=$51200 : rem tb = table base address in safe bank 5 chip ram
rs=40 : rem rs = row size in bytes
ri=3 : rem ri = zero-based row index
ad=tb+ri*rs : rem ad = address of row 3, calculated as base plus row offset

print "table base:  $";hex$(tb)
print "row offset:  $";hex$(ri*rs)
print "row address: $";hex$(ad)
print

rem preserve all three bytes that this lesson will modify
sl&=peek(ad) : rem sl = saved low byte at the target address
sm&=peek(ad+1) : rem sm = saved middle byte at the next address
sh&=peek(ad+2) : rem sh = saved high byte at the final address

rem wpoke stores the low byte first because the mega65 is little-endian
wpoke ad,$1234 : rem write word $1234 as byte $34 followed by byte $12
bl&=peek(ad) : rem bl = low byte read from the lower address
bh&=peek(ad+1) : rem bh = high byte read from the higher address
wv=wpeek(ad) : rem wv = word value reconstructed from the two bytes

print "wpoke $1234 stores:"
print "$";hex$(ad);" = $";hex$(bl&);" low byte"
print "$";hex$(ad+1);" = $";hex$(bh&);" high byte"
print "wpeek reads: $";hex$(wv)
print

rem a 24-bit pointer needs three bytes because wpoke handles only 16 bits
poke ad,$89 : rem low address byte has weight 1
poke ad+1,$67 : rem middle address byte has weight 256
poke ad+2,$05 : rem high address byte has weight 65536

al&=peek(ad) : rem al = address low byte
am&=peek(ad+1) : rem am = address middle byte
ah&=peek(ad+2) : rem ah = address high byte
pa=al&+am&*256+ah&*65536 : rem pa = pointer assembled as $056789

print "three bytes $89 $67 $05"
print "form pointer: $";hex$(pa)
print "low + middle*256 + high*65536"

rem restore every byte so the demonstration leaves chip ram unchanged
poke ad,sl& : rem restore saved low byte
poke ad+1,sm& : rem restore saved middle byte
poke ad+2,sh& : rem restore saved high byte

print
print "press a key to finish"
getkey ky$ : rem ky = key pressed to finish the lesson

scnclr
end
