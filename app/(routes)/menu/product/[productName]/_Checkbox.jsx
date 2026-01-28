'use client'

import { addOn } from '@/app/lib/features/cartSlice/cartSlice'
import { all } from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const Checkbox = ({ item, pizzaId, setToppings, toppings, name }) => {
    const dispatch = useDispatch()
    const [selection, setSelection] = useState('')
    const [allData, setAllData] = useState([])
    // Handle selection change for each group
    const handleSelectionChange = (value) => {
        setSelection(value);
        console.log(value)
        // dispatch(addOn(value))
    };
    const handleAllData = (item, ind) => {

        setToppings(prev => {
            return [...prev, item]
        })

        // } else {
        //     setToppings(prev => {
        //         const temp = prev
        //         temp[ind] = item
        //         return temp
        //     })
        // }
    }
    useEffect(() => {
        console.log(toppings)
    }, [toppings])

    return (
        <tr key={item?._id}>

            <td className="py-2 px-4 border-b">
                {item?.name}
            </td>
            <td className="py-2 px-4 border-b text-center">
                <input
                    className="mx-2"
                    type="checkbox"
                    name={`single-${item?._id}`}
                    checked={selection === `single-${item?._id}`}
                    onChange={() => {
                        handleAllData({ id: `single-${item?._id}`, name: item.name, single: item?.singlePrice }, 1)
                        handleSelectionChange(`single-${item?._id}`)
                    }}


                />
                <>{item?.singlePrice} £</>


            </td>
            <td className="py-2 px-4 border-b text-center">

                <div>
                    <input
                        className="mx-2"
                        type="checkbox"
                        checked={selection === `double-${item?._id}`}
                        onChange={() => {
                            handleAllData({ id: `single-${item?._id}`, name: item.name, double: item?.doublePrice }, 2)
                            handleSelectionChange(`double-${item?._id}`)
                        }}

                    />
                    {item?.doublePrice} £
                </div>




            </td>
        </tr>
    )
}

export default Checkbox