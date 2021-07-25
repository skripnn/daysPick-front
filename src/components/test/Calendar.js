import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useWindowWidth} from "@react-hook/window-size";
import DeltaTouchClass from "./extention/deltaTouch";

export function useInteraction(weeks, newWeeks, ref) {

  const [intersection, setIntersection] = useState(false)
  // статус пересечения
  const [el, setEl] = useState(null)
  // элементы для зависимостей
  const [observer, setObserver] = useState(null)
  // наблюдатель

  function changeIntersection(a) {
    // изменения статуса пересечения
    if (a[0].isIntersecting) setIntersection(true)
  }

  useEffect(() => {
    // сброс зависимостей при размонтировании компонента
    return () => {
      if (observer) {
        if (observer[0]) observer[0].disconnect()
        if (observer[1]) observer[1].disconnect()
      }
    }
  })

  useEffect(() => {
    // коллбэк при пересечении
    if (intersection) newWeeks(weeks, true)
    // eslint-disable-next-line
  }, [intersection])

  // eslint-disable-next-line
  useEffect(newElement, [weeks])

  function newElement() {
    // обновление элементов для зависимости
    if (observer && el) {
      observer.unobserve(el[0])
      observer.unobserve(el[1])
    }
    setEl([
      ref.current.firstElementChild.firstElementChild,
      ref.current.firstElementChild.lastElementChild,
    ])
  }

  // eslint-disable-next-line
  useEffect(setObservableTarget, [el, observer])

  function setObservableTarget() {
    // установка новых зависимостей
    if (observer && el) {
      observer.observe(el[0])
      observer.observe(el[1])
    }
    setIntersection(false)
  }

  // eslint-disable-next-line
  useEffect(setObservableRoot, [ref.current])

  function setObservableRoot() {
    // установка наблюдателя на родителя зависимостей
    if (observer) observer.disconnect()
    if (ref.current) setObserver(new IntersectionObserver(changeIntersection, {root: ref.current, threshold: 1.0}))
  }
}

export function useDeltaTouch(ref) {
  function firstRender() {
    const DeltaTouchX = new DeltaTouchClass('x')
    ref.current.addEventListener('wheel', e => wheelScroll(e), {passive: false})
    ref.current.addEventListener('touchstart', e => DeltaTouchX.start(e))
    ref.current.addEventListener('touchmove', e => DeltaTouchX.move(e, touchScroll))
    ref.current.addEventListener('touchend', e => DeltaTouchX.end(e, touchScroll))
  }

  function wheelScroll(e) {
    // обработчик прокрутки колёсиком мыши
    e.preventDefault()
    let delta = e.deltaX + e.deltaY
    if (!ref.current) return
    ref.current.scrollLeft += delta
  }

  function touchScroll(delta) {
    // обработчик прокрутки пррикосновением
    if (!ref.current) return
    ref.current.scrollLeft += delta
  }

  //eslint-disable-next-line
  useEffect(firstRender, [])
}

export function useShiftPressCallback(func) {
  const pressed = (e) => {
    if (e.key === 'Shift') func(true)
  }
  const unpressed = (e) => {
    if (e.key === 'Shift') func(false)
  }
  useEffect(() => {
    window.addEventListener('keydown', pressed)
    window.addEventListener('keyup', unpressed)
    return (() => {
      window.removeEventListener('keydown', pressed)
      window.removeEventListener('keyup', unpressed)
    })
  }, [])
}

export function useWindowResizeCallback(func) {
  const width = useWindowWidth()
  useCallback(func, [width, func])
}

export function has(set, i) {
  if (Array.isArray(set)) return set.includes(i)
  return set.has(i)
}
