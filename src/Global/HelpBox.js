import React, { useCallback, useEffect, useRef, useState } from 'react'

const HelpBox = ({ id = 0, helpText }) => {
    const helpRef = useRef(null)
    const [showHelpBox, setShowHelpBox] = useState(false)

    const clickEvent = useCallback(e => {
        console.log(e.target.className)
        if (e.target.className === `q_ico ${id}`) {
            setShowHelpBox(!showHelpBox)
        } else if (e.target.className !== `help_box ${id}` && !e.path.includes(helpRef.current)) {
            setShowHelpBox(false)
        }
    }, [id, showHelpBox])

    useEffect(() => {
        document.addEventListener('click', clickEvent)
        return () => {
            document.removeEventListener('click', clickEvent)
        }
    }, [clickEvent])

    return (
        <button className={`q_ico ${id}`} ref={helpRef}>
            {showHelpBox && (
                <div className={`help_box ${id}`} style={{ height: 'auto', lineHeight: '1.44', textAlign: 'center' }}>
                    {helpText}
                </div>
            )
            }
        </button >
    )
}

export default HelpBox