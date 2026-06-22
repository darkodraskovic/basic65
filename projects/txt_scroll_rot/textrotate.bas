scnclr
print chr$(27);"4";
print chr$(14);

msg$="   mega65 vic text rotate demo   "
col=1
k$=""
row=12
x0=4
w=len(msg$)

do
    for i=0 to w-1
        ch$=mid$(msg$,i+1,1)
        ch=asc(ch$)

        if ch=32 then sc=32
        if ch>=97 and ch<=122 then sc=ch-96
        if ch>=65 and ch<=90 then sc=ch-64

        t@&(x0+i,row)=sc
        c@&(x0+i,row)=col
    next i

    for d=1 to 1400
    next d

    msg$=mid$(msg$,2)+left$(msg$,1)

    col=col+1
    if col>15 then col=1

    get k$
loop until k$<>""

for i=0 to w-1
    c@&(x0+i,row)=1
next i
end
