import React, { useState } from 'react'
import Checkbox from './_Checkbox'

const RenderTable = ({ data, pizzaId, name }) => {
    const [toppings, setToppings] = useState([])
    return (
        <div className="mt-4">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b"></th>
                        <th className="py-2 px-4 border-b">Single £</th>
                        <th className="py-2 px-4 border-b">Double £</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <Checkbox item={item} pizzaId={pizzaId} setToppings={setToppings} toppings={toppings} name={name} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RenderTable