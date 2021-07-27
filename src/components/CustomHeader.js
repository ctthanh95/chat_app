import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

const CustomHeader = ({ name, ...rest }) => {
    return (
        <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            {...rest}
        >
            <AntDesign name={name} size={25} color={Colors.black} />
        </TouchableOpacity>
    )
}

export default CustomHeader

