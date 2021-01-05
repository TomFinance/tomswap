import React, { useCallback, useEffect, useRef, useState } from 'react'

const HelpBox = ({ helpText }) => {
    const helpRef = useRef(null)
    const [showHelpBox, setShowHelpBox] = useState(false)

    const clickEvent = useCallback(e => {
        if (e.target.className === 'q_ico') {
            setShowHelpBox(!showHelpBox)
        } else if (e.target.className !== 'help_box' && !e.path.includes(helpRef.current)) {
            setShowHelpBox(false)
        }
    }, [showHelpBox])

    useEffect(() => {
        document.addEventListener('click', clickEvent)
        return () => {
            document.removeEventListener('click', clickEvent)
        }
    }, [clickEvent])

    return (
        <button className="q_ico" ref={helpRef}>
            {showHelpBox && (
                <div className="help_box" style={{ height: 'auto', lineHeight: '1.44', textAlign: 'center' }}>
                    {helpText}
                </div>
            )
            }
        </button >
    )
}

export default HelpBox