import { useState } from 'react'
import useMeasure from 'react-use-measure'
import { useTrail, animated } from '@react-spring/web'

import styles from './app.module.css'

const initialPosition = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
}
const fast = { tension: 1200, friction: 40 }
const slow = { mass: 10, tension: 200, friction: 50 }
const trans = (x: number, y: number) =>
  `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

export default function App() {
  const [isClicked, setIsClicked] = useState(false)
  const [springEnabled, setSpringEnabled] = useState(true)
  const [trail, api] = useTrail(3, i => ({
    xy: [initialPosition.x, initialPosition.y],
    config: i === 0 ? fast : slow,
  }))
  const [ref, { left, top }] = useMeasure()

  const handleMouseMove = (e: any) => {
    if (isClicked) {
      api.start({ xy: [e.clientX - left, e.clientY - top] })
    }
    if (!isClicked && springEnabled) {
      api.start({ xy: [initialPosition.x * 0.8, initialPosition.y] })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Im a blob</h1>
        <h3 className={styles.subTitle}>Drag me!</h3>
      </div>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="15" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7"
          />
        </filter>
      </svg>
      <div ref={ref} className={styles.hooksMain} onMouseLeave={() => setIsClicked(false)} onMouseMove={handleMouseMove}>
        {trail.map((props, index) => (
          <animated.div
            key={index}
            onMouseDown={() => setIsClicked(true)}
            onMouseUp={() => setIsClicked(false)}
            style={{ transform: props.xy.to(trans) }}
          />
        ))}
      </div>
    </div>
  )
}