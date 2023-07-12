import React, {useState} from 'react'
import {HexColorPicker} from "react-colorful";
import 'bootstrap/dist/css/bootstrap.min.css'

function Config() {
    const [color, setColor] = useState("#aabbcc");
    return (
        <>
            <HexColorPicker color={color} onChange={setColor}/>);
            <button style={{backgroundColor: color}} className={'bt btn-primary'}></button>
        </>
    )
}

export default Config
