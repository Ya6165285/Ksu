cd /tmp/claude-0/-home-user-Ksu/f6de9bb4-c307-550f-96d3-574c512c8005/scratchpad/vid3
U="https://drive.usercontent.google.com/download?id=1ctGOJuV4AnoGQ14wf6V5LUSxo-duugJI&export=download&confirm=t"; T=10971207251; C=104857600
while true; do
  s=$(stat -c %s main.mov); [ "$s" -ge "$T" ] && { echo DONE; break; }
  e=$((s+C-1)); rm -f part; curl -sL --max-time 600 -r ${s}-${e} "$U" -o part
  if head -c 15 part | grep -q DOCTYPE; then echo "quota at $s"; rm -f part; sleep 120; continue; fi
  n=$(stat -c %s part 2>/dev/null || echo 0)
  exp=$((e-s+1)); [ $((s+exp)) -gt $T ] && exp=$((T-s))
  if [ "$n" -ne "$exp" ]; then echo "short $n at $s"; rm -f part; sleep 5; continue; fi
  cat part >> main.mov; rm -f part; echo "size $(stat -c %s main.mov)"
done
