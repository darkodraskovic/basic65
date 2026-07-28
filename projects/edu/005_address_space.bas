rem lesson 005: the mega65 28-bit address space
rem physical addresses can select ram, devices, or compatibility views

scnclr
bank 128 : rem bank affects 16-bit accesses; flat addresses ignore it

print "lesson 005: the 28-bit address space"
print
print "$0000000-$005ffff  384kb fast chip ram"
print "$020000-$03ffff  rom image in protected ram"
print "$0060000-$0ffffff  reserved chip-ram expansion"
print "$4000000-$7ffffff  cartridge and slow devices"
print "$8000000-$87fffff  8mb attic ram"
print "$ff7e000-$ff7efff  vic character buffer"
print "$ff80000-$ff87fff  32kb colour ram"
print "$ffd0000-$ffd3fff  four io personalities"
print

rem split one flat address into its 64kb bank number and 16-bit offset
ad=$51000 : rem ad = address of a safe demonstration byte in bank 5 chip ram
bn=int(ad/65536) : rem bn = bank number from the whole 64kb blocks before ad
of=mod(ad,65536) : rem of = offset left within the selected 64kb bank

print "flat address: $";hex$(ad)
print "64kb bank:";bn
print "bank offset: $";hex$(of)
print

rem first access the byte through its complete flat address
sv&=peek(ad) : rem sv = saved value to restore after the experiment
poke ad,$5a : rem write test pattern %01011010
fv&=peek(ad) : rem fv = flat value read back through the complete address

print "flat write $5a, read $";hex$(fv&)
print "bank 128 was ignored because ad > $ffff"
print

rem bank 5 makes the 16-bit offset $1000 refer to flat address $51000
bank bn : rem select the 64kb bank calculated from the flat address
br&=peek(of) : rem br = banked read using only the offset inside bank 5
poke of,$a5 : rem write test pattern %10100101 through the banked view
bw&=peek(of) : rem bw = banked write value read back through the same view
bank 128 : rem restore basic's normal rom and io memory mapping

fr&=peek(ad) : rem fr = flat read of the value written through bank 5

print "banked read of $5a: $";hex$(br&)
print "banked write $a5:   $";hex$(bw&)
print "flat read afterward: $";hex$(fr&)

rem restore through the banked view, then verify through the flat view
bank bn
poke of,sv& : rem restore the saved byte at bank 5 offset $1000
bank 128 : rem leave basic in its normal mapped configuration
rv&=peek(ad) : rem rv = restored value verified through the flat address

print "restored original:   $";hex$(rv&)

print
print "press a key to finish"
getkey ky$ : rem ky = key pressed to finish the lesson

scnclr
end
