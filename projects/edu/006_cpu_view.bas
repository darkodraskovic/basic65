rem lesson 006: the cpu's 16-bit view
rem one 16-bit address can lead to different physical locations

scnclr
bank 128 : rem special basic mapping with rom and mega65 io visible

print "lesson 006: the cpu's 16-bit view"
print
print "bank 128 is a mapping, not ram bank 128"
print "$d020 then means the border register"
print "its flat mega65 io address is $ffd3020"
print
print "bank 0 makes $d020 mean ram at $0d020"
print "the written address is the same; its mapping differs"
print

rem preserve the hardware register and the unrelated ram byte separately
sb&=peek($d020) : rem sb = saved border register via bank 128 io mapping
bank 0
sr&=peek($d020) : rem sr = saved ram byte at bank 0 offset $d020
bank 128

rem write the border register through the normal 16-bit io mapping
poke $d020,$0d : rem bank 128 maps $d020 to mega65 io at $ffd3020
fi&=peek($ffd3020) : rem fi = flat io value read from the full address

rem change the mapping, then use the same 16-bit address as ordinary ram
bank 0
poke $d020,$a5 : rem bank 0 maps offset $d020 to flat ram address $0d020
br&=peek($d020) : rem br = banked ram value read through the 16-bit address
fr&=peek($0d020) : rem fr = flat ram value read through the full address

rem returning to bank 128 reveals io again, not the ram byte underneath
bank 128
ir&=peek($d020) : rem ir = io register value, not the bank 0 ram byte

print "bank 128 $d020:     $";hex$(ir&)
print "flat $ffd3020:      $";hex$(fi&)
print
print "bank 0 $d020:       $";hex$(br&)
print "flat $0d020:        $";hex$(fr&)
print
print "same $d020, two physical destinations"

rem restore both destinations using the mappings that reach each one
bank 0
poke $d020,sr& : rem restore the saved ram byte at flat address $0d020

print
print "$d000-$dfff can be mapped to ram or io"
print "io itself has c64, c65, mega65 and ethernet views"
print "$d02f selects those io personalities"
print
print "press a key to finish"
getkey ky$ : rem ky = key pressed to finish the lesson

bank 128
poke $d020,sb& : rem restore the saved border colour register

scnclr
end
