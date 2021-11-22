import { autocomplete } from "@algolia/autocomplete-js"
import React, { createElement, Fragment, useEffect, useRef } from "react"
import { render } from "react-dom"
import "@algolia/autocomplete-theme-classic"

function Autocomplete(props) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children, root)
      },
      ...props,
    })

    return () => {
      search.destroy()
    }
  }, [props])

  return <div className="h-full w-full" ref={containerRef} />
}

export default Autocomplete