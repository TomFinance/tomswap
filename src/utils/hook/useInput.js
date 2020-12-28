import { useState } from "react"

const useInput = defaultValue => {
    const [value, setValue] = useState(defaultValue)

    const onChange = event => {
        const {
            target: { value }
        } = event
        setValue(value)
    }

    return { value, setValue, onChange }
}

export default useInput