import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function onRouteChange() {
  const loc = useLocation()
  const locRef = useRef({up: 0})
  useEffect(() => {
    if (locRef.current.up) {
    }
    locRef.current.up++
  }, [loc.pathname])
}
