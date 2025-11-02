import { PropsWithChildren, useEffect, useState } from 'react'
import { useCollapse } from 'react-collapsed'

interface Props {
  isActive?: boolean
}

const Collapse = ({ isActive, children }: PropsWithChildren<Props>) => {
  const [isExpanded, setExpanded] = useState(isActive)
  const { getCollapseProps } = useCollapse({
    isExpanded,
  })

  useEffect(() => {
    setExpanded(isActive)
  }, [isActive, setExpanded])

  return <div {...getCollapseProps()}>{children}</div>
}

export default Collapse
