"use client"
import { VscError } from "react-icons/vsc";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";


const page = () =>{
    const router = useRouter()
    return (
        <div className="mx-10 mb-10 flex flex-col gap-4 items-center bg-red-600 justify-center h-[60vh] rounded-lg" >
            <VscError className=" text-white" size={100}/>
  <div className="text-4xl ms-2 text-white font-bold ">Sorry Unfortunately , Payment is Failed   </div>
  <div onClick={()=>router.push("../order/checkout")} className="text-white cursor-pointer flex items-center gap-2 hover:text-lg mt-2"><IoIosArrowRoundForward/>Go Back to checkout page</div>
        </div>
    )
}

export default page