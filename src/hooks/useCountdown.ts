"use client";

import { useState, useEffect, useRef } from "react";
import { getSecondsLeft } from "@/lib/utils";

export function useCountdown(endTime: string) {
  const [seconds, setSeconds] = useState(() => getSecondsLeft(endTime));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef(endTime);

  useEffect(() => {
    endTimeRef.current = endTime;

    intervalRef.current = setInterval(() => {
      const left = getSecondsLeft(endTimeRef.current);
      setSeconds(left);
      if (left <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isEnded = seconds <= 0;
  const isUrgent = seconds > 0 && seconds <= 300;

  return { seconds, isEnded, isUrgent };
}
