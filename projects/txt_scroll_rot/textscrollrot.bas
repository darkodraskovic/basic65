10 scnclr
20 a$="   mega65 scrolling text demo   "
30 s$=a$
40 print s$
50 for t=1 to 800:next t
60 s$=mid$(s$,2)+left$(s$,1)
70 print chr$(19);
80 goto 40
